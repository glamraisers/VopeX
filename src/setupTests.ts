// src/setupTests.ts

import '@testing-library/jest-dom/extend-expect'; // Provides custom matchers for asserting on DOM nodes
import { server } from './mocks/server'; // Import the mock server

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that are declared as a part of tests (i.e. for testing one-time error scenarios)
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());