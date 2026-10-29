export type GameDetails = {
  id: number;
  name: string;
  cover: string;
  game_type: string;
  genres: string[];
  platforms: string[];
  summary: string;
  total_rating: number;
  url: string;
  game_localizations: string[];
  game_engines: string[];
  franchise: string;
  first_release_date: string;
  dlcs: string[];
  parent_game: string[];
  age_ratings: string;
};

export type SavedGame = {
  id: string;
  user_id: string;
  title: string;
  cover: string;
  summary: string | null;
  release_date: string | null;
  category: string | null;
  genre: string[];
  platforms: string[];
  total_ratings: number | null;
  url: string | null;
  status: string;
  created_at: string;
};

export type QuestData = {
  id: string;
  game_id: string;
  title: string;
  difficulty: string;
  status: string;
  exp: number[];
  created_at: string | number;
}
