/**
 * Sets required Convex deployment environment variables.
 *
 * Reads CONVEX_JWT_PRIVATE_KEY from .env.local (a PKCS#8 PEM private key)
 * and sets it as JWT_PRIVATE_KEY in the Convex deployment.
 *
 * If CONVEX_JWT_PRIVATE_KEY is not found in .env.local, a new RSA key pair
 * is generated automatically and appended to .env.local.
 *
 * Usage: node scripts/setup-env.mjs
 */
import { readFileSync, appendFileSync, writeFileSync, existsSync } from "fs";
import { execSync, spawnSync } from "child_process";
import { generateKeyPairSync, createPublicKey, randomBytes } from "crypto";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { exportJWK } from "jose";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const envPath = resolve(projectRoot, ".env.local");

function parseEnvFile(filePath) {
  if (!existsSync(filePath)) return {};
  const content = readFileSync(filePath, "utf-8");
  const vars = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    // Strip surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    vars[key] = value;
  }
  return vars;
}

function generateJwtPrivateKey() {
  console.log("Generating new RSA PKCS#8 private key...");
  const { privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });
  return privateKey;
}

function setConvexEnv(key, value) {
  // Use spawnSync with explicit args array to avoid shell escaping issues
  // with PEM keys that contain dashes, newlines, etc.
  const result = spawnSync("npx", ["convex", "env", "set", key, "--", value], {
    cwd: projectRoot,
    stdio: "inherit",
  });
  if (result.status !== 0) {
    throw new Error(`Failed to set Convex env var: ${key}`);
  }
}

try {
  const envVars = parseEnvFile(envPath);

  // Handle JWT_PRIVATE_KEY
  let jwtKey = envVars["CONVEX_JWT_PRIVATE_KEY"];
  if (!jwtKey) {
    jwtKey = generateJwtPrivateKey();
    // Append to .env.local for future runs
    const entry = `\nCONVEX_JWT_PRIVATE_KEY="${jwtKey.replace(/\n/g, "\\n")}"\n`;
    appendFileSync(envPath, entry);
    console.log("✔ Generated and saved CONVEX_JWT_PRIVATE_KEY to .env.local");
  } else {
    // Restore escaped newlines from .env.local
    jwtKey = jwtKey.replace(/\\n/g, "\n");
  }

  console.log("Setting Convex env var: JWT_PRIVATE_KEY");
  setConvexEnv("JWT_PRIVATE_KEY", jwtKey);

  // Derive public key and build JWKS for @convex-dev/auth
  console.log("Deriving JWKS from private key...");
  const publicKey = createPublicKey(jwtKey);
  const publicJwk = await exportJWK(publicKey);
  publicJwk.alg = "RS256";
  publicJwk.use = "sig";
  const jwks = JSON.stringify({ keys: [publicJwk] });

  console.log("Setting Convex env var: JWKS");
  setConvexEnv("JWKS", jwks);

  // Write the Convex admin key for PowerSync to use as deploy key
  const adminKey = envVars["CONVEX_SELF_HOSTED_ADMIN_KEY"];
  const setupDir = "/setup";

  if (!adminKey) {
    console.warn("CONVEX_SELF_HOSTED_ADMIN_KEY not found — skipping deploy key export");
  } else if (existsSync(setupDir)) {
    writeFileSync(`${setupDir}/deploy_key`, adminKey);
    console.log("✔ Deploy key written to /setup/deploy_key");
  } else {
    console.log("Deploy key not written (/setup directory not found — running outside Docker?)");
  }

  console.log("✔ Convex environment variables configured");
} catch (err) {
  console.error("Failed to set Convex environment variables:", err.message);
  process.exit(1);
}
