import InputField from "./InputField";
import MaterialIcon from "./MaterialIcon";

export default function DynamicPieceManager({ pieces, onPiecesChange, errors }) {
    const addPiece = () =>
        onPiecesChange([...pieces, { id: Date.now(), niveau: "", surface: "" }]);

    const updatePiece = (id, field, value) =>
        onPiecesChange(pieces.map((p) => (p.id === id ? { ...p, [field]: value } : p)));

    const removePiece = (id) => onPiecesChange(pieces.filter((p) => p.id !== id));

    return (
        <div className="mb-6">
            <div className="flex justify-between mb-4">
                <label className="text-sm font-medium text-gray-700">Caractéristiques des pièces</label>
                <button onClick={addPiece} className="flex items-center bg-[#269745] text-white px-3 py-1 rounded-lg">
                    <MaterialIcon name="add" /> <span>Ajouter</span>
                </button>
            </div>

            {pieces.map((piece, i) => (
                <div key={piece.id} className="p-4 border rounded-lg bg-gray-50 mb-4">
                    <div className="flex justify-between mb-3">
                        <h4 className="text-sm font-semibold">Pièce {i + 1}</h4>
                        <button onClick={() => removePiece(piece.id)} className="text-red-500 hover:text-red-700">
                            <MaterialIcon name="delete" />
                        </button>
                    </div>
                    <InputField
                        label="Niveau"
                        type="number"
                        value={piece.niveau}
                        onChange={(e) => updatePiece(piece.id, "niveau", e.target.value)}
                        error={errors[`pieces_${piece.id}_niveau`]}
                    />
                    <InputField
                        label="Surface (m²)"
                        type="number"
                        value={piece.surface}
                        onChange={(e) => updatePiece(piece.id, "surface", e.target.value)}
                        error={errors[`pieces_${piece.id}_surface`]}
                    />
                </div>
            ))}
        </div>
    );
}
