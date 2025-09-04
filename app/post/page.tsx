import React from "react";

export default function Post() {
  return (
    <div className="border rounded-lg mt-5 mx-6 min-w-[400px] bg-gray-50 px-5 py-2">
      <p className="font-semibold text-shadow-black mb-2">タイトル</p>
      <input
        type="text"
        className="border w-full p-2 my-3 rounded-lg"
        placeholder="(例)冬毛布"
      />
    </div>
  );
}
