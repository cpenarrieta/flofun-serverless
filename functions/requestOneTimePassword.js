const admin = require('firebase-admin')
const twilio = require('./twilio')
const { twilioPhone } = require('./secret')

module.exports = function(req, res) {
  if (!req.body.phone) {
    return res.status(422).send({ error: 'You must provide a phone number' })
  }

  const phone = String(req.body.phone).replace(/[^\d]/g, '')

  admin.auth().getUser(phone)
    .then(userRecord => {
      const code = Math.floor((Math.random() * 8999 + 1000))

      twilio.messages.create({
        body: `Welcome to FLOFUN, your code is ${code}`,
        to: phone,
        from: twilioPhone,
      }, (err) => {
        if (err) {
          return res.status(422).send({ error: 'error with twilio' })
        }
        
        admin.database().ref(`users/${phone}`)
          .update({ code: code, codeValid: true }, () => res.send({ success: true }))
      })
    })
    .catch(error => res.status(422).send({ error: 'user not found' }))
}
