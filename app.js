const express = require("express")
const path = require("path")
// const favicon = require("serve-favicon")
const logger = require("morgan")
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const session = require("express-session")
// const helmet = require('helmet');
const cors = require("cors")

const config = require("./config")[process.env.NODE_ENV || "development"]

const routes = require("./routes/web/index")
// const users = require('./routes/users');

const app = express()

// For Prod usage (SECURITY)
// app.use(helmet())
app.use(cors())

mongoose.Promise = global.Promise
mongoose.connect(config.database, { useMongoClient: true })


// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
if (process.env.NODE_ENV === undefined || !process.env.NODE_ENV.startsWith("test")) {
  app.use(logger("dev"))
}
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))
app.use(session({
  secret: config.secret,
  resave: false,
  cookie: { secure: false },
  saveUninitialized: true
}))

app.use("/", routes)
// app.use('/users', users);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found")
  err.status = 404
  next(err)
})

// log errors in development
app.use((err, req, res, next) => {
  if (req.app.get("env") === "development") console.error(err.stack)
  next(err)
})

// main error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render("error")
})


module.exports = app
