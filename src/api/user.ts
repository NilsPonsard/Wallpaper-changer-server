import { Router, RouterContext } from 'https://deno.land/x/oak@v11.1.0/router.ts';
import { User } from '../database/user.ts';
import { apiContext } from './serialization.ts';
import * as bcrypt from 'https://deno.land/x/bcrypt@v0.4.0/mod.ts';
import { checkRefreshToken, registerNewTokenPair } from '../jwt/token.ts';

const router = new Router({ prefix: '/user' });
export default router;

// router.get('/', list);
router.post('/', register);
router.post('/login', login);
router.get('/me', me);
router.get('/:id', get);
router.post('/refresh', refresh);
router.post('/client', generateClientToken);

// async function list(ctx: apiContext) {
//   ctx.response.body = User.all();
// }

// POST /user/register
async function register(ctx: apiContext) {
  const { body_json } = ctx.state;
  const { username, email, password, bio } = body_json as {
    username: string;
    email: string;
    password: string;
    bio: string;
  };

  if (!email || !password || !username) {
    ctx.response.status = 400;
    return;
  }

  const user = await User.create({ username, email, password: await bcrypt.hash(password), bio });

  ctx.response.body = user;
}

// POST /user/login
async function login(ctx: apiContext) {
  const { body_json } = ctx.state;
  const { email, password } = body_json as { email: string; password: string };

  if (!email || !password) {
    ctx.response.status = 400;
    return;
  }

  const user = await User.where('email', email).first();

  if (!user) {
    ctx.response.status = 401;
    return;
  }

  if (!(await bcrypt.compare(password, user.password as string))) {
    ctx.response.status = 401;
    return;
  }

  const pair = await registerNewTokenPair(user.id as number);

  ctx.response.body = pair;
}

// GET /user/:id
async function get(ctx: RouterContext<'/:id'>) {
  const { id } = ctx.params;

  ctx.response.body = { message: 'not found' };

  try {
    const user = await User.where('id', id).first();
    if (!user) {
      ctx.response.status = 404;
      return;
    }

    ctx.response.body = {
      id: user.id,
      username: user.username,
      bio: user.bio,
    };
  } catch (_) {
    ctx.response.status = 404;
  }
}

// POST /user/refresh
async function refresh(ctx: apiContext) {
  const { body_json } = ctx.state;
  const { refresh } = body_json as { refresh: string };

  if (!refresh) {
    ctx.response.status = 400;
    return;
  }

  const token = await checkRefreshToken(refresh);

  if (token === null) {
    ctx.response.status = 401;
    return;
  }

  const pair = await registerNewTokenPair(token.userId as number);
  token.delete();

  ctx.response.body = pair;
}

// GET /user/me
function me(ctx: apiContext) {
  const { user } = ctx.state;

  if (!user) {
    ctx.response.status = 401;
    return;
  }

  ctx.response.body = { id: user.id, email: user.email, username: user.username, bio: user.bio };
}

// POST /user/client
async function generateClientToken(ctx: apiContext) {
  const { user } = ctx.state;

  if (!user) {
    ctx.response.status = 401;
    return;
  }

  const token = crypto.randomUUID();

  await User.where('id', user.id as number).update({ client_token: token });

  ctx.response.body = { token };
}
