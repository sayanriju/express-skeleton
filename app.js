const express = require("express")
const path = require("path")
// const favicon = require("serve-favicon")
const logger = require("morgan")
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const session = require("express-session")
const mailer = require("express-mailer")
// const helmet = require('helmet');

const config = require("./config")[process.env.NODE_ENV || "development"]

const routes = require("./routes/web/index")
// const users = require('./routes/users');

const app = express()

// For Prod usage (SECURITY)
// app.use(helmet())

mailer.extend(app, {
  from: config.email.from,
  host: config.email.host, // hostname
  secureConnection: true, // use SSL
  port: config.email.port, // port for secure SMTP
  transportMethod: "SMTP", // default is SMTP. Accepts anything that nodemailer accepts
  auth: {
    user: config.email.auth.user,
    pass: config.email.auth.pass
  }
})

mongoose.Promise = global.Promise
mongoose.connect(config.database, { useMongoClient: true })


// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"))
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

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render("error")
})


module.exports = app
