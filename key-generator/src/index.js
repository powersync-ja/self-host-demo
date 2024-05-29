const jose = require("jose");
const crypto = require("crypto");

const alg = "RS256";
const kid = `powersync-${crypto.randomBytes(5).toString("hex")}`;

// Run the main script
generateKeyPair();

/**
 * Generates a new RSA key key for use in projects
 */
async function generateKeyPair() {
  const { publicKey, privateKey } = await jose.generateKeyPair(alg, {
    extractable: true
  });

  const privateJwk = {
    ...(await jose.exportJWK(privateKey)),
    alg,
    kid
  };
  const publicJwk = {
    ...(await jose.exportJWK(publicKey)),
    alg,
    kid
  };

  const privateBase64 = Buffer.from(JSON.stringify(privateJwk)).toString("base64");
  const publicBase64 = Buffer.from(JSON.stringify(publicJwk)).toString("base64");

  console.log(`
Public Key:
Add this to the 'client_auth->jwks->keys' section of './config/powersync.yaml'

YAML:
  
${Object.entries(publicJwk)
  .map(([key, value]) => `${key}: ${value}`)
  .join("\n")}

JSON format:
${JSON.stringify(publicJwk, null, 2)}
      
----------------------------

Add these to the .env file in the root of this repository
    
DEMO_JWKS_PUBLIC_KEY=${publicBase64}
    
DEMO_JWKS_PRIVATE_KEY=${privateBase64}
`);
}
