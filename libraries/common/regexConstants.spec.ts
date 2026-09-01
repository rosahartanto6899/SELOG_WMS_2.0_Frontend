import {
  REGEX_PATTERN_ACTION_TYPE,
  REGEX_PATTERN_STRING_BRACKET,
} from "./regexConstants";

describe("ActionType regular expression", () => {
  it("Valid actionType should match", () => {
    const validActionType = [
      "dashboard/getGeofenceViolationFetch",
      "dashboard/getGeofenceViolationSuccess",
      "dashboard/getGeofenceViolationFailure",
      "dashboard/getGeofenceViolation2Fetch",
      "dashboard/getGeofenceViolation2Success",
      "dashboard/getGeofenceViolation2Failure",
    ];

    validActionType.forEach((actionType) => {
      expect(actionType).toMatch(REGEX_PATTERN_ACTION_TYPE);
    });
  });

  it("Invalid actionType should not be match or return false", () => {
    const invalidActionType = [
      "fetchInvalid",
      "successInvalid",
      "failureInvalid",
      "invalidfetch",
      "invalidsuccess",
      "invalidfailure",
    ];

    invalidActionType.forEach((actionType) => {
      expect(actionType).not.toMatch(REGEX_PATTERN_ACTION_TYPE);
    });
  });
});

describe("Bracket regular expression", () => {
  it("Valid bracketString should match", () => {
    const validBracketString = [
      "[beside]",
      "[inside]",
      "[outside]",
      "Text [beside] square brackets.",
      "Text [inside] square brackets.",
      "Text [outside] square brackets.",
    ];

    validBracketString.forEach((bracketString) => {
      expect(bracketString).toMatch(REGEX_PATTERN_STRING_BRACKET);
    });
  });

  it("Invalid bracketString should not be match or return false", () => {
    const invalidBracketString = [
      "No square brackets here.",
      "Mismatched [brackets.",
      "Mismatched brackets.]",
      "[expect(REGEX_PATTERN_STRING_BRACKET.test(bracketString)).toBe(true)expect(REGEX_PATTERN_STRING_BRACKET.test(bracketString)).toBe(true)]",
    ];

    invalidBracketString.forEach((bracketString) => {
      expect(bracketString).not.toMatch(REGEX_PATTERN_STRING_BRACKET);
    });
  });
});
