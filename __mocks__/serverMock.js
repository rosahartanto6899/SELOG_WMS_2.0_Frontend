// mocks/server.js
import { rest } from "msw";
import { setupServer } from "msw/node";

// Define mock request handlers
const handlers = [
  rest.get("/api/posts", (req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json([
        { id: 1, title: "Mocked Post 1" },
        { id: 2, title: "Mocked Post 2" },
      ]),
    ),
  ),
  // Add more request handlers as needed
];

// Set up the mock server with the defined handlers
export const server = setupServer(...handlers);
