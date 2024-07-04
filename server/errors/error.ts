interface CustomError extends Error {
    statusCode?: number
}
const errorHandler = (statusCode: number, message: string) => {
    const error: CustomError = new Error();
    error.statusCode = statusCode;
    error.message = message;
    return error;
};

export default errorHandler;
