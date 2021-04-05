import {NextFunction, Request, Response} from 'express';

import User from '../models/User';

export const client = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  if (request.method === `OPTIONS`) {
    return next();
  }

  try {
    const user = await User.findById(request.user);

    if (!user || user.accountType !== `client`) {
      return response
        .status(403)
        .json({message: `Немає доступу`});
    }

    next();
  } catch (e) {
    response
      .status(403)
      .json({message: `Немає доступу`});
  }
};

export const freelancer = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  if (request.method === `OPTIONS`) {
    return next();
  }

  try {
    const user = await User.findById(request.user);

    if (!user || user.accountType !== `freelancer`) {
      return response
        .status(403)
        .json({message: `Немає доступу`});
    }

    next();
  } catch (e) {
    response
      .status(403)
      .json({message: `Немає доступу`});
  }
};
