const dotenv = require('dotenv').config;
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const PORT = process.env.PORT || 6000;
// Setting the layouts to work with things to import and pass to public folder

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layout/layout');

// Starting up server on a port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
