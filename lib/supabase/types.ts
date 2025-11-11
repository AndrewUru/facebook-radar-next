export type Database = {
  public: {
    Tables: {
      group_watchers: {
        Row: {
          id: string;
          user_id: string | null;
          url: string;
          group_key: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          url: string;
          group_key?: string | null;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["group_watchers"]["Insert"]>;
      };
      subscribers: {
        Row: {
          id: string;
          email: string | null;
          telegram_handle: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          email?: string | null;
          telegram_handle?: string | null;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["subscribers"]["Insert"]>;
      };
      analyses: {
        Row: {
          id: string;
          source: string;
          payload: Record<string, unknown>;
          analysis: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          source: string;
          payload: Record<string, unknown>;
          analysis: string;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["analyses"]["Insert"]>;
      };
    };
    Views: never;
    Functions: never;
    Enums: never;
  };
};
