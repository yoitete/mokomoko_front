"use client";

import React, { useState } from "react";
import Modal from "@/components/Modal/Modal";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import { useAuth } from "@/hooks/useAuth";

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PasswordResetModal({
  isOpen,
  onClose,
}: PasswordResetModalProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("メールアドレスを入力してください");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      await resetPassword(email);
      setMessage(
        "パスワードリセットメールを送信しました。メールをご確認ください。"
      );
      setEmail("");
    } catch {
      setError("メールの送信に失敗しました。メールアドレスをご確認ください。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setMessage("");
    setError("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="パスワードリセット">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[#5A4A4A] mb-2"
            style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
          >
            メールアドレス
          </label>
          <Input
            id="email"
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-[#C4B5B5] focus:border-[#7E6565] focus:ring-[#7E6565]"
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {message && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600 text-sm">{message}</p>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="flex-1"
            disabled={isLoading}
          >
            キャンセル
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={isLoading || !email.trim()}
          >
            {isLoading ? "送信中..." : "送信"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
