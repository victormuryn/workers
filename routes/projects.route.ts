import * as fs from 'fs';

import {Request, Response, Router} from 'express';
import {Types} from 'mongoose';
import {check} from 'express-validator';
import * as csv from 'csv-parse';

import Project from '../models/Project';

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
      .isNumeric()
      .custom((value) => value >= 200),
    check(`expire`, `Виберіть дату завершення проєкту`)
      .custom((value) => !isNaN(Date.parse(value)))
      .custom((value, {req}) => {
        return +(new Date(value)) - +(new Date(req.body.date)) > 0;
      }),
    check(`hot`, `Виберіть тип проєкту`)
      .isBoolean(),
    check(`category`, `Виберіть категорію`)
      .custom((value) => Types.ObjectId.isValid(value)),
    check(`remote`, `Виберіть місто`)
      .isBoolean(),
    check(`location.city`, `Виберіть місто`)
      .isString(),
    check(`location.region`, `Виберіть місто`)
      .isString(),
    check(`location.district`, `Виберіть місто`)
      .isString(),
    check(`location.longitude`, `Виберіть місто`)
      .isNumeric(),
    check(`location.latitude`, `Виберіть місто`)
      .isNumeric(),
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
      if (!remote) {
        if (
          !location.city ||
          !location.district ||
          !location.region ||
          !location.latitude ||
          !location.longitude
        ) {
          return response
            .status(400)
            .json({
              message: `Некоректні данні при заповненні форми. Виберіть місто.`,
            });
        }
      }

      // everything is ok (with data)
      // get user after middleware
      const author = request.user;

      // create project and save it
      const project = new Project({
        hot, date, price, author,
        expire, remote, location,
        category, description,
        title: title.trim(),
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
  },
);

router.get(`/`, async (request: Request, response: Response) => {
  try {
    // get first 20 projects sorted by date
    const projects = await Project
      .find({})
      .populate(`category`)
      .select(`title price date hot location remote category bets`)
      .sort({date: -1})
      .lean();

    response.json(projects);
  } catch (e) {
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
      .populate(`category`)
      .populate({
        path: `bets`,
        populate: {
          path: `author`,
          select: `_id name surname username image`,
        },
      })
      .populate(
        `author`,
        `_id name surname username image location.city location.country`,
      );

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

router.get(`/city/:cityName`, async (request: Request, response: Response) => {
  try {
    const {cityName} = request.params;

    const data: string[][] = [];
    const readStream = fs
      .createReadStream(`./data/cities_uk.csv`)
      .pipe(csv( {delimiter: `,`} ));

    return readStream
      .on('data', (row: string[]) => {
        if (row[0].toLowerCase().includes(cityName.toLowerCase())) {
          data.push(row);
        }

        if (data.length > 20) {
          readStream.destroy();
        }
      })
      .on('close', (err: Error) => {
        if (err) throw err;

        const result = data
          .map((cityData) => {
            const [city,,, longitude, latitude] = cityData;
            const district = cityData[1][0] === 'м' ?
              cityData[1] :
              `${cityData[1]} район`;

            const region = cityData[2][0] === 'м' ?
              cityData[2] :
              `${cityData[2]} область`;
            return {city, district, region, longitude, latitude};
          });

        return response.json(result);
      });
  } catch (e) {
    response
      .status(500)
      .json({message: `Щось пішло не так, спробуйте знову.`});
  }
});


module.exports = router;
