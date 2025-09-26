import React from "react";
import MaterialIcon from "./MaterialIcon";

export default function FileUpload({ label, files, onChange, onRemove, required = false, acceptedTypes = [] }) {
    const formatSize = (b) => (b === 0 ? "0 B" : (b / 1024).toFixed(1) + " KB");

    return (
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            {files?.map((f, i) => (
                <div key={i} className="flex items-center justify-between p-3 mb-2 bg-green-50 border rounded-lg">
                    <div className="flex items-center gap-3">
                        <MaterialIcon name="description" className="text-green-600" />
                        <div>
                            <p className="text-sm">{f.name}</p>
                            <p className="text-xs text-gray-500">{formatSize(f.size)}</p>
                        </div>
                    </div>
                    <button onClick={() => onRemove(i)} className="text-red-500 hover:text-red-700">
                        <MaterialIcon name="delete" />
                    </button>
                </div>
            ))}

            <label className="flex items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer hover:border-[#269745] hover:bg-green-50">
                <MaterialIcon name="add" />
                <span className="ml-2">Ajouter un document</span>
                <input
                    type="file"
                    className="hidden"
                    onChange={onChange}
                    accept={acceptedTypes.join(",")}
                />
            </label>
        </div>
    );
}
