const admin = require('firebase-admin')

module.exports = function(req, res) {
  if (!req.body.phone || !req.body.code) {
    return res.status(422).send({ error: 'Phone and Code must be provided' })
  }

  const phone = String(req.body.phone).replace(/[^\d]/g, '')
  const code = parseInt(req.body.code)

  admin.auth().getUser(phone)
    .then(userRecord => {
      const refUser = admin.database().ref(`users/${phone}`)

      refUser.on('value', snapshot => {
        refUser.off();
        const user = snapshot.val()

        if (user.code !== code || !user.codeValid) {
          return res.status(422).send({ error: 'Code not valid' })
        }

        refUser.update({ codeValid: false })

        admin.auth().createCustomToken(phone)
          .then(token => res.send({ success: true, token }))
          .catch(error => res.status(422).send({ error: 'error creating token' }))
      })
    })
    .catch(error => res.status(422).send({ error: 'user not found' }))
}
