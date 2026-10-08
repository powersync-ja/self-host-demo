// Runs in mongosh via the Compose stats service, using mongosh's `db`, `load`, and `print` globals.
// Prints source document counts, to compare against what the client has synced.
load('/scripts/common.js');

printStats();
