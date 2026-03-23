export const MIGRATION_SQL = `
ALTER TABLE stories 
  ADD COLUMN IF NOT EXISTS url text,
  ADD COLUMN IF NOT EXISTS hero boolean 
    DEFAULT false,
  ADD COLUMN IF NOT EXISTS timestamp 
    text DEFAULT 'just now',
  ADD COLUMN IF NOT EXISTS read_time 
    text DEFAULT '5 min',
  ADD COLUMN IF NOT EXISTS trending 
    text DEFAULT '+0%';
`;
