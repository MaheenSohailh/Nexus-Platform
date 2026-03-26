import React, { useState } from "react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (title: string) => void;
}

const MeetingModal: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
    const [title, setTitle] = useState("");

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-6 rounded-lg w-80 shadow-lg">
                <h2 className="text-lg font-semibold mb-3">Schedule Meeting</h2>

                <input
                    type="text"
                    placeholder="Meeting title"
                    className="w-full border p-2 rounded mb-4"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-3 py-1 bg-gray-300 rounded"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => {
                            if (!title.trim()) return;
                            onSave(title);
                            setTitle("");
                        }}
                        className="px-3 py-1 bg-indigo-600 text-white rounded"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MeetingModal;