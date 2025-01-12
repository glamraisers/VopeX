// src/mocks/server.ts

import { setupServer } from 'msw/node';
import { rest } from 'msw';

// Define request handlers for the mock server
const handlers = [
  // Example handler for a GET request
  rest.get('/data-endpoint', (req, res, ctx) => {
    return res(ctx.json({ message: 'Hello World' }));
  }),

  // Example handler for a POST request
  rest.post('/submit-endpoint', (req, res, ctx) => {
    const { key } = req.body;
    return res(ctx.json({ success: true, key }));
  }),

  // You can add more handlers for different endpoints as needed
];

// Create the mock server
export const server = setupServer(...handlers);