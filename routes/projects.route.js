const {Router} = require(`express`);
const Project = require(`../models/Project`);
const auth = require(`../middlewares/auth.middleware`);

const router = new Router();

router.post(`/create`, auth, async (request, response) => {
  try {
    const {title, description, date, price, expire} = request.body;

    const author = request.user;

    const project = new Project({
      date,
      title,
      price,
      author,
      expire,
      description,
    });
    await project.save();

    response
      .status(201)
      .json({id: project._id});
  } catch (e) {
    response
      .status(500)
      .json({message: `Щось пішло не так, спробуйте знову.`});
  }
});

router.get(`/`, async (request, response) => {
  try {
    const projects = await Project
      .find({})
      .select(`title price date`)
      .sort({date: -1})
      .limit(20);

    response.json(projects);
  } catch (e) {
    response
      .status(500)
      .json({message: `Щось пішло не так, спробуйте знову.`});
  }
});

router.get(`/:id`, async (request, response) => {
  try {
    const project = await Project.findById(request.params.id);

    if (!project) {
      return response
        .status(404)
        .json({message: `Проєкт не знайдений, спробуйте знову.`});
    }

    response.json(project);
  } catch (e) {
    response
      .status(500)
      .json({message: `Щось пішло не так, спробуйте знову.`});
  }
});

module.exports = router;
