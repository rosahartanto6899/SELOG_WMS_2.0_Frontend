/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect"; // Extends jest expect with additional matchers
import "jest-environment-jsdom";
// import { server } from './__mocks__/serverMock'; // If using MSW for API mocking

const fetch = require("next/jest");
const { Headers, Request, Response } = require("next/jest");

if (!global.fetch) {
  global.fetch = fetch;
  global.Headers = Headers;
  global.Request = Request;
  global.Response = Response;
}

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Optional: If you're using MSW for API mocking
// beforeAll(() => server.listen());
// afterEach(() => server.resetHandlers());
// afterAll(() => server.close());
