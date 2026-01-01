import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lillhacqwjhrqklmtjtz.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpbGxoYWNxd2pocnFrbG10anR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNTM5NjMsImV4cCI6MjA4MjgyOTk2M30.9CbTK64YnIPH53T3n2zolJFJDa-A18qg7yp6UORiCi4';

export const supabase = createClient(supabaseUrl, supabaseKey);