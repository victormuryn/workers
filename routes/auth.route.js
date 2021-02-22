const {Router} = require(`express`);
const {check, validationResult} = require(`express-validator`);

const bcrypt = require(`bcrypt`);
const jwt = require(`jsonwebtoken`);
const config = require(`config`);

const User = require(`../models/User`);

const router = new Router();

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
    check(`phone`, `Некоректний номер телефону`).isMobilePhone(),
    check(`password`, `Введіть пароль`).exists(),
    check(`accountType`, `Виберіть тип аккаунту`).exists(),
  ],
  async (request, response) => {
    try {
      const errors = validationResult(request);

      if (!errors.isEmpty()) {
        const error = errors.array()[0].msg;

        return response
          .status(400)
          .json({
            message: `Некоректні данні при реєстрації: ${error}`,
          });
      }

      const {
        email: requestEmail,
        name,
        surname,
        phone,
        password,
        accountType,
        username,
      } = request.body;
      const email = requestEmail.toLowerCase();

      const candidate = await User.findOne({email});
      const candidatePhone = await User.findOne({phone});
      const candidateUsername = await User.findOne({username});

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

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        name,
        surname,
        username,
        email,
        phone,
        accountType,
        password: hashedPassword,
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
  async (request, response) => {
    try {
      const errors = validationResult(request);

      if (!errors.isEmpty()) {
        const error = errors.array()[0].msg;
        return response
          .status(400)
          .json({
            message: `Некоректні данні при вході: ${error}`,
          });
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
