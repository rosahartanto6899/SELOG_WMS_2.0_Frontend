import * as Sentry from "@sentry/nextjs";

import { ApiContext, User } from "../types/glitchtip.type";

const GlitchTip = () => {
  function setUser(payload: User) {
    return Sentry.setUser(payload);
  }

  function setApiContext(payload: ApiContext) {
    return Sentry.setContext("API", { ...payload });
  }

  function setUserContext(payload: User) {
    return Sentry.setContext("User", { ...payload });
  }

  function captureMessage() {
    Sentry.captureMessage("API request error");
  }

  function captureEvent(event: any) {
    Sentry.captureEvent({ ...event });
  }

  function captureException(event: string) {
    Sentry.captureException(new Error(event));
  }

  function setExtra(name: string, extra: string | object) {
    Sentry.withScope((scope) => {
      scope.setExtra(name, extra);
    });
  }

  return {
    setUser,
    setApiContext,
    setUserContext,
    captureMessage,
    captureEvent,
    captureException,
    setExtra,
  };
};

export default GlitchTip;
