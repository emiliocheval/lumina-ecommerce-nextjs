import { supabase } from './supabase';

// Sign up with email and password
export async function signUp(email: string, password: string) {
  return supabase.auth.signUp({ email, password });
}

// Sign in with email and password
export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

// Sign out
export async function signOut() {
  return supabase.auth.signOut();
}

// Get current user (client-side)
export function getUser() {
  return supabase.auth.getUser();
} 