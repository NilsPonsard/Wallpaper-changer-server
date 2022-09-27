import { Context } from 'https://deno.land/x/oak@v11.1.0/context.ts';
import { User } from '../database/user.ts';

export type appContext = Context<{ body_json: unknown; user: Omit<User, 'password'> | null }>;

// parse json body
export async function deserializerMiddleware(ctx: appContext, next: () => Promise<unknown>) {
  try {
    ctx.state.body_json = ctx.request.body({ type: 'json' }).value;
  } catch (err) {
    ctx.state.body_json = null;
    console.error(err);
  }

  await next();
}

// serialize json body
export async function serializerMiddleware(ctx: Context, next: () => Promise<unknown>) {
  await next();
  ctx.response.body = JSON.stringify(ctx.response.body);
  ctx.response.headers.set('Content-Type', 'application/json');
}
