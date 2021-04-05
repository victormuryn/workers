import {Request, Response, Router} from 'express';

import {check, validationResult} from 'express-validator';

import Bet from '../models/Bet';
import Project from '../models/Project';

import auth from '../middlewares/auth.middleware';
import {freelancer} from '../middlewares/users.middleware';

// eslint-disable-next-line new-cap
const router = Router();

router.post(
  `/`,
  [auth, freelancer],
  async (request: Request, response: Response) => {
    try {
      const {text, price, term, date, project} = request.body;

      const author = request.user;

      const bet = new Bet({
        date,
        author,
        project,
        term: +term,
        price: +price,
        text: text.replace(/(<([^>]+)>)/gi, ``),
      });
      await bet.save();

      response
        .status(201)
        .json({message: `Ви успішно зробили ставку.`});
    } catch (e) {
      response
        .status(500)
        .json({message: `Щось пішло не так, спробуйте знову.`});
    }
  });

router.patch(
  `/:id`, [
    auth,
    check(`text`, `Введіть текст для опису`)
      .isString()
      .exists({checkFalsy: true}),
    check(`term`, `Введіть термін виконання проєкту`)
      .isNumeric()
      .exists({checkFalsy: true}),
    check(`price`, `Введіть ціну виконання проєкту`)
      .isNumeric()
      .exists({checkFalsy: true}),
    check(`date`, `Не вказана дата, спробуйте знову`)
      .custom((value) => !isNaN(Date.parse(value))),
  ],
  async (request: Request, response: Response) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        const error = errors.array()[0].msg;

        return response
          .status(400)
          .json({
            message: `Некоректні данні при заповненні форми. ${error}.`,
          });
      }
      const author = request.user;
      const {id} = request.params;

      const {text, price, term, date} = request.body;

      const bet = await Bet.findById(id);

      if (!bet) {
        return response.status(500).json({
          message: `Не вдалося знайти ставку`,
        });
      }

      const project = await Project
        .findById(bet.project)
        .select(`price`);

      if (!project) {
        return response.status(500).json({
          message: `Не вдалося знайти проєкт, до якого додана ставка`,
        });
      }

      const minPrice = project.price;
      if (bet.updated.count >= 3) {
        return response.status(500).json({
          message: `Ви використали усі спроби для оновлення ставки.`,
        });
      }

      if (minPrice > price) {
        return response.status(500).json({
          message: `Мінімальна ціна повинна бути ${minPrice}.`,
        });
      }

      if (bet.author.toString() === author) {
        bet.term = term;
        bet.price = price;
        bet.text = text.replace(/(<([^>]+)>)/gi, ``);
        bet.updated = {
          lastDate: date,
          count: bet.updated.count + 1,
        };

        await bet.save();

        return response.json({message: `Успішно оновлено!`});
      }

      response
        .status(500)
        .json({message: `Ви не авторизовані.`});
    } catch (e) {
      response
        .status(500)
        .json({message: `Виникла помилка, спробуйте знову`});
    }
  });

router.delete(`/:id`, auth, async (request: Request, response: Response) => {
  try {
    const author = request.user;
    const {id} = request.params;

    const bet = await Bet.findById(id);

    if (!bet) {
      return response.status(500).json({
        message: `Не вдалося знайти ставку`,
      });
    }

    if (bet.author.toString() === author) {
      await bet.deleteOne();
      return response.json({message: `Успішно видалено!`});
    }

    response
      .status(500)
      .json({message: `Ви не авторизовані.`});
  } catch (e) {
    response
      .status(500)
      .json({message: `Виникла помилка, спробуйте знову`});
  }
});

module.exports = router;
