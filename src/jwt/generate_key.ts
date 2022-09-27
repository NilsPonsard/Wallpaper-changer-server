crypto.subtle
  .generateKey(
    {
      name: 'ECDSA',
      namedCurve: 'P-384',
    },
    true,
    ['sign', 'verify'],
  )
  .then(async key => {
    const priv = await crypto.subtle.exportKey('jwk', key.privateKey);
    const pub = await crypto.subtle.exportKey('jwk', key.publicKey);

    const keypair = {
      priv,
      pub,
    };
    console.log(btoa(JSON.stringify(keypair)));
  });
