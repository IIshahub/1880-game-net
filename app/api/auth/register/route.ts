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

    if (!isValidUsername(username)) {
      return NextResponse.json(
        { error: 'Username must be 3–24 chars: a-z, 0-9, underscore.' },
        { status: 400 },
      );
    }
    if (!isValidPassword(password)) {
      return NextResponse.json(
        { error: 'Password must be 6–72 characters.' },
        { status: 400 },
      );
    }

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return NextResponse.json({ error: 'Username is already taken.' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, passwordHash },
      select: { id: true, username: true },
    });

    const token = await createSessionToken({ userId: user.id, username: user.username });
    await setSessionCookie(token);

    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    console.error('register error', err);
    return NextResponse.json({ error: 'Could not register.' }, { status: 500 });
  }
}
