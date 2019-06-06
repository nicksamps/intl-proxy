const twilio = require('twilio');

module.exports = {
  getTwilioClient: (accountSid, authToken) => {
    return new twilio(accountSid, authToken);
  },
  getVoiceResponse: () => {
    return new twilio.twiml.VoiceResponse();
  }
}
