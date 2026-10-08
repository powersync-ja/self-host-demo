// Runs in mongosh via the Compose stream-writer service, using mongosh's `db`, `load`, `print`, and `sleep` globals.
// Writes to the source database while PowerSync is streaming, to exercise MongoDB Replication Pre-filtering:
//  - inserts batches of mostly archived todos (should be skipped) plus some active ones (should sync)
load('/scripts/common.js');

const BATCHES = envInt('STREAM_BATCHES', 20);
const BATCH_SIZE = envInt('STREAM_BATCH_SIZE', 1000, 1);
const ARCHIVED_RATIO = envRatio('STREAM_ARCHIVED_RATIO', 0.9);
const INTERVAL_MS = envInt('STREAM_INTERVAL_MS', 1000);

waitForPrimary();

const runId = new Date().toISOString().replace(/[-:.TZ]/g, '');
const createdAt = new Date().toISOString();
const random = createRandom(Date.now());

// Every run shares one active list for its todos, and one archived list which should never sync,
// so repeated runs don't keep adding lists to the app.
const activeListId = 'stream-list';
for (const [_id, name, archived] of [
  [activeListId, 'Streamed', false],
  ['stream-archived-list', 'Archived streamed', true]
]) {
  db.lists.updateOne(
    { _id },
    { $setOnInsert: { created_at: createdAt, name, owner_id: 'seed', archived } },
    { upsert: true }
  );
}

print(`Streaming ${BATCHES} batches of ${BATCH_SIZE} todos (archived ratio ${ARCHIVED_RATIO}) into list ${activeListId}`);

let insertedActive = 0;
let insertedArchived = 0;

for (let b = 0; b < BATCHES; b++) {
  const todos = [];
  for (let t = 0; t < BATCH_SIZE; t++) {
    const archived = random() < ARCHIVED_RATIO;
    archived ? insertedArchived++ : insertedActive++;
    todos.push(
      createTodo({
        id: `stream-${runId}-b${b}-t${t}`,
        listId: activeListId,
        createdAt: new Date().toISOString(),
        description: `${archived ? 'Archived' : 'Active'} streamed todo ${t} of batch ${b}`,
        createdBy: 'stream',
        archived
      })
    );
  }
  db.todos.insertMany(todos, { ordered: false });

  print(`  batch ${b + 1}/${BATCHES}: inserted active=${insertedActive} archived=${insertedArchived}`);
  if (INTERVAL_MS > 0 && b < BATCHES - 1) {
    sleep(INTERVAL_MS);
  }
}

print('Streaming writes complete');
printStats();
