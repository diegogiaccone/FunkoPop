export default class CustomError extends Error {
    constructor(err) {       
        super(err.msg);
        this.statusCode = err.code;
        this.customError = true;
        Error.captureStackTrace(this, this.constructor);
    }
}