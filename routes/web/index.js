const express = require("express")
const router = express.Router()

const mail = require("../../lib/mail")

/* GET home page. */
router.get("/", (req, res) => {
  res.render("index", { title: "Express" })
})

/* Test Email */
router.get("/email", (req, res) => {
  mail("first", { to: "sayan@logic-square.com", subject: "ki khobor", locals: { who: "sayan" } })
    .then(() => res.render("index", { title: "Express" }))
    .catch(() => res.render("index", { title: "Express Error" }))
})

module.exports = router
