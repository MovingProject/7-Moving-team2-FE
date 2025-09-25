import React from "react";
import clsx from "clsx";

interface ChatBubbleProps {
  message: string;
  isMe?: boolean;
  theme?: "primary" | "light-primary" | "white";
}

const themeStyles = {
  primary: "bg-primary text-white",
  "light-primary": "bg-primary-light text-primary",
  white: "bg-white",
};

export default function ChatBubble({ message, isMe = false, theme = "primary" }: ChatBubbleProps) {
  return (
    <div className={clsx("flex w-full", isMe ? "justify-end" : "justify-start")}>
      <div
        className={clsx(
          "shadow-chat max-w-[248px] rounded-3xl px-5 py-3 text-sm lg:max-w-[520px] lg:rounded-4xl lg:px-10 lg:py-5 lg:text-lg",
          themeStyles[theme],
          isMe ? "rounded-tr-none lg:rounded-tr-none" : "rounded-tl-none lg:rounded-tl-none"
        )}
      >
        {message}
      </div>
    </div>
  );
}
