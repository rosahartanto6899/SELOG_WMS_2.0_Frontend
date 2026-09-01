import MessageHandler from "../message-handler";

const ErrorMessageHandler = () => {
  const messageHandler = MessageHandler();

  /**
   * Customized error handling object type with function and contructor name
   * @param exception
   * @param message
   */
  function handleCustomException(exception: { error: any }, message?: string) {
    messageHandler.handleError(exception.error, message);
  }

  function handleComponentBaseError(error: any) {
    messageHandler.handleError(error);
  }

  return {
    handleCustomException,
    handleComponentBaseError,
  };
};

export { ErrorMessageHandler };
