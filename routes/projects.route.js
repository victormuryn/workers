const {Router} = require(`express`);
const Project = require(`../models/Project`);
const auth = require(`../middlewares/auth.middleware`);

const router = new Router();

router.post(`/create`, auth, async (request, response) => {
  try {
    const {title, description, price, expire} = request.body;

    const author = request.user;
    const project = new Project({title, description, price, expire, author});
    await project.save();

    response
      .status(201)
      .json({project});
  } catch (e) {
    response
      .status(500)
      .json({message: `Щось пішло не так, спробуйте знову.`});
  }
});

module.exports = router;
