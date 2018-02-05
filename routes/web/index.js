const express = require("express")
const router = express.Router()

/* GET home page. */
router.get("/", (req, res) => {
  res.io.emit("socketToMe", "hello from server");
  res.render("index", { title: "Express" })
})

module.exports = router
