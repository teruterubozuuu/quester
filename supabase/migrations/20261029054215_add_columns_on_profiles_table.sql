ALTER TABLE profiles
ADD COLUMN total_exp integer DEFAULT 0,
ADD COLUMN current_exp integer DEFAULT 0,
ADD COLUMN credibility_points integer DEFAULT 0,
ADD COLUMN level integer DEFAULT 1;