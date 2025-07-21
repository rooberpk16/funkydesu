import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pqopmjersbdbpjdxmbyq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxb3BtamVyc2JkYnBqZHhtYnlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2MjgzODcsImV4cCI6MjA2ODIwNDM4N30.2yhuOWHbJiwoO_VZBrAOqvys-iqOIRAS9Sr6gbFJE9U';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);