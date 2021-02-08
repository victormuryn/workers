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
    check(`email`, `Некоректний email`).isEmail(),
    check(`name`, `Некоректне ім'я`)
      .not()
      .custom((val) => /[^A-za-z0-9\s]/g.test(val)),
    check(`phone`, `Некоректний номер телефону`).isMobilePhone(),
    check(`password`, `Введіть пароль`).exists(),
    check(`accountType`, `Виберіть тип аккаунту`).exists(),
  ],
  async (request, response) => {
    try {
      const errors = validationResult(request);

      if (!errors.isEmpty()) {
        return response
          .status(400)
          .json({
            errors: errors.array(),
            message: `Некоректні данні при реєстрації`,
          });
      }

      const {email, name, phone, password, accountType} = request.body;

      const candidate = await User.findOne({email});

      if (candidate) {
        return response
          .status(400)
          .json({message: `Користувач з таким email уже існує`});
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        name,
        email,
        phone,
        accountType,
        password: hashedPassword,
      });

      await user.save();

      response
        .status(201)
        .json({message: `Користувач успішно створений`});
    } catch (e) {
      response
        .status(500)
        .json({message: `Щось пішло не так, спробуйте знову`});
      console.log(e);
    }
  },
);

// /api/auth/login
router.post(
  `/login`,
  [
    check(`email`, `Некоректний email`).isEmail(),
    check(`password`, `Введіть пароль`).exists(),
  ],
  async (request, response) => {
    try {
      const errors = validationResult(request);

      if (!errors.isEmpty()) {
        return response
          .status(400)
          .json({
            errors: errors.array(),
            message: `Некоректні данні при вході`,
          });
      }

      const {email, password} = request.body;

      const user = await User.findOne({email});

      if (!user) {
        return response
          .status(400)
          .json({message: `Користувач з таким email не знайдений`});
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return response
          .status(400)
          .json({message: `Неправильний пароль, спробуйте знову`});
      }

      const token = jwt.sign(
        {userId: user.id},
        config.get(`jwtPhrase`),
        {expiresIn: `1h`},
      );

      response.json({token, userId: user.id});
    } catch (e) {
      response
        .status(500)
        .json({message: `Щось пішло не так, спробуйте знову`});
      console.log(e);
    }
  },
);

module.exports = router;
