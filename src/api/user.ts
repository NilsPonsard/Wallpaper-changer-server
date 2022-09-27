import { Router } from 'https://deno.land/x/oak@v11.1.0/router.ts';
import { appContext } from './serialization.ts';

export const router = new Router({ prefix: '/user' });

router.get('/', list);
router.post('/register', register);
router.post('/login', login);
router.get('/:id', get);
router.post('/refresh', refresh);

async function list(ctx: appContext) {
  // TODO: Implement
}

async function register(ctx: appContext) {
  // TODO: Implement
}

async function login(ctx: appContext) {
  // TODO: Implement
}

async function get(ctx: appContext) {
  // TODO: Implement
}

async function refresh(ctx: appContext) {
  // TODO: Implement
}
