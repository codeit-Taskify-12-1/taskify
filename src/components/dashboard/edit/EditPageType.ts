import { StaticImport } from "next/dist/shared/lib/get-img-props";

// InvitationContainer
type Inviter = {
  nickname: string;
  email: string;
  id: number;
};

type Dashboard = {
  title: string;
  id: number;
};

type Invitee = {
  nickname: string;
  email: string;
  id: number;
};

export interface InviteItem {
  id: number;
  inviter: Inviter;
  teamId: string;
  dashboard: Dashboard;
  invitee: Invitee;
  inviteAccepte: boolean;
  createdAt: string;
  updatedA: string;
}

// MemberContainer
export interface MemberItem {
  id: number;
  email: string;
  isOwner: boolean;
  nickname: string;
  createdAt: string;
  updatedAt: string;
  profileImageUrl: null | string | StaticImport;
  userId: number;
}
