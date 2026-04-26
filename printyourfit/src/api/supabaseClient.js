import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vvhtvjxvzlxiajodktje.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2aHR2anh2emx4aWFqb2RrdGplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMjg2NzUsImV4cCI6MjA5MTcwNDY3NX0.D8-TFrQkEz8rtSfTQYvW6pOqGt1WQ8AntjM-fPkKfc4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
