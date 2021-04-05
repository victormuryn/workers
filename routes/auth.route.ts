import {Request, Response, Router} from 'express';
import {check} from 'express-validator';

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as config from 'config';

import User from '../models/User';
import {handleErrors} from '../utils';

// eslint-disable-next-line new-cap
const router = Router();

// /api/auth/register
router.post(
  `/register`,
  [
    check(`email`, `Некоректний email`)
      .normalizeEmail()
      .isEmail(),
    check(`name`, `Некоректне ім'я`).exists(),
    check(`surname`, `Некоректне прізвище`).exists(),
    check(`username`, `Некоректний логін`)
      .matches(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/, `i`),
    check(`phone`, `Некоректний номер телефону`).isMobilePhone(`uk-UA`),
    check(`password`, `Введіть пароль`).exists(),
    check(`accountType`, `Виберіть тип аккаунту`).exists(),
  ],
  async (request: Request, response: Response) => {
    try {
      // work out errors from express-validator
      if (handleErrors(request, response, `Некоректні данні при реєстрації:`)) {
        return;
      }

      const {
        name,
        phone,
        surname,
        password,
        username,
        accountType,
        email: requestEmail,
      } = request.body;
      const email = requestEmail.toLowerCase();

      // get users by unique values
      const candidate = await User.findOne({email});
      const candidatePhone = await User.findOne({phone});
      const candidateUsername = await User.findOne({username});

      // if there's user by unique values => send error
      if (candidate) {
        return response
          .status(400)
          .json({message: `Користувач з таким email уже існує.`});
      } else if (candidatePhone) {
        return response
          .status(400)
          .json({message: `Користувач з таким телефоном уже існує.`});
      } else if (candidateUsername) {
        return response
          .status(400)
          .json({message: `Користувач з таким логіном уже існує.`});
      }


      // create and save user
      // password will be hashed in db middleware
      const user = new User({
        name, surname, username,
        email, phone,
        accountType, password,
      });

      await user.save();

      response
        .status(201)
        .json({message: `Користувач успішно створений.`});
    } catch (e) {
      response
        .status(500)
        .json({message: `Щось пішло не так, спробуйте знову.`});
    }
  },
);

// /api/auth/login
router.post(
  `/login`,
  [
    check(`username`, `Некоректний логін`)
      .matches(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/, `i`),
    check(`password`, `Введіть пароль`).exists(),
  ],
  async (request: Request, response: Response) => {
    try {
      // workout errors from express-validator
      if (handleErrors(request, response, `Некоректні данні при вході:`)) {
        return;
      }

      const {username, password} = request.body;
      const user = await User.findOne({username});

      if (!user) {
        return response
          .status(400)
          .json({message: `Користувач з таким логіном не знайдений.`});
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return response
          .status(400)
          .json({message: `Неправильний пароль, спробуйте знову.`});
      }

      const token = jwt.sign(
        {userId: user.id},
        config.get(`jwtPhrase`),
        {expiresIn: `1h`},
      );

      user.online = new Date();
      await user.save();

      response.json({
        token,
        username: user.username,
        userId: user.id,
        accountType: user.accountType,
      });
    } catch (e) {
      response
        .status(500)
        .json({message: `Щось пішло не так, спробуйте знову.`});
    }
  },
);

module.exports = router;
