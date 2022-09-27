import { create, verify } from 'https://deno.land/x/djwt@v2.7/mod.ts';
import { config } from '../../config.ts';

// Create a new token and return it and the uuid
export async function newToken() {
  const uuid = crypto.randomUUID();
  const token = await create({ alg: 'ES384', typ: 'JWT' }, { id: uuid }, config.jwt_pair.priv);

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
