/** v7 (P6): the GET /teams/me data shape, same as TeamsService.view() in the backend. */
export const TEAM_MAX_MEMBERS = 10;

interface TeamMemberView {
  userId: string;
  email: string;
  name: string | null;
  role: "owner" | "member";
  joinedAt: string;
  /** Owner only. */
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
  /** Monthly limit period (WIB), e.g. "2026-10". */
  period: string;
  me: { payWithTeam: boolean; monthlyLimit: number | null; spentMonth: number };
  members: TeamMemberView[];
  invites: { id: string; email: string; expiresAt: string; createdAt: string }[];
}
