#!/usr/bin/env node
const { startServer } = require("../src/server");

const texPath = process.argv[2];
const port = Number(process.env.PORT) || 5050;

if (!texPath) {
  console.error("Usage: npm run preview -- <path-to-cv.tex>");
  process.exit(1);
}

try {
  startServer(texPath, port);
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
