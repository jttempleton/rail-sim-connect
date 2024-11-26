import { Response } from "express";

/**
 * Sends a JSON response with the provided data and HTTP status code.
 *
 * @param res - Express response object.
 * @param statusCode - HTTP status code to send.
 * @param message - Message or data to include in the response.
 */
export const sendResponse = (
    res: Response,
    statusCode: number,
    message: string | object
): void => {
    res.status(statusCode).json({
        status: statusCode < 400 ? "success" : "error",
        message,
    });
};

/**
 * Sends a success response with the provided data.
 *
 * @param res - Express response object.
 * @param message - Message or data to include in the response.
 */
export const sendSuccess = (res: Response, message: string | object): void => {
    sendResponse(res, 200, message);
};

/**
 * Sends a created response with the provided data.
 *
 * @param res - Express response object.
 * @param message - Message or data to include in the response.
 */
export const sendCreated = (res: Response, message: string | object): void => {
    sendResponse(res, 201, message);
};

/**
 * Sends a bad request response with the provided error message.
 *
 * @param res - Express response object.
 * @param message - Error message to include in the response.
 */
export const sendBadRequest = (res: Response, message: string): void => {
    sendResponse(res, 400, message);
};

/**
 * Sends an internal server error response with the provided error message.
 *
 * @param res - Express response object.
 * @param message - Error message to include in the response.
 */
export const sendServerError = (res: Response, message: string): void => {
    sendResponse(res, 500, message);
};
