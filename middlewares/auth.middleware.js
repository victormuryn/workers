const jwt = require(`jsonwebtoken`);
const config = require(`config`);

module.exports = (request, response, next) => {
  if (request.method === `OPTIONS`) {
    return next();
  }

  try {
    // Bearer TOKEN
    const token = request.headers.authorization.split(` `)[1];

    if (!token) {
      return response
        .status(401)
        .json({message: `Ви не авторизовані`});
    }

    request.user = jwt.decode(token, config.get(`jwtPhrase`));
    next();
  } catch (e) {
    response
      .status(401)
      .json({message: `Ви не авторизовані`});
  }
};
