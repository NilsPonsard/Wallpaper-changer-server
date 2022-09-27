import { appContext } from '../api/serialization.ts';

import { create, verify } from 'https://deno.land/x/djwt@v2.7/mod.ts';
import { User } from '../database/user.ts';
import { config } from '../../config.ts';

export async function jwtMiddleware(ctx: appContext, next: () => Promise<void>) {
  try {
    const { request, state } = ctx;

    const jwt = request.headers.get('authorization')?.split('bearer ')?.[1] || '';

    const validatedJwt = await verify(jwt, config.JWT_SECRET);

    if (!validatedJwt) {
      state.user = null;
    }

    const user = await User.findOneById(validatedJwt?.payload?.id! as string);
    if (!user) {
      state.user = null;
    }

    state.user = user;
    await next();
  } catch (error) {
    throw error;
  }
}
