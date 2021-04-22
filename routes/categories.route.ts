import {Request, Response, Router} from 'express';
import Category from '../models/Category';

// eslint-disable-next-line new-cap
const router = Router();

router.get(
  `/autofill/`,
  async (request: Request, response: Response,
  ) => {
    try {
      const data = await Category
        .find({})
        .sort({'group': 1})
        .lean();
      
      return response.json(data);
    } catch (e) {
      response
        .status(500)
        .json({message: `Щось пішло не так, спробуйте знову.`});
    }
  });

router.get(
  `/autofill/:category`,
  async (request: Request, response: Response,
  ) => {
    try {
      const {category} = request.params;

      const regex = new RegExp(`.*${category}.*`, `i`);
      const data = await Category
        .find({'title': regex})
        .sort({'group': 1, 'title': 1})
        .lean();

      return response.json(data);
    } catch (e) {
      response
        .status(500)
        .json({message: `Щось пішло не так, спробуйте знову.`});
    }
  });

router.get(`/:url`, async (request: Request, response: Response) => {
  try {
    const {url} = request.params;

    const data = await Category
      .findOne({'url': url})
      .lean();

    if (!data) {
      return response
        .status(400)
        .json({
          message: `Не вдалося знайти категорію ${url}`,
        });
    }

    return response.json(data);
  } catch (e) {
    response
      .status(500)
      .json({message: `Щось пішло не так, спробуйте знову.`});
  }
});


module.exports = router;
