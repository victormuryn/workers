import {Request, Response, Router} from 'express';
import {LeanDocument} from 'mongoose';

const fs = require('fs');
const path = require('path');
const https = require('https');
const {exec} = require('child_process');

import City, {CityDocument} from '../models/City';
import User, {UserType} from '../models/User';
import Category from '../models/Category';
import Project from '../models/Project';
import Bet from '../models/Bet';

import * as sharp from 'sharp';
import * as multer from 'multer';
import * as config from 'config';

import auth from '../middlewares/auth.middleware';

const upload = multer({
  limits: {
    fieldNameSize: 255,
    files: 1,
    fields: 1,
    fileSize: 5242880,
  },
}).single(`avatar`);

// eslint-disable-next-line new-cap
const router = Router();

const getPlace = <T extends {_id?: string}>(list: T[], id: string ) => {
  return list.findIndex(({_id}) => _id && _id.toString() === id);
};

router.get(
  `/activities`,
  [auth],
  async (request: Request, response: Response) => {
    const author = request.user;
    const projectsPerPage = config.get<number>(`projectsPerPage`) || 12;


    const reqPage = request.query.page;
    const page = (reqPage && !isNaN(+reqPage)) ? +reqPage - 1 : 0;

    if (!author) {
      return response.status(500).json({
        message: `Ви не увійшли в аккаунт`,
      });
    }

    const user = await User.findById(author).select(`accountType`);

    if (!user) {
      return response.status(500).json({
        message: `Не вдалося знайти користувача`,
      });
    }

    if (user.accountType === `freelancer`) {
      const data = await Bet
        .find({author: user._id})
        .skip(page * projectsPerPage)
        .limit(projectsPerPage)
        .sort({date: -1})
        .populate({
          path: `project`,
          populate: [{
            path: `location`,
            select: `-_id city region`,
          }, {
            path: `category`,
            select: `title`,
          }],
          select: `title price hot remote location category`,
        })
        .select(`project date price term`)
        .lean();

      const projectsCount = await Bet.countDocuments({author: user._id});

      return response.json({
        data,
        type: user.accountType,
        maxPage: Math.ceil(projectsCount / projectsPerPage),
      });
    }

    if (user.accountType === `client`) {
      const data = await Project
        .find({author: user._id})
        .sort({date: -1})
        .skip(page * projectsPerPage)
        .limit(projectsPerPage)
        .populate({
          path: `category`,
          select: `title`,
        })
        .populate({
          path: `location`,
          select: `-_id city region`,
        })
        .select(`price title hot date category remote location bets`)
        .lean();

      const projectsCount = await Project.countDocuments({author: user._id});

      return response.json({
        data,
        type: user.accountType,
        maxPage: Math.ceil(projectsCount / projectsPerPage),
      });
    }

    return response.json({
      type: `freelancer`,
      data: [],
    });
  },
);

router.get(`/:username`, async (request: Request, response: Response) => {
  try {
    // get "username" from url and get user by "username"
    const {username} = request.params;
    const user = await User
      .findOne({username})
      .populate(`location`)
      .select(`_id quote cv
        name surname username online
        social image rating accountType
        finished location categories`)
      .lean();

    // if there isn't user
    if (!user) {
      return response
        .status(404)
        .json({message: `Користувач не знайдений`});
    }

    const categories = [];
    for (let i = 0; i < user.categories.length; i++) {
      const category = await Category.findById(user.categories[i]).lean();

      if (!category) continue;

      const usersRating = await User
        .find({
          accountType: user.accountType,
          categories: category._id,
        })
        .sort({rating: -1})
        .select(`_id`)
        .lean();

      const place = getPlace<LeanDocument<UserType>>(
        usersRating,
        user._id.toString(),
      );

      categories.push({
        place: place + 1,
        id: category._id,
        url: category.url,
        title: category.title,
        group: category.group,
        all: usersRating.length,
      });
    }

    const usersRating = await User
      .find({accountType: user.accountType})
      .sort({'rating': -1})
      .select(`_id`)
      .lean();

    const place = getPlace<LeanDocument<UserType>>(
      usersRating,
      user._id.toString(),
    );

    const rating = {
      place: place + 1,
      all: usersRating.length,
    };

    response.json({user, rating, categories});
  } catch (e) {
    response
      .status(500)
      .json({message: `Щось пішло не так, спробуйте знову.`});
  }
});

