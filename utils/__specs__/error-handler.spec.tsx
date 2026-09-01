// describe('getErrorApiResponse', () => {
//   it('returns formatted error response when status and statusText are provided', () => {
//     const inputError: APIErrorApiResponse = {
//       config: { baseURL: 'https://example.com', url: '/api' },
//       status: 404,
//       statusText: 'Not Found',
//     };

//     expect(result).toEqual({
//       message: 'Not Found',
//       params: {},
//       url: 'https://example.com/api',
//     });
//   });

//   it('returns the original error when status and statusText are missing', () => {
//     const inputError: APIErrorApiResponse = {
//       config: { baseURL: 'https://example.com', url: '/api' },
//     };

//     expect(result).toBe(inputError);
//   });
// });

// describe('sendCapturedSentry for api', () => {
//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('calls Sentry methods with proper arguments when message is provided', () => {
//     const sentryOptionsWithException: SentryOptions = {
//       message: 'Mock Exception',
//       apiContext: mockApiContext,
//       user: mockUser,
//     };

//     expect(Sentry.setContext).toHaveBeenCalledWith('User', mockUser);
//     expect(Sentry.setContext).toHaveBeenCalledWith('API', mockApiContext);
//     expect(Sentry.captureException).toHaveBeenCalledWith(new Error('Mock Exception'));
//   });
// });

// describe('sendCapturedSentry for non api', () => {
//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('calls Sentry methods with proper arguments when message is provided', () => {
//     const sentryOptionsWithException: SentryOptions = {
//       message: 'Mock Exception',
//       errorContext: mockErrorContext,
//       user: mockUser,
//     };

//     expect(Sentry.setContext).toHaveBeenCalledWith('User', mockUser);
//     expect(Sentry.setContext).toHaveBeenCalledWith('Error', mockErrorContext);
//     expect(Sentry.captureException).toHaveBeenCalledWith(new Error('Mock Exception'));
//   });
// });
import * as Sentry from "@sentry/nextjs";

import { getErrorApiResponse, sendCapturedSentry } from "../error-handler";
import { APIErrorApiResponse, SentryOptions } from "../error-handler/types";

jest.mock("@sentry/nextjs", () => ({
  setContext: jest.fn(),
  captureException: jest.fn(),
}));

describe("getErrorApiResponse", () => {
  it("returns formatted error response when status and statusText are provided", () => {
    const inputError: APIErrorApiResponse = {
      config: { baseURL: "https://example.com", url: "/api" },
      status: 404,
      statusText: "Not Found",
    };

    const result = getErrorApiResponse(inputError);

    expect(result).toEqual({
      message: "Not Found",
      params: {},
      statusText: "Not Found",
      url: "https://example.com/api",
    });
  });

  it("returns the original error when status and statusText are missing", () => {
    const inputError: APIErrorApiResponse = {
      config: { baseURL: "https://example.com", url: "/api" },
    };

    const result = getErrorApiResponse(inputError);

    expect(result).toBe(inputError);
  });
});

describe("sendCapturedSentry for api", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockUser = { id: "123", username: "testuser" };
  const mockApiContext = {
    apiUrl: "/test-api",
    fileName: "testFileName",
    functionName: "testFunction",
    pageUrl: "/test-path",
    rowNumber: 42,
  };

  it("calls Sentry methods with proper arguments when message is provided", () => {
    const sentryOptionsWithException: SentryOptions = {
      message: "Mock Exception 1",
      apiContext: mockApiContext,
      user: mockUser,
    };

    sendCapturedSentry(sentryOptionsWithException);

    expect(Sentry.setContext).toHaveBeenNthCalledWith(1, "User", mockUser);
    expect(Sentry.setContext).toHaveBeenNthCalledWith(
      2,
      "API Context",
      mockApiContext,
    );
    expect(Sentry.captureException).toHaveBeenCalledWith(
      new Error("Mock Exception 1"),
    );
  });
});

describe("sendCapturedSentry for non api", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockUser = { id: "123", username: "testuser" };
  const mockErrorContext = {
    apiUrl: "/test-api",
    fileName: "testFileName",
    functionName: "testFunction",
    pageUrl: "/test-path",
    rowNumber: 42,
  };

  it("calls Sentry methods with proper arguments when message is provided", () => {
    const sentryOptionsWithException: SentryOptions = {
      message: "Mock Exception 2",
      errorContext: mockErrorContext,
      user: mockUser,
    };

    sendCapturedSentry(sentryOptionsWithException);

    expect(Sentry.setContext).toHaveBeenNthCalledWith(1, "User", mockUser);
    expect(Sentry.setContext).toHaveBeenNthCalledWith(
      2,
      "Error Context",
      mockErrorContext,
    );
    expect(Sentry.captureException).toHaveBeenCalledWith(
      new Error("Mock Exception 2"),
    );
  });
});
