import { v4 as uuid } from 'uuid';

import type { Authenticator, MutationUploader, ResolveCredentialsOptions } from '@powersync/web';
export type DemoConfig = {
  backendUrl: string;
};

enum CheckpointMode {
  CUSTOM = 'custom',
  MANAGED = 'managed'
}
const USER_ID_STORAGE_KEY = 'ps_user_id';

export class DemoConnector implements Authenticator {
  readonly config: DemoConfig;
  readonly userId: string;

  private cachedToken: string | null = null;

  constructor() {
    let userId = localStorage.getItem(USER_ID_STORAGE_KEY);
    if (!userId) {
      userId = uuid();
      localStorage.setItem(USER_ID_STORAGE_KEY, userId);
    }
    this.userId = userId;

    this.config = {
      backendUrl: import.meta.env.VITE_BACKEND_URL
    };
  }

  async resolveCredentials({ abort }: ResolveCredentialsOptions): Promise<string> {
    if (this.cachedToken) {
      return this.cachedToken;
    }

    const tokenEndpoint = 'api/auth/token';
    const res = await fetch(`${this.config.backendUrl}/${tokenEndpoint}?user_id=${encodeURIComponent(this.userId)}`, {
      signal: abort
    });

    if (!res.ok) {
      throw new Error(`Received ${res.status} from ${tokenEndpoint}: ${await res.text()}`);
    }

    const { token } = await res.json();

    if (!token || typeof token !== 'string') {
      throw new Error(`Missing token in response from ${tokenEndpoint}`);
    }

    this.cachedToken = token;
    return token;
  }

  invalidateCredentials(): void {
    this.cachedToken = null;
  }

  readonly upload: MutationUploader = async ({ database, abort }) => {
    const transaction = await database.getNextCrudTransaction();

    if (!transaction) {
      return;
    }
    try {
      const batch = transaction.crud.map((operation) => ({
        op: operation.op,
        table: operation.table,
        id: operation.id,
        data: operation.opData
      }));

      const response = await fetch(`${this.config.backendUrl}/api/data`, {
        method: 'POST',
        signal: abort,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ batch })
      });

      if (!response.ok) {
        throw new Error(`Received ${response.status} from /api/data: ${await response.text()}`);
      }

      const checkpoint =
        import.meta.env.VITE_CHECKPOINT_MODE === CheckpointMode.CUSTOM
          ? await this.getCheckpoint(await database.getClientId(), abort)
          : undefined;

      await transaction.complete(checkpoint);
    } catch (ex: any) {
      console.debug(ex);
      throw ex;
    }
  };

  /**
   * Gets a custom Write Checkpoint from the backend. This is only used
   * when custom Write Checkpoints are enabled during build.
   */
  async getCheckpoint(client_id: string, signal?: AbortSignal) {
    const r = await fetch(`${this.config.backendUrl}/api/data/checkpoint`, {
      method: 'PUT',
      signal,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: this.userId,
        client_id: client_id
      })
    });
    const j = await r.json();
    return j.checkpoint as string;
  }
}
