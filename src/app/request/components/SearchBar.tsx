"use client";

import React, { useState } from "react";
import Input from "@/components/ui/Input";

export default function SearchBar() {
  const [keyword, setKeyword] = useState("");

  const handleSearchChange = (value: string) => {
    setKeyword(value);
  };

  return (
    // ...
    <Input
      type="search"
      value={keyword}
      placeholder="어떤 고객님을 찾고 계세요?"
      onChange={handleSearchChange}
      className="w-full max-w-full"
      icon="left"
    />
  );
}
