// Shared utilities executed in mongosh. Entry scripts load this file with `load('/scripts/common.js')`.
// `db`, `print`, and `sleep` are provided by mongosh; `process.env` contains the Compose environment settings.

function createTodo({ id, listId, createdAt, description, createdBy, archived }) {
  return {
    _id: id,
    list_id: listId,
    created_at: createdAt,
    completed_at: null,
    description,
    created_by: createdBy,
    completed_by: null,
    completed: false,
    archived
  };
}

function envInt(name, fallback, minimum = 0) {
  const value = process.env[name];
  const parsed = value == null || value === '' ? fallback : Number(value);
  if ((value != null && value !== '' && value.trim() === '') || !Number.isSafeInteger(parsed) || parsed < minimum) {
    throw new Error(`${name} must be a safe integer greater than or equal to ${minimum}`);
  }
  return parsed;
}

function envRatio(name, fallback) {
  const value = process.env[name];
  const parsed = value == null || value === '' ? fallback : Number(value);
  if ((value != null && value !== '' && value.trim() === '') || !Number.isFinite(parsed) || parsed < 0 || parsed > 1) {
    throw new Error(`${name} must be a finite number between 0 and 1`);
  }
  return parsed;
}

// mongo-rs-init only issues rs.initiate(); the member can take a few seconds to become primary.
function waitForPrimary() {
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      if (db.hello().isWritablePrimary) {
        return;
      }
    } catch (e) {
      // Not ready yet
    }
    sleep(1000);
  }
  throw new Error('Timed out waiting for the replica set primary');
}

// Small deterministic PRNG (mulberry32), so a given seed always produces the same archived split.
function createRandom(seed) {
  let state = seed >>> 0;
  return function () {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// The filter is `$eq: ['$$doc.archived', false]`, so only documents with an explicit `archived: false` sync.
// A document without the field (or with any other value) is excluded, just like an archived one.
function printStats() {
  for (const name of ['lists', 'todos']) {
    const total = db[name].countDocuments({});
    const archived = db[name].countDocuments({ archived: true });
    const active = db[name].countDocuments({ archived: false });
    const other = total - archived - active;
    print(
      `${name.padEnd(6)} total=${total} archived=${archived} active (expected to sync)=${active}` +
        (other ? ` without archived: true/false (excluded)=${other}` : '')
    );
  }
}
