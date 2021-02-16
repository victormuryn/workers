const {Router} = require(`express`);
const User = require(`../models/User`);

const router = new Router();

router.get(`/:id`, async (request, response) => {
  try {
    const user = await User.findById(request.params.id);

    if (!user) {
      return response
        .status(404)
        .json({message: `Користувач не знайдений`});
    }

    response.json(user);
  } catch (e) {
    response
      .status(500)
      .json({message: `Щось пішло не так, спробуйте знову.`});
  }
});

module.exports = router;
