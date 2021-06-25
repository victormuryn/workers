import {Request, Response, Router} from 'express';
import {Types} from 'mongoose';
import {check} from 'express-validator';
import * as config from 'config';

import Project from '../models/Project';
import City from '../models/City';

import auth from '../middlewares/auth.middleware';
import {client} from '../middlewares/users.middleware';

import {handleErrors} from '../utils';

// eslint-disable-next-line new-cap
const router = Router();

router.post(
  `/create`,
  [
    auth,
    client,
    check(`title`, `Введіть заголовок`)
      .isString()
      .exists({checkFalsy: true}),
    check(`description`, `Введіть опис проєкту`)
      .isString()
      .exists({checkFalsy: true}),
    check(`date`, `Виникла помилка`)
      .custom((value) => !isNaN(Date.parse(value))),
    check(`price`, `Введіть ціну`)
      .custom((value) => +value >= 200 || !value),
    check(`expire`, `Виберіть дату завершення проєкту`)
      .custom((value) => !isNaN(Date.parse(value)))
      .custom((value, {req}) => {
        return +(new Date(value)) - +(new Date(req.body.date)) > 0;
      }),
    check(`hot`, `Виберіть тип проєкту`)
      .isBoolean(),
    check(`category`, `Виберіть категорію`)
      .isArray()
      .custom((value) => value.every((e: string) => Types.ObjectId.isValid(e))),
    check(`remote`, `Виберіть місто`)
      .isBoolean(),
    check(`location`, `Виберіть місто`)
      .custom((value) => Types.ObjectId.isValid(value) || !value),
  ],
  async (request: Request, response: Response) => {
    try {
      // if there are errors in request.body
      if (handleErrors(
        request,
        response,
        `Некоректні данні при заповненні форми:`,
      )) return;

      const {
        title, description,
        date, price, expire, hot,
        category, remote, location,
      } = request.body; // all data from request

      // if project is not remote and there're no location
      if (!remote && !location) {
        return response
          .status(400)
          .json({
            message: `Некоректні данні при заповненні форми. Виберіть місто.`,
          });
      }

      // everything is ok (with data)
      // get user after middleware
      const author = request.user;

      const numberPrice = (price && !isNaN(+price)) ? +price : 0;

      // create project and save it
      const project = new Project({
        hot, date, author,
        expire, remote, location,
        category, description,
        title: title.trim(),
        price: numberPrice,
      });
      await project.save();

      response
        .status(201)
        .json({id: project._id});
    } catch (e) {
      console.log(e);
      response
        .status(500)
        .json({message: `Щось пішло не так, спробуйте знову.`});
    }
  },
);

router.get(`/`, async (request: Request, response: Response) => {
  try {
    const page = (request.query.page && !isNaN(+request.query.page)) ?
      +request.query.page - 1 :
      0;

    const {remote, hot, location, categories} = request.query;
    const query: {
      hot?: true,
      remote?: true,
      location?: {$in: string[]},
      category?: {$in: string[]},
      expire: { $gt: Date },
    } = {
      expire: {$gt: new Date()},
    };


    if (remote === `true`) query.remote = true;
    if (hot === `true`) query.hot = true;
    if (location && typeof location === `string`) {
      try {
        query.location = {$in: <string[]>JSON.parse(location)};
      } catch (e) {}
    }

    if (categories && typeof categories === `string`) {
      try {
        query.category = {
          $in: <string[]>JSON.parse(categories),
        };
      } catch (e) {}
    }

    const projectsPerPage = <number>config.get(`projectsPerPage`);

    // get 20 projects sorted by date
    const projects = await Project
      .find(query)
      .sort({hot: -1, date: -1})
      .skip(page * projectsPerPage)
      .limit(projectsPerPage)
      .populate(`category location`)
      .select(`title price date hot location remote category bets description`)
      .lean();

    // delete html from preview description
    projects.forEach((project) => {
      project.description = project.description
        .replace(/(<([^>]+)>)/gi, ` `)
        .replace(/  +/g, ` `)
        .substring(0, 130);
    });

    const projectsCount = await Project.countDocuments(query);

    response.json({
      projects,
      pages: Math.ceil(projectsCount / projectsPerPage),
    });
  } catch (e) {
    console.log(e);
    response
      .status(500)
      .json({message: `Щось пішло не так, спробуйте знову.`});
  }
});

