"use client";

import React, { useState } from "react";
import Input from "@/components/ui/Input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <Input
      type="search"
      value={value}
      placeholder="어떤 고객님을 찾고 계세요?"
      onChange={onChange}
      className="w-full max-w-full"
      icon="left"
    />
  );
}
