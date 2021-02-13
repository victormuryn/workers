const express = require(`express`);
const config = require(`config`);
const mongoose = require(`mongoose`);

const PORT = config.get(`port`) || 5000;

const app = express();

app.use(express.json({extended: true}));

app.use(`/api/auth`, require(`./routes/auth.route`));
app.use(`/api/projects`, require(`./routes/projects.route`));


const start = async () => {
  try {
    await mongoose.connect(config.get(`mongoUri`), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    app.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
  } catch (e) {
    console.log(`Server Error: Unable to connect with DB `, e.message);
    process.exit(1);
  }
};

start();