router.patch(
  `/:username`,
  auth,
  async (request: Request, response: Response) => {
    try {
      const author = request.user;
      const {username} = request.params;

      if (!author) {
        return response.status(500).json({
          message: `Ви не увійшли в аккаунт`,
        });
      }

      const {name, surname, quote, cv, social, categories} = request.body;

      const user = await User.findOne({username});

      if (!user) {
        return response.status(500).json({
          message: `Неправильний логін`,
        });
      }

      if (user._id.toString() === author) {
        // delete "/" in the end of string
        for (const socialItem in social) {
          if (social.hasOwnProperty(socialItem)) {
            const item = social[socialItem];

            if (item[item.length - 1] === `/`) {
              social[socialItem] = item.slice(0, item.length - 1);
            }
          }
        }

        user.cv = cv;
        user.name = name;
        user.quote = quote;
        user.social = social;
        user.surname = surname;
        user.categories = categories;

        await user.save();

        return response.json({message: `Дані успішно оновлені!`});
      }

      return response
        .status(403)
        .json({message: `Зайдіть у свій аккаунт для оновлення даних.`});
    } catch (e) {
      response
        .status(500)
        .json({message: `Щось пішло не так, спробуйте знову.`});
    }
  },
);

// patch === partial update
router.patch(`/:username/avatar`,
  auth,
  async (request: Request, response: Response) => {
    try {
      const author = request.user;
      const {username} = request.params;

      const user = await User.findOne({username});

      if (!user) {
        return response.status(500).json({
          message: `Користувач не знайдений`,
        });
      }

      upload(request, response, async (err: any) => {
        if (err) {
          return response
            .status(500)
            .json({message: `Фотографія занадто велика`});
        }

        if (!request.file) {
          return response
            .status(500)
            .json({message: `Не вдалося завантажити файл.`});
        }

        const avatar = request.file;
        const nameParts = avatar.originalname.split(`.`);
        const extension = nameParts[nameParts.length - 1];

        const pathToFolder = `client/dist/img/users/`;

        if (user._id.toString() === author) {
          const croppedImg = await sharp(avatar.buffer)
            .resize({width: 200, height: 200, fit: `cover`})
            .toBuffer();

          const pathToPhoto = path
            .join(pathToFolder, `${username}.${extension}`);

          return fs.writeFile(
            pathToPhoto,
            croppedImg,
            async (error: NodeJS.ErrnoException | null ) => {
              if (error) throw error;

              user.image = true;
              await user.save();

              // optimize with squoosh
              // eslint-disable-next-line max-len
              exec(`npx @squoosh/cli ${pathToPhoto} --webp '{"quality":90}' -d ${pathToFolder}`,
                (err: NodeJS.ErrnoException | null) => {
                  if (err) throw err;

                  // eslint-disable-next-line max-len
                  exec(`npx @squoosh/cli ${pathToPhoto} --mozjpeg '{"quality":90,"progressive":true}' -d ${pathToFolder}`,
                    (err1: NodeJS.ErrnoException | null) => {
                      if (err1) throw err1;
                      return response.json({message: `Фото успішно оновлене!`});
                    });
                });
            });
        }

        return response
          .status(403)
          .json({message: `Зайдіть у свій аккаунт для оновлення даних.`});
      });
    } catch (e) {
      response
        .status(500)
        .json({message: `Щось пішло не так, спробуйте знову.`});

      console.log(e);
    }
  });

router.patch(
  `/:username/location`,
  auth,
  async (request: Request, response: Response) => {
    try {
      const author = request.user;
      const {username} = request.params;
      const {latitude, longitude} = request.body;

      const user = await User.findOne({username});

      if (!user) {
        return response.status(500).json({
          message: `Користувач не знайдений`,
        });
      }

      if (user._id.toString() === author) {
        return https.get(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=uk`,
          (res: NodeJS.ReadableStream) => {
            let result = ``;

            res.on(`data`, (d: Buffer) => {
              result += d.toString();
            });

            res.on(`end`, async () => {
              const {city} = JSON.parse(result);

              const location = await City.find({city}).lean();

              if (!location) {
                return new Error(`Не вдалося знайти населений пункт`);
              }

              let min: number = Infinity;
              let userCity: LeanDocument<CityDocument>;

              for (let i = 0; i < location.length; i++) {
                const currentCity = location[i];

                const distance = Math.hypot(
                  Math.abs(latitude - currentCity.latitude),
                  Math.abs(longitude - currentCity.longitude),
                );

                if (distance < min) {
                  min = distance;
                  userCity = currentCity;
                }

                if (distance < 0.05) break;
              }

              // @ts-ignore
              user.location = userCity._id;
              await user.save();

              // @ts-ignore
              return response.json(userCity);
            });
          }).on(`error`, (e: NodeJS.ErrnoException) => {
          throw e;
        });
      }

      return response
        .status(403)
        .json({message: `Зайдіть у свій аккаунт для оновлення даних.`});
    } catch (e) {
      response
        .status(500)
        .json({message: `Щось пішло не так, спробуйте знову.`});
    }
  });

module.exports = router;

