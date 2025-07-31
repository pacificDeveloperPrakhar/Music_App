import {
  type Request,
  type Response,
  type NextFunction,
  type ErrorRequestHandler,
} from "express";
interface CustomError extends Error{
    status_code:number,
    
}

const error_handler: ErrorRequestHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default error_handler;
