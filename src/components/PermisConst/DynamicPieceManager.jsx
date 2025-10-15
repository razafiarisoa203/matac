// ...existing code...
import React from "react";
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
            <div className="flex flex-col sm:flex-row justify-between mb-4 gap-3">
                <label className="text-sm font-medium text-gray-700">Caractéristiques des pièces</label>
                <div className="flex items-center">
                    <button onClick={addPiece} className="flex items-center bg-[#269745] text-white px-3 py-1 rounded-lg">
                        <MaterialIcon name="add" /> <span className="ml-2">Ajouter</span>
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {pieces.map((piece, i) => (
                    <div key={piece.id} className="p-4 border rounded-lg bg-gray-50">
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="text-sm font-semibold">Pièce {i + 1}</h4>
                            <button onClick={() => removePiece(piece.id)} className="text-red-500 hover:text-red-700">
                                <MaterialIcon name="delete" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField
                                label="Niveau"
                                name={`niveau_${piece.id}`}
                                type="number"
                                value={piece.niveau}
                                onChange={(e) => updatePiece(piece.id, "niveau", e.target.value)}
                                error={errors?.[`pieces_${piece.id}_niveau`]}
                            />
                            <InputField
                                label="Surface (m²)"
                                name={`surface_${piece.id}`}
                                type="number"
                                value={piece.surface}
                                onChange={(e) => updatePiece(piece.id, "surface", e.target.value)}
                                error={errors?.[`pieces_${piece.id}_surface`]}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
// ...existing code...