import * as express from 'express';
import * as http from 'http';
import * as config from 'config';
import * as mongoose from 'mongoose';

const app = express();
const server = new http.Server(app);

require(`./routes/messages/messages`)(server);

const PORT = config.get(`port`) || 5000;

app.use(express.json());

// change api to all in prod
app.use(`/api/`, require(`./middlewares/online.middleware`));

app.use(`/api/auth`, require(`./routes/auth.route`));
app.use(`/api/user`, require(`./routes/user.route`));
app.use(`/api/project`, require(`./routes/projects.route`));
app.use(`/api/bet`, require(`./routes/bets.route`));
app.use(`/api/categories`, require(`./routes/categories.route`));

const start = async () => {
  try {
    await mongoose.connect(config.get(`mongoUri`), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    server.listen(PORT, () => {
      console.log(`\x1b[32m%s\x1b[0m`, `
       ===========================
=========================================
===== Server's running on port ${PORT} =====
=========================================
       ===========================
      `);
    });
  } catch (e) {
    console.log(`\x1b[31m%s\x1b[0m`, `Server Error: ${e.message}`);
    process.exit(1);
  }
};

start();
