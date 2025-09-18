import React from "react";
import clsx from "clsx";

interface ChatBubbleProps {
  message: string;
  isMe: boolean;
  theme?: "primary" | "light-primary" | "white";
}

const themeStyles = {
  primary: "bg-primary text-white",
  "light-primary": "bg-primary-light text-primary",
  white: "bg-white",
};

export default function ChatBubble({ message, isMe, theme = "primary" }: ChatBubbleProps) {
  return (
    <div className={clsx("flex w-full", isMe ? "justify-end" : "justify-start")}>
      <div
        className={clsx(
          "shadow-chat rounded-2xl px-10 py-5",
          themeStyles[theme],
          isMe ? "rounded-tr-none" : "rounded-tl-none"
        )}
      >
        {message}
      </div>
    </div>
  );
}
