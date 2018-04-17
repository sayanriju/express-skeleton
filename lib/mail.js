const { host, port, from, auth } = require("../config")[process.env.NODE_ENV || "development"]
const Email = require("email-templates")

module.exports = (template, { to, subject, locals, attachments = [], send = true }) => new Email({
  message: {
    from
  },
  send, // set to false for dry-runs
  transport: {
    host,
    port,
    secure: true, // use SSL
    auth
  }
})
  .send({
    template,
    message: {
      to,
      subject,
      attachments
    },
    locals
  })
