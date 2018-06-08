export class CustomError extends Error {
    public static errorCodes = {
      BAIDU_AIP_ERROR:"BAIDU_AIP_ERROR"
    };
    public status:number;
    constructor(public message:string,public code:string,public statusCode:number = 400) {
      // Pass remaining arguments (including vendor specific ones) to parent constructor
      super(message);
      this.status = statusCode;
      this.code = code;
  
      // Maintains proper stack trace for where our error was thrown (only available on V8)
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, CustomError);
      }
    }
}