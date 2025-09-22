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
    <Modal isOpen={isOpen} onClose={onClose} title="投稿を削除">
      <div>
        <p className="text-gray-600 mb-2">
          以下の投稿を削除してもよろしいですか？
        </p>
        <p className="text-gray-800 font-medium mb-6 p-3 bg-gray-50 rounded">
          「{title}」
        </p>
        <div className="bg-red-50 border border-red-200 rounded p-3 mb-6">
          <p className="text-red-700 text-sm">
            ⚠️
            この操作は取り消すことができません。削除された投稿は復元できません。
          </p>
        </div>
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
