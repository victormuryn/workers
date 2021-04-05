import {Request, Response} from 'express';
import {validationResult} from 'express-validator';

/**
 * Check errors from express-validator and send response to user if there is any
 * @param {Request} request - express request
 * @param {Response} response - express response
 * @param {string} message - string that will be added before error message
 * @return {boolean} - Boolean: is there any errors
 */
export const handleErrors = (
  request: Request,
  response: Response,
  message = ``,
) => {
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    const error = errors.array()[0].msg;
    response
      .status(400)
      .json({
        message: `${message} ${error}`,
      });
  }

  return !errors.isEmpty();
};
