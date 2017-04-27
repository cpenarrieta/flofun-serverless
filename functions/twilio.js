const twilio = require('twilio')

const { accountSid, authToekn } = require('./secret')

module.exports = new twilio(accountSid, authToekn)
