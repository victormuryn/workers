const express = require(`express`);
const config = require(`config`);

const PORT = config.get(`port`) || 5000;

const app = express();

app.use(`/api/auth`, require(`./routes/auth.route`));

app.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
