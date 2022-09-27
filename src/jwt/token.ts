import { create, getNumericDate, verify } from 'https://deno.land/x/djwt@v2.7/mod.ts';
import { config } from '../../config.ts';
import { Token } from '../database/token.ts';
import { ACCESS_EXPIRATION, REFRESH_EXPIRATION } from './expiration.ts';

export async function newTokenPair() {
  const access = await newToken(ACCESS_EXPIRATION);
  const refresh = await newToken(REFRESH_EXPIRATION);
  return { access: access.token, refresh: refresh.token };
}

// Create a new token and return it and the uuid
export async function newToken(expSeconds: number) {
  const uuid = crypto.randomUUID();
  const token = await create(
    { alg: 'ES384', typ: 'JWT' },
    { id: uuid, exp: getNumericDate(expSeconds) },
    config.jwt_pair.priv,
  );

  return { token, uuid };
}

// Veryfy and extract payload from token, returns null if invalid
export async function verifyToken(token: string) {
  try {
    const validatedJwt = await verify(token, config.jwt_pair.pub);
    return validatedJwt;
  } catch (_) {
    return null;
  }
}

export async function registerNewTokenPair(userId: number) {
  const pair = await newTokenPair();
  await Token.create({ access: pair.access, refresh: pair.refresh, userId });
  return pair;
}

export async function checkAccessToken(token: string) {
  const validatedJwt = await verifyToken(token);
  if (!validatedJwt) {
    return false;
  }

  const token_db = await Token.where('access', token).first();
  if (!token_db) {
    return false;
  }
  if (token_db.createdAt && token_db.createdAt < Date.now() + ACCESS_EXPIRATION * 1000) return true;
}

export async function checkRefreshToken(token: string) {
  const validatedJwt = await verifyToken(token);
  if (!validatedJwt) {
    return null;
  }

  const token_db = await Token.where('refresh', token).first();
  if (!token_db) {
    return null;
  }
  if (token_db.createdAt && token_db.createdAt < Date.now() + REFRESH_EXPIRATION * 1000)
    return token_db;
  return null
}