router.get(`/:id`, async (request, response) => {
  try {
    const {id} = request.params;

    if (!Types.ObjectId.isValid(id)) {
      return response
        .status(404)
        .json({
          message: `Неправильний ідентифікатор проєкту, спробуйте знову.`,
        });
    }

    const project = await Project
      .findById(id)
      .populate(`category location`)
      .populate({
        path: `bets`,
        populate: {
          path: `author`,
          select: `name surname username image`,
        },
      })
      .populate({
        path: `author`,
        populate: {
          path: `location`,
        },
        select: `name surname username image location`,
      });

    if (!project) {
      return response
        .status(404)
        .json({message: `Проєкт не знайдений, спробуйте знову.`});
    }

    response.json(project);

    project.views++;
    await project.save();
  } catch (e) {
    response
      .status(500)
      .json({message: `Щось пішло не так, спробуйте знову.`});
  }
});

router.patch(`/:id`, [
  auth,
  check(`title`, `Введіть заголовок`)
    .isString()
    .exists({checkFalsy: true}),
  check(`description`, `Введіть опис`)
    .isString()
    .exists({checkFalsy: true}),
  check(`price`, `Введіть ціну`)
    .custom((value) => !value || +value >= 200),
], async (request: Request, response: Response) => {
  try {
    // if there are errors in request.body
    if (handleErrors(
      request,
      response,
      `Некоректні данні при заповненні форми:`,
    )) return;

    const {id} = request.params;

    if (!Types.ObjectId.isValid(id)) {
      return response
        .status(404)
        .json({
          message: `Неправильний ідентифікатор проєкту, спробуйте знову.`,
        });
    }

    const author = request.user;
    const project = await Project
      .findById(id)
      .populate(`category location`)
      .populate({
        path: `bets`,
        populate: {
          path: `author`,
          select: `name surname username image`,
        },
      })
      .populate({
        path: `author`,
        populate: {
          path: `location`,
        },
        select: `name surname username image location`,
      });

    if (!project) {
      return response
        .status(404)
        .json({message: `Проєкт не знайдений, спробуйте знову.`});
    }

    if (project.author._id.toString() !== author) {
      return response
        .status(403)
        .json({message: `Ви не авторизовані.`});
    }

    const {title, description, price} = request.body;

    project.title = title;
    project.description = description;
    project.price = price;
    project.updated = {
      count: project.updated.count + 1,
      lastDate: new Date(),
    };

    await project.save();

    return response.json({message: `Успішно оновлено!`, project});
  } catch (e) {
    response
      .status(500)
      .json({message: `Щось пішло не так, спробуйте знову.`});
  }
});

router.delete(`/:id`, auth, async (request, response) => {
  try {
    const author = request.user;
    const {id} = request.params;

    if (!Types.ObjectId.isValid(id)) {
      return response
        .status(404)
        .json({
          message: `Неправильний ідентифікатор проєкту, спробуйте знову.`,
        });
    }

    const project = await Project.findById(id);

    if (!project) {
      return response
        .status(404)
        .json({message: `Проєкт не знайдений, спробуйте знову.`});
    }

    if (project.author.toString() === author) {
      project.expire = new Date();
      await project.save();
      return response.json(project);
    }

    return response
      .status(403)
      .json({message: `Ви не авторизовані.`});
  } catch (e) {
    response
      .status(500)
      .json({message: `Щось пішло не так, спробуйте знову.`});
  }
});

router.get(`/city/:city`, async (request: Request, response: Response) => {
  try {
    const {city} = request.params;

    const regex = new RegExp(`.*${city}.*`, `i`);
    const result = await City
      .find({'city': regex})
      .limit(20)
      .lean();

    return response.json(result);
  } catch (e) {
    response
      .status(500)
      .json({message: `Щось пішло не так, спробуйте знову.`});
  }
});


module.exports = router;
