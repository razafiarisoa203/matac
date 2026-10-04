// src/utils/alignmentNotifications.js

const ORG_NAME = 'MATAC'; // remplace par 'MATAC' si besoin

// Date du jour au format jj/mm/aaaa
export const formatToday = () => new Date().toLocaleDateString('fr-FR');

// Numéro du dossier à afficher dans l'email de confirmation.
// - referenceAlignement (ex. "REF-20260129-143") n'est rempli par le backend qu'au moment
//   du traitement : il est donc null juste après la création.
// - id_align est le numéro du dossier, disponible dès la création.
export const getAlignmentReference = (result) => {
  const data = result?.data ?? result;
  return data?.referenceAlignement ?? data?.id_align ?? null;
};

export const buildConfirmationEmail = ({ reference, date = formatToday() }) => {
  const refFr = reference ? ` sous référence n°<strong>${reference}</strong>` : '';
  const refMg = reference ? ` araka ny laharana faha-<strong>${reference}</strong>.` : '.';

  // Le serveur rend le corps en HTML : on utilise donc des balises pour la mise en page
  const body = `
<div style="background:#f4f4f4;padding:24px 0;font-family:Arial,Helvetica,sans-serif;">
  <table align="center" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;max-width:100%;">
    <tr>
      <td style="padding:24px 32px 8px;text-align:center;font-size:18px;font-weight:bold;color:#222;">
        ${ORG_NAME}
      </td>
    </tr>
    <tr>
      <td style="padding:16px 32px;font-size:14px;line-height:1.6;color:#222;">
        <p style="margin:0 0 16px;">
          Nous vous informons que votre dossier a été bien enregistré${refFr} en date du ${date} :
        </p>
        <p style="margin:0 0 16px;">
          Izahay dia faly mampahafantatra anao fa ny fangatahanao dia voaray tsara${refMg} ny ${date} :
        </p>
        <p style="margin:0;">L'équipe ${ORG_NAME}</p>
      </td>
    </tr>
  </table>
</div>`;

  return {
    subject: reference
      ? `Enregistrement des dossiers ${reference}`
      : 'Enregistrement des dossiers',
    body,
  };
};

export const buildProcessorMessage = (fullName) =>
  `Nouvelle demande d'alignement de ${fullName}`;