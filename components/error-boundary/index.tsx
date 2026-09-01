/* eslint-disable react/display-name */
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";

import UnderMaintenanceError from "./UnderMaintenance";
import WaitingError from "./Waiting";

const withLogger = (WrappedComponent: any) => (props: any) => {
  const router = useRouter();
  const { sendErrorHandler } = useErrorHandler("components/error-boundary");
  const sendMessageError = (message: any) =>
    sendErrorHandler(`ErrorBoundary ${router.pathname}`, 7, message);

  return <WrappedComponent {...props} sendMessageError={sendMessageError} />;
};
class ErrorBoundary extends React.Component<
  { children: ReactNode; sendMessageError: any },
  { hasError: boolean; retryCount: number }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, retryCount: 0 };
    this.resetErrorBoundary = this.resetErrorBoundary.bind(this);
    this.setHasError = this.setHasError.bind(this);
  }

  componentDidCatch(error: any) {
    const { sendMessageError } = this.props;
    sendMessageError({ error });
    this.setHasError(true);
  }

  setHasError(value: boolean, callback?: () => void) {
    this.setState({ hasError: value }, callback);
  }

  resetErrorBoundary() {
    const { retryCount } = this.state;
    this.setHasError(false);
    if (retryCount < 3) {
      setTimeout(() => this.setState({ retryCount: retryCount + 1 }), 1000); // Retry after 1 second
    }
  }

  render() {
    const { hasError, retryCount } = this.state;
    if (hasError && retryCount < 3)
      return <WaitingError resetErrorBoundary={this.resetErrorBoundary} />;
    if (hasError) return <UnderMaintenanceError />;
    const { children } = this.props;
    return children;
  }
}
export default withLogger(ErrorBoundary);
