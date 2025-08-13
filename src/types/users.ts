import { StaticImport } from "next/dist/shared/lib/get-img-props";

export interface User {
  nickname: string;
  email: string;
  profileImageUrl: string | null;
}
