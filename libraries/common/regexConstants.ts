/* eslint-disable no-useless-escape */
export const REGEX_PATTERN_ACTION_TYPE =
  /([a-zA-Z0-9\///]{1,100}?)(Fetch|Success|Failure)/;

export const REGEX_PATTERN_PATHNAME = /^\//;

export const REGEX_PATTERN_STRING_BRACKET = /\[[a-zA-Z0-9\///]{1,100}?\]/g;
