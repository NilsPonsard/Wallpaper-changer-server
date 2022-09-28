import { apiContext } from '../api/serialization.ts';

import { checkAccessToken } from './token.ts';
import { Token } from '../database/token.ts';
import { User } from '../database/user.ts';

export async function jwtMiddleware(ctx: apiContext, next: () => Promise<unknown>) {
  const { request, state } = ctx;
  try {
    const jwt = request.headers.get('authorization')?.split('Bearer ')?.[1] || '';

    const valid = await checkAccessToken(jwt);
    if (!valid) {
      throw new Error('Invalid token');
    }

    const user = await Token.where('access', jwt).hasOne(User);

    console.log(user)
    if (user) {
      state.user = user;
    }
  } catch (error) {
    console.log(error);
    state.user = null;
  }
  await next();
}
