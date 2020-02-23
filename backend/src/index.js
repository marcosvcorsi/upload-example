const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://admin:admin@localhost:27017/upload?authSource=admin&w=1', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(routes);

app.listen(3333);