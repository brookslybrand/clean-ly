import { createClient } from '@supabase/supabase-js';
import invariant from 'tiny-invariant';

import { prisma } from '~/db.server';

export type { User } from '@prisma/client';

// Abstract this away
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

invariant(
  supabaseUrl,
  'SUPABASE_URL must be set in your environment variables.'
);
invariant(
  supabaseAnonKey,
  'SUPABASE_ANON_KEY must be set in your environment variables.'
);

// TODO: Think about moving this and following a pattern like db.server.ts
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function createUser(email: string, password: string) {
  // Create the user in "auth"
  const { user } = await supabase.auth.signUp({
    email,
    password,
  });
  invariant(user !== null, 'Failed to create user');

  // Create the user in the database
  const dbUser = await prisma.user.create({ data: { id: user.id, email } });
  return dbUser;
}

export async function getUserById(id: string) {
  return await prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email?: string) {
  return await prisma.user.findUnique({ where: { email } });
}

export async function verifyLogin(email: string, password: string) {
  const { user, error } = await supabase.auth.signIn({
    email,
    password,
  });

  if (error) return undefined;
  return await getUserByEmail(user?.email);
}
