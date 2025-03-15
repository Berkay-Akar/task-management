"use client";

import React from "react";
import { FaExclamationTriangle, FaTimes } from "react-icons/fa";
import Button from "./Button";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md border border-red-500 animate-modal-slide-up overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-red-50 dark:bg-red-900/30">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
            <FaExclamationTriangle className="text-red-500 mr-2" />
            Silme Onayı
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <FaTimes className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6">
          <p className="dahboard-heading">
            <span className="font-medium">{itemName}</span> görevini silmek
            istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </p>

          <div className="flex justify-end space-x-3">
            <Button
              variant="ghost"
              onClick={onClose}
              className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              İptal
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirm}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white"
            >
              Sil
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
