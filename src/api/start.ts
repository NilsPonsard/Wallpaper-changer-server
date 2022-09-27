import { Application, Router } from 'https://deno.land/x/oak@v11.1.0/mod.ts';
import { oakCors } from 'https://deno.land/x/cors@v1.2.2/mod.ts';
import { deserializerMiddleware } from './serialization.ts';
import userRouter from './user.ts';
import clientRouter from './client.ts';
import { jwtMiddleware } from '../jwt/middleware.ts';

const apis = [userRouter];

export default async function start() {
  const app = new Application();

  // cors

  app.use(oakCors({ origin: '*' }));

  // user interface

  const apiRouter = new Router({ prefix: '/api/v1' });
  apiRouter.use(deserializerMiddleware, jwtMiddleware);
  apis.forEach(api => {
    apiRouter.use(api.routes());
  });

  app.use(apiRouter.routes());

  // wallpaper client
  app.use(clientRouter.routes());

  app.use((ctx, next) => {
    next();
    if (ctx.response.body === undefined || ctx.response.body === null) {
      ctx.response.body = { message: 'Not found' };
    }
  });

  await app.listen({ port: 3000 });
}
