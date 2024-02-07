export interface IHTTPError {
    response?: {
      data?: {
        message?: string;
      };
    };
  }