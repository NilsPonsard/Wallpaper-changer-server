import { appContext } from '../api/serialization.ts';

import { verifyToken } from './token.ts';
import { Token } from '../database/token.ts';

export async function jwtMiddleware(ctx: appContext, next: () => Promise<void>) {
  const { request, state } = ctx;
  try {
    const jwt = request.headers.get('authorization')?.split('bearer ')?.[1] || '';

    const validatedJwt = await verifyToken(jwt);

    if (!validatedJwt) {
      state.user = null;
    }

    try {
      const user = await Token.where('access', jwt).user();

      if (!user) {
        state.user = null;
      }

      state.user = user;
    } catch (_) {
      state.user = null;
    }
    await next();
  } catch (error) {
    console.log(error);
    state.user = null;
  }
}
