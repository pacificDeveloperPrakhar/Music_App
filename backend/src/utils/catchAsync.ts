import { type Request, type Response, type NextFunction } from "express";

interface CustomError extends Error {
  statusCode?: number;
}

export default function asyncHandler(
  func: (req: Request, res: Response, next: NextFunction) => Promise<void|Response>
) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await func(req, res, next);
    } catch (err) {
      console.log(err)
      const error = err as CustomError;
    
    // by default the status code do be adjusted to 500
      error.statusCode = error.statusCode || 500;
      if (!error.message) {
    // default message during error encountered if no mssg provided
        error.message = "internal error encountered";
      }

      next(error);
    }
  };
}
