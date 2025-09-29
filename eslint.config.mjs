import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn", // 에러(error) 대신 경고(warn)로 표시
        {
          // '^_`는 '밑줄로 시작하는' 이라는 의미의 정규표현식입니다.
          // 이 패턴에 맞는 인자(argument)는 사용하지 않아도 경고하지 않도록 설정합니다.
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
];

export default eslintConfig;
