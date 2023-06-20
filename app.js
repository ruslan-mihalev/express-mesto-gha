const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: '64917d99ceb0b6d31c99d5b0',
  };

  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use('/cards', require('./routes/cards'));
app.use('/users', require('./routes/users'));

app.listen(PORT, () => {
  /* eslint-disable no-console */
  console.log(`Server on port ${PORT} started...`);
  /* eslint-enable no-console */
});
