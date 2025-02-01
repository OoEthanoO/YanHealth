const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

mongoose.connect(
  'mongodb+srv://Cluster56280:N3WO0GcYZI4a8Lqp@cluster0.xhw4u.mongodb.net/',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
);

app.use('/api/users', require('./routes/users'));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
