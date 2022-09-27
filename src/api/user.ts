import { Context } from 'https://deno.land/x/oak@v11.1.0/context.ts';
import { Router } from 'https://deno.land/x/oak@v11.1.0/router.ts';

export const router = new Router({ prefix: '/user' });

type RouterCTX = Context<{ body_json: unknown }>;

router.get('/', list);
router.post('/register', register);
router.post('/login', login);
router.get('/:id', get);

async function list(ctx: RouterCTX) {
  // TODO: Implement
}

async function register(ctx: RouterCTX) {
  // TODO: Implement
}

async function login(ctx: RouterCTX) {
  // TODO: Implement
}

async function get(ctx: RouterCTX) {
  // TODO: Implement
}
