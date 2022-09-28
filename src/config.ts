import 'https://deno.land/std@0.157.0/dotenv/load.ts';

const JWT_KEY = Deno.env.get('JWT_KEY');
if (!JWT_KEY) {
  throw new Error('JWT_KEY is not defined');
}

export const config = {
  db_url: Deno.env.get('DB_URL'),
  jwt_pair: await importKeys(JWT_KEY),
};

async function importKeys(keypair: string) {
  const pair = JSON.parse(atob(keypair)) as { priv: JsonWebKey; pub: JsonWebKey };
  return {
    priv: await crypto.subtle.importKey('jwk', pair.priv, { name: 'ECDSA', namedCurve: 'P-384' }, true, ['sign']),
    pub: await crypto.subtle.importKey('jwk', pair.pub, { name: 'ECDSA', namedCurve: 'P-384' }, true, ['verify']),
  };
}
