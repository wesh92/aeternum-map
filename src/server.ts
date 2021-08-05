import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import router from './lib/router';
import { connectToMongoDb } from './lib/db';
import { ensureMarkersSchema, ensureMarkersIndexes } from './lib/markers';
import { ensureCommentsIndexes, ensureCommentsSchema } from './lib/comments';

const { PORT, MONGODB_URI } = process.env;

if (typeof PORT !== 'string') {
  throw new Error('PORT is not set');
}

if (typeof MONGODB_URI !== 'string') {
  throw new Error('MONGODB_URI is not set');
}

const app = express();

// Middleware to set CORS headers
app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Middleware that parses json and looks at requests where the Content-Type header matches the type option.
app.use(express.json());

// Serve API requests from the router
app.use('/api', router);

// All other requests could be used for static files, images, etc.
app.get('*', (_req, res) => {
  res.send('<h1>Welcome to the server</h1>');
});

connectToMongoDb(MONGODB_URI).then(async () => {
  console.log('Connected to MongoDB');
  await ensureMarkersIndexes();
  await ensureMarkersSchema();
  await ensureCommentsIndexes();
  await ensureCommentsSchema();

  app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
  });
});