export default class AppError extends Error {
  statusCode: number;
  mssg: string;
  errStack?: string|null;

  constructor( mssg: string, statusCode: number) {
    super(mssg);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.mssg = mssg;
    // this line of code ensures that while displaying stack trace it is not included with that
    Error.captureStackTrace(this,this.constructor)
    // If the incoming error has a stack, use it


    // this is to chain the prototype inheritance to extend the spport to es5 or lower
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
