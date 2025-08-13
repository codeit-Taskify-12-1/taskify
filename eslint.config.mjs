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
    rules: {
      "@typescript-eslint/no-explicit-any": "off", //  any 타입 허용
      "@typescript-eslint/no-unused-vars": "off", // 안쓰는 변수 허용
      "react-hooks/exhaustive-deps": "off",  //useEffect dependency 없어도 허용용
    },
  },
];

export default eslintConfig;
