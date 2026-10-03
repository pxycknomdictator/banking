import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import express from "express";

const app = express();
const fileRoute = dirname(fileURLToPath(import.meta.url));
const staticAssets = join(fileRoute, "..", "public");

app.use(express.static(staticAssets));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

export { app };
