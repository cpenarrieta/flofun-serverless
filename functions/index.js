const admin = require('firebase-admin')
const functions = require('firebase-functions')

const serviceAccount = require('./service_account.json')
const createUser = require('./createUser')
const requestOneTimePassword = require('./requestOneTimePassword')
const verifyOneTimePassword = require('./verifyOneTimePassword')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://flofun-877b0.firebaseio.com",
})

exports.createUser = functions.https.onRequest(createUser)

exports.requestOneTimePassword = functions.https.onRequest(requestOneTimePassword)

exports.verifyOneTimePassword = functions.https.onRequest(verifyOneTimePassword)
