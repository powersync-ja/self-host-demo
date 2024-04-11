import { AbstractPowerSyncDatabase, PowerSyncBackendConnector } from '@journeyapps/powersync-sdk-web';
import * as jose from 'jose';

export type Config = {
  powerSyncUrl: string;
  privateKey: jose.JWK;
};

export class CustomConnector implements PowerSyncBackendConnector {
  readonly config: Config;

  constructor() {
    this.config = {
      powerSyncUrl: import.meta.env.VITE_POWERSYNC_URL,
      privateKey: JSON.parse(atob(import.meta.env.VITE_JWT_PRIVATE_KEY)) as jose.JWK
    };
  }

  async fetchCredentials() {
    const powerSyncKey = (await jose.importJWK(this.config.privateKey)) as jose.KeyLike;

    // Generate a token using the private key
    const token = await new jose.SignJWT({})
      .setProtectedHeader({
        alg: this.config.privateKey.alg!,
        kid: this.config.privateKey.kid
      })
      .setSubject('anonymous')
      .setIssuedAt()
      .setIssuer('localhost')
      .setAudience('localhost')
      .setExpirationTime('86400s')
      .sign(powerSyncKey);

    return {
      endpoint: this.config.powerSyncUrl,
      token
    };
  }

  async uploadData(database: AbstractPowerSyncDatabase): Promise<void> {
    // Uploading requires a backend of some sort.
    // Directly interfacing with Postgres from the browser is not easily achieved.
  }
}
