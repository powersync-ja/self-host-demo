// Runs in mongosh via the Compose seed service, using mongosh's `db`, `load`, `print`, and `quit` globals.
// Seeds the source database with a large volume of archived and non-archived lists/todos.
// Runs once before the PowerSync service starts, so the data is picked up by the initial snapshot.
load('/scripts/common.js');

const LISTS = envInt('SEED_LISTS', 20, 1);
const TODOS_PER_LIST = envInt('SEED_TODOS_PER_LIST', 800);
const ARCHIVED_RATIO = envRatio('SEED_ARCHIVED_RATIO', 0.5);
const BATCH_SIZE = envInt('SEED_BATCH_SIZE', 5000, 1);

waitForPrimary();

if (db.seed_meta.findOne({ _id: 'seed' })) {
  print('Source database is already seeded, skipping. Run `docker compose down -v` for a fresh seed.');
  printStats();
  quit(0);
}

print(`Seeding ${LISTS} lists x ${TODOS_PER_LIST} todos (archived ratio ${ARCHIVED_RATIO}) into ${db.getName()}`);

db.createCollection('lists');
db.createCollection('todos');
db.todos.createIndex({ list_id: 1 });
// Supports the filtered initial snapshot, which queries `archived: false` and pages in `_id` order.
db.lists.createIndex({ archived: 1, _id: 1 });
db.todos.createIndex({ archived: 1, _id: 1 });

const random = createRandom(42);
const createdAt = new Date().toISOString();
const started = Date.now();

let lists = [];
let todos = [];
let inserted = 0;

function flushTodos() {
  if (todos.length > 0) {
    db.todos.insertMany(todos, { ordered: false });
    inserted += todos.length;
    todos = [];
  }
}

for (let l = 0; l < LISTS; l++) {
  const listId = `seed-list-${String(l).padStart(6, '0')}`;
  const listArchived = random() < ARCHIVED_RATIO;
  lists.push({
    _id: listId,
    created_at: createdAt,
    name: `${listArchived ? 'Archived' : 'Active'} list ${l}`,
    owner_id: 'seed',
    archived: listArchived
  });

  for (let t = 0; t < TODOS_PER_LIST; t++) {
    // Every todo in an archived list is archived; todos in active lists are archived by ratio.
    const todoArchived = listArchived || random() < ARCHIVED_RATIO;
    todos.push(
      createTodo({
        id: `${listId}-todo-${String(t).padStart(5, '0')}`,
        listId,
        createdAt,
        description: `${todoArchived ? 'Archived' : 'Active'} todo ${t} of list ${l}`,
        createdBy: 'seed',
        archived: todoArchived
      })
    );
    if (todos.length >= BATCH_SIZE) {
      flushTodos();
      print(`  inserted ${inserted} todos...`);
    }
  }
}

db.lists.insertMany(lists, { ordered: false });
flushTodos();

db.seed_meta.insertOne({
  _id: 'seed',
  seeded_at: new Date(),
  lists: LISTS,
  todos_per_list: TODOS_PER_LIST,
  archived_ratio: ARCHIVED_RATIO
});

print(`Seed complete in ${((Date.now() - started) / 1000).toFixed(1)}s`);
printStats();
