import {NextFunction, Request, Response} from 'express';

import * as jwt from 'jsonwebtoken';
import * as config from 'config';

import User from '../models/User';

module.exports = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  if (request.method === `OPTIONS`) {
    return next();
  }

  try {
    // Bearer TOKEN
    const authHeader = request.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(` `)[1];

      if (!token || token === `null` || token === null) {
        return next();
      }

      const id = jwt.decode(token, config.get(`jwtPhrase`))!.userId;
      const user = await User.findById(id);

      if (user) {
        user.online = new Date();
        await user.save();
      }
    }

    return next();
  } catch (e) {
    console.log(e)
    response
      .status(401)
      .json({message: `Не вдалося оновити статус`});
  }
};
