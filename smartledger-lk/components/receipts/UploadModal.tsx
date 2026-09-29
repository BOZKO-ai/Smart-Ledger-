import React from "react";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * UploadModal Component.
 * Drag & drop pop-up for uploading transaction receipts from computer or photo library.
 */
export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg p-6 relative">
        <button className="absolute top-3 right-3 text-slate-400 hover:text-slate-600" onClick={onClose}>
          ✕
        </button>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Upload Receipt Document</h3>
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center bg-slate-50 hover:bg-slate-100 cursor-pointer">
          <span className="text-2xl">📁</span>
          <p className="mt-2 text-xs text-slate-600">Select file (PDF, PNG, JPG)</p>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button className="px-4 py-2 border rounded-md text-sm text-slate-700" onClick={onClose}>
            Cancel
          </button>
          <button className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md text-sm">
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};
