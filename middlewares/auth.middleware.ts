import {NextFunction, Request, Response} from 'express';

import * as jwt from 'jsonwebtoken';
import * as config from 'config';

export default (request: Request, response: Response, next: NextFunction) => {
  if (request.method === `OPTIONS`) {
    return next();
  }

  try {
    // Bearer TOKEN
    const auth = request.headers.authorization;
    const token = auth ? auth.split(` `)[1] : false;

    if (!token) {
      return response
        .status(401)
        .json({message: `Ви не авторизовані`});
    }

    const result = jwt.decode(token, config.get(`jwtPhrase`));

    if (!result) {
      return response
        .status(401)
        .json({
          message: `Невалідний токен`,
        });
    }

    request.user = result.userId;
    next();
  } catch (e) {
    response
      .status(401)
      .json({message: `Ви не авторизовані`});
  }
};
