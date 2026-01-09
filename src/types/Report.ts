export type Hazard = {
  id: number;
  user_id: number | null;
  lat: number;
  lng: number;
  description: string;
  status: "open" | "claimed" | "completed";
  claimed_by: number | null;
  completed_by: number | null;
  created_at: string;
  updated_at: string;
  created_by_username?: string | null;
  claimed_by_username?: string | null;
  completed_by_username?: string | null;
};

export type User = {
  id: number;
  username: string;
  email: string;
  created_at: string;
};
