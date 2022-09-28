import { Router, RouterContext } from 'https://deno.land/x/oak@v11.1.0/router.ts';
import { User } from '../database/user.ts';
import { Wallpaper } from '../database/wallpaper.ts';
import { PostedFor } from '../database/setup.ts';

const router = new Router({ prefix: '/wallpaper' });
export default router;

router.post('/', addWallpaper);

async function addWallpaper(ctx: RouterContext<'/', { userId: string }, { user: User | null; body_json: unknown }>) {
  const { body_json, user } = ctx.state;

  if (!user) {
    ctx.response.status = 401;
    return;
  }

  const { users, url, title } = body_json as { users: string[]; url: string; title: string };

  if (!users || !url) {
    ctx.response.status = 400;
    return;
  }

  const wallpaper = await Wallpaper.create({
    title,
    url,
    userId: user.id,
  });

  await Promise.allSettled(
    users.map(async userId => {
      await PostedFor.create({ userId, wallpaperId: wallpaper.id as number });
    }),
  );

  ctx.response.body = { message: 'ok' };
}
