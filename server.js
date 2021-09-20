const dotenv = require('dotenv');
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');

dotenv.config({ path: '.env' });

const indexRouter = require('./routes/index');
const teamRouter = require('./routes/teams');
const playerRouter = require('./routes/players');
const PORT = process.env.PORT || 4000;
const connectDB = require('./database/connection');
connectDB();
// Setting the layouts to work with things to import and pass to public folder

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));

const mongoose = require('mongoose');
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to database'));

app.use('/', indexRouter);
app.use('/teams', teamRouter);
app.use('/players', playerRouter);
// Starting up server on a port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
