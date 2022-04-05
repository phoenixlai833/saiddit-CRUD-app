const express = require("express");
const bodyParser = require("body-parser");
var cookieSession = require('cookie-session');

const app = express();

const homeRouter = require("./routers/homeRouter");
const subsRouter = require("./routers/subsRouter");
const postsRouter = require("./routers/postsRouter");
const commentsRouter = require("./routers/commentsRouter");
const usersRouter = require("./routers/usersRouter");

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'))
// app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieSession({
  name: 'session',
  keys: ["username"],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.use("/", homeRouter);
app.use("/subs", subsRouter);
app.use("/posts", postsRouter);
app.use("/comments", commentsRouter);
app.use("/users", usersRouter);

module.exports = app;