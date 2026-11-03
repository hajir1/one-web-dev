/** v7 (P6): bentuk data GET /teams/me — sama dengan TeamsService.view() di backend. */
export const TEAM_MAX_MEMBERS = 10;

interface TeamMemberView {
  userId: string;
  email: string;
  name: string | null;
  role: "owner" | "member";
  joinedAt: string;
  /** Hanya untuk pemilik. */
  monthlyLimit?: number | null;
  spentMonth?: number;
  payWithTeam?: boolean;
}

export interface TeamView {
  id: string;
  name: string;
  role: "owner" | "member";
  balance: number;
  maxMembers: number;
  /** Periode batas bulanan (WIB), mis. "2026-10". */
  period: string;
  me: { payWithTeam: boolean; monthlyLimit: number | null; spentMonth: number };
  members: TeamMemberView[];
  invites: { id: string; email: string; expiresAt: string; createdAt: string }[];
}
