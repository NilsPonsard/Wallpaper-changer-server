import { Context } from 'https://deno.land/x/oak@v11.1.0/context.ts';
import { User } from '../database/user.ts';

export type apiContext = Context<{ body_json: unknown; user: Omit<User, 'password'> | null }>;

// parse json body
export async function deserializerMiddleware(ctx: apiContext, next: () => Promise<unknown>) {
  try {
    ctx.state.body_json = await ctx.request.body({ type: 'json' }).value;
  } catch (_) {
    ctx.state.body_json = null;
  }

  await next();
}
