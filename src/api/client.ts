import { Context } from 'https://deno.land/x/oak@v11.1.0/context.ts';
import { Router } from 'https://deno.land/x/oak@v11.1.0/router.ts';
import { User } from '../database/user.ts';
import { Wallpaper } from '../database/wallpaper.ts';

type clientContext = Context<{ user: User | null }>;

export const router = new Router<{ user: User }>({ prefix: '/client' });
export default router;

router.use(middleware);
router.get('/wallpaper', wallpaper);

async function middleware(ctx: clientContext, next: () => Promise<unknown>) {
  const { request, state } = ctx;
  try {
    const token = request.headers.get('authorization')?.split('Bearer ')?.[1] || '';

    if (!token) {
      state.user = null;
    }

    const user = (await User.where('client_token', token).first()) as User;

    if (!user) {
      state.user = null;
    }

    state.user = user;
    await next();
  } catch (error) {
    console.log(error);
    state.user = null;
  }
}

// GET /client/wallpaper
async function wallpaper(ctx: clientContext) {
  const { user } = ctx.state;
  if (!user) {
    ctx.response.status = 401;
    return;
  }

  const wallpaper = await Wallpaper.where('userId', user.id).orderBy('created_at', 'desc').first();

  return wallpaper;
}
