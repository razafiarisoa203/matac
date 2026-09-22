import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ChevronRight, Loader2, UserRound } from "lucide-react";
import { authService } from "../../services/api/authService";
import { citoyenService } from "../../services/api/citoyenService";
import keycloak from "../../auth/keycloak";
import { completeCitizenRegistration } from "../../auth/ssoFlow";

const profileFields = [
	["Nom", "citizen_name"],
	["Prénom", "citizen_lastname"],
	["Téléphone", "user_phone"],
	["Numéro de carte nationale", "citizen_national_card_number"],
	["Adresse e-mail", "citizen_mail"],
];

const completionFields = [
	["Téléphone", "user_phone", "tel"],
	["Adresse e-mail", "user_email", "email"],
	["Nom", "citizen_name", "text"],
	["Prénom", "citizen_lastname", "text"],
	["Numéro de carte nationale", "citizen_national_card_number", "text"],
];

const formatValue = (value) => {
	if (value === null || value === undefined || value === "") return "Non renseigné";
	return String(value);
};

export default function RegisterComplete() {
	const navigate = useNavigate();
	const [user, setUser] = useState(() => authService.getUserInfo());
	const [completionData, setCompletionData] = useState({});
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [submitError, setSubmitError] = useState("");

	useEffect(() => {
		let active = true;

		const loadProfile = async () => {
			if (!authService.isAuthenticated()) {
				navigate("/", { replace: true });
				return;
			}

			try {
				const tokenUser = authService.getUserInfo();
				const userId = tokenUser.user_id || tokenUser.id || tokenUser.sub;
				const userProfile = await authService.getUserById(userId);
				const citizenId =
					userProfile?.id_citizen || userProfile?.citizen_id || tokenUser.id_citizen;
				const citizenProfile = citizenId
					? await citoyenService.getCitizenData(citizenId)
					: null;

				if (citizenProfile?.id_citizen) {
					authService.setUserProfile({ ...userProfile, ...citizenProfile });
				}

				if (active) {
					const mergedProfile = {
						...tokenUser,
						...(userProfile || {}),
						...(citizenProfile?.id_citizen ? citizenProfile : {}),
					};
					if (!mergedProfile.citizen_mail && mergedProfile.user_email) {
						mergedProfile.citizen_mail = mergedProfile.user_email;
					}
					if (!mergedProfile.user_email && mergedProfile.citizen_mail) {
						mergedProfile.user_email = mergedProfile.citizen_mail;
					}
					setUser(mergedProfile);
					setCompletionData(
						Object.fromEntries(
							completionFields
								.filter(([, key]) => !mergedProfile[key])
								.map(([, key]) => [key, ""])
						)
					);
				}
			} catch (profileError) {
				console.error("Erreur lors du chargement du profil :", profileError);
				if (active) setError("Les informations du profil n'ont pas pu être chargées.");
			} finally {
				if (active) setLoading(false);
			}
		};

		loadProfile();
		return () => {
			active = false;
		};
	}, [navigate]);

	const handleCompletionChange = (event) => {
		const { name, value } = event.target;
		setCompletionData((current) => ({ ...current, [name]: value }));
	};

	const handleContinue = async () => {
		setSubmitError("");
		const fieldsToSend = Object.fromEntries(
			Object.entries(completionData).filter(([, value]) => value.trim() !== "")
		);

		if (Object.keys(fieldsToSend).length === 0) {
			navigate("/dashboard", { replace: true });
			return;
		}

		if (!keycloak.token) {
			setSubmitError("La session SSO a expiré. Veuillez vous reconnecter.");
			return;
		}

		setSubmitting(true);
		try {
			await completeCitizenRegistration(keycloak.token, fieldsToSend);
			navigate("/dashboard", { replace: true });
		} catch (submitErrorValue) {
			console.error("Erreur lors de la complétion du profil :", submitErrorValue);
			setSubmitError("Impossible d'enregistrer les informations. Veuillez réessayer.");
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) {
		return (
			<main className="min-h-screen bg-green-50 flex items-center justify-center">
				<div className="flex items-center gap-3 text-green-800" role="status">
					<Loader2 className="h-6 w-6 animate-spin" />
					Chargement de votre profil...
				</div>
			</main>
		);
	}

	return (
		<main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100 px-4 py-8 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-5xl">
				<header className="mb-6 rounded-2xl bg-green-800 px-6 py-8 text-white shadow-lg sm:px-10">
					<div className="flex items-start gap-4">
						{user.citizen_photo ? (
							<img
								src={user.citizen_photo}
								alt="Photo du citoyen"
								className="h-20 w-20 rounded-full border-4 border-white/70 object-cover"
							/>
						) : (
							<div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/15">
								<UserRound className="h-10 w-10" />
							</div>
						)}
						<div>
							<p className="text-sm font-medium uppercase tracking-wider text-green-100">
								Connexion réussie
							</p>
							<h1 className="mt-1 text-2xl font-bold sm:text-3xl">
								Vérifiez vos informations
							</h1>
							<p className="mt-2 text-green-100">
								Consultez vos données avant d'accéder à votre tableau de bord.
							</p>
						</div>
					</div>
				</header>

				<section className="rounded-2xl bg-white p-6 shadow-md sm:p-10" aria-labelledby="profile-title">
					<div className="mb-6 flex items-center gap-3 border-b border-gray-200 pb-4">
						<CheckCircle2 className="h-6 w-6 text-green-600" />
						<h2 id="profile-title" className="text-xl font-semibold text-gray-900">
							Informations du compte
						</h2>
					</div>

					{error && (
						<p className="mb-5 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
							{error}
						</p>
					)}

					<dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
						{profileFields.map(([label, key]) => (
							<div key={key} className="border-b border-gray-100 pb-3">
								<dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</dt>
								<dd className="mt-1 break-words text-sm font-medium ">
										{formatValue(user[key])}
								</dd>
							</div>
						))}
					</dl>

							{Object.keys(completionData).length > 0 && (
								<div className="mt-8 border-t border-gray-200 pt-6">
									<h3 className="text-lg font-semibold text-gray-900">Informations à compléter</h3>
									<p className="mt-1 text-sm text-gray-500">
										Ces champs sont envoyés après validation de votre profil.
									</p>
									<div className="mt-4 grid gap-4 sm:grid-cols-2">
										{completionFields
											.filter(([, key]) => Object.prototype.hasOwnProperty.call(completionData, key))
											.map(([label, key, type]) => (
												<label key={key} className="text-sm font-medium text-gray-700">
													{label}
													<input
														type={type}
														name={key}
														value={completionData[key]}
														onChange={handleCompletionChange}
														className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-200"
													/>
												</label>
											))}
									</div>
								</div>
							)}

							{submitError && (
								<p className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</p>
							)}

					<div className="mt-8 flex justify-end border-t border-gray-200 pt-6">
						<button
							type="button"
							onClick={handleContinue}
							disabled={submitting}
							className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
						>
							{submitting ? "Enregistrement..." : "Accéder au tableau de bord"}
							<ChevronRight className="h-5 w-5" />
						</button>
					</div>
				</section>
			</div>
		</main>
	);
}
