const {Router} = require(`express`);

const router = new Router();

// /api/auth/register
router.post(
  `/register`,
  async (request, response) => {
    try {
      // const {email, name, phone, password, accountType} = request.body;
    } catch (e) {
      response
        .status(500)
        .json({message: `Щось пішло не так, спробуйте знову`});
    }
  },
);

module.exports = router;
