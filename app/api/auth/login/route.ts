import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import {
  createSessionToken,
  isValidPassword,
  isValidUsername,
  normalizeUsername,
  setSessionCookie,
} from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = normalizeUsername(String(body.username ?? ''));
    const password = String(body.password ?? '');

    if (!isValidUsername(username) || !isValidPassword(password)) {
      return NextResponse.json({ error: 'Invalid username or password.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
    }

    const token = await createSessionToken({ userId: user.id, username: user.username });
    await setSessionCookie(token);

    return NextResponse.json({ user: { id: user.id, username: user.username } });
  } catch (err) {
    console.error('login error', err);
    return NextResponse.json({ error: 'Could not log in.' }, { status: 500 });
  }
}
