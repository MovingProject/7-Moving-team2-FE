"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TabNavigationProps } from "@/types/tabs";

const TabNavigation: React.FC<TabNavigationProps> = ({ tabs }) => {
  const pathname = usePathname();
  console.log(pathname);

  return (
    <div className="border-b border-gray-200 lg:pt-3">
      <div className="mx-auto flex px-4 md:px-5 lg:max-w-[1400px] lg:gap-0 lg:px-5 xl:max-w-[1400px] xl:gap-8 xl:px-0">
        {tabs.map((tab) => {
          const isActive = pathname.includes(tab.path);
          console.log(isActive);
          return (
            <Link
              key={tab.path}
              href={`/quotation/${tab.path}`}
              scroll={false}
              className={`px-6 py-4 text-lg font-semibold transition-colors ${
                isActive
                  ? "border-b-2 border-black text-black"
                  : "text-gray-400 hover:text-gray-500"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default TabNavigation;
