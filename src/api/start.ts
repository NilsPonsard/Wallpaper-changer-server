import { Application, Router } from 'https://deno.land/x/oak@v11.1.0/mod.ts';
import { oakCors } from 'https://deno.land/x/cors@v1.2.2/mod.ts';
import { deserializerMiddleware, serializerMiddleware } from './serialization.ts';

export default async function start() {
  const app = new Application();
  const router = new Router({ prefix: '/api/v1' });

  app.use(oakCors({ origin: '*' }));

  app.use(deserializerMiddleware, serializerMiddleware);

  app.use(router.routes());
  app.use(router.allowedMethods());
  await app.listen({ port: 3000 });
}
