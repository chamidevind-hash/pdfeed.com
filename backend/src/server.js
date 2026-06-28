import "dotenv/config";
import { app } from "./app.js";
import { config } from "./config.js";
import { deleteExpiredFiles, startCleanupJob } from "./services/cleanup.js";
import { ensureStorageDirectories } from "./utils/files.js";

await ensureStorageDirectories();
await deleteExpiredFiles();
startCleanupJob();

app.listen(config.port, () => {
  console.log(`File Convert Web API running on http://localhost:${config.port}`);
});
