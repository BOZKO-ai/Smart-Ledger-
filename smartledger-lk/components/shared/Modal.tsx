import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

/**
 * Shared Generic Modal wrapper.
 */
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg p-6 relative">
        <button className="absolute top-3 right-3 text-slate-400 hover:text-slate-600" onClick={onClose}>
          ✕
        </button>
        <h3 className="text-lg font-bold text-slate-900 mb-4">{title}</h3>
        <div>{children}</div>
      </div>
    </div>
  );
};
