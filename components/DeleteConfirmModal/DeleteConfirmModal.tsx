import React from "react";
import Modal from "@/components/Modal/Modal";
import Button from "@/components/Button/Button";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  isDeleting?: boolean;
}

export const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  isDeleting = false,
}: DeleteConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="確認">
      <div>
        <p className="text-[#5A4A4A] mb-6" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
          「{title}」を削除しますか？
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            キャンセル
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? "削除中..." : "削除する"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
