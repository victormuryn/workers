import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
import * as config from 'config';
import * as mongoose from 'mongoose';
import {Request, Response} from 'express';

const app = express();
const server = new http.Server(app);

require(`./routes/messages/messages`)(server);

const PORT = process.env.PORT || config.get(`port`) || 5000;

app.use(express.json());

// change api to all in prod
app.use(`/api/`, require(`./middlewares/online.middleware`));

app.use(`/api/auth`, require(`./routes/auth.route`));
app.use(`/api/user`, require(`./routes/user.route`));
app.use(`/api/project`, require(`./routes/projects.route`));
app.use(`/api/bet`, require(`./routes/bets.route`));
app.use(`/api/categories`, require(`./routes/categories.route`));

if (process.env.NODE_ENV === `production`) {
  app.use(`/`, express.static(path.join(__dirname, `client`, `dist`)));
  app.get(`*`, (request: Request, response: Response) => {
    response.sendFile(path.resolve(__dirname, `client`, `dist`, `index.html`));
  });
}

const start = async () => {
  try {
    await mongoose.connect(config.get(`mongoUri`), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    server.listen(PORT, () => {
      console.log(`
       ===========================
=========================================
===== Server's running on port ${PORT} =====
=========================================
       ===========================
      `);
    });
  } catch (e) {
    console.log(`Server Error: ${e.message}`);
    process.exit(1);
  }
};

start();
