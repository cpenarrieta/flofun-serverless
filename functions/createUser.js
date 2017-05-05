const admin = require('firebase-admin')

module.exports = function(req, res) {
  if (!req.body.uid) {
    return res.status(422).send({ error: 'bad input' })
  }

  const uid = String(req.body.uid).replace(/[^\d]/g, '')

  admin.auth().getUser(uid)
    .then(userRecord => saveRecord(uid, req.body, res))
    .catch(error => {
      admin.auth().createUser({ uid: uid })
        .then(user => saveRecord(uid, req.body, res))
    })
}

function saveRecord(uid, user, res) {
  admin.database().ref(`users/${uid}`)
    .update({ source: user.source, name: user.name || '' }, () => res.send({ success: true }))
}
