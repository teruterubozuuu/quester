export type Platforms = {
  id: string;
  name: string;
}

export type Genres = {
  id: string;
  name: string;
}

export type GameDetails = {
  id: number;
  name: string;
  cover: string;
  game_type: string;
  genres: Genres[];
  platforms: Platforms[];
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
  genre: Genres[];
  platforms: Platforms[];
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
  exp: number;
  created_at: string | number;
}
