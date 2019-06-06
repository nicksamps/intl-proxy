'use strict';

const qs = require('querystring');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_NUMBER;
const accepted_user_numbers = process.env.ACCEPTED_USER_NUMBERS.split(',');

const twilio = require('twilio');
const client = new twilio(accountSid, authToken);

module.exports.smsReceived = async (event) => {
  let post = qs.parse(event.body);
  let toNumber = post.Body;
  let userNumber = post.From;

  let host = event.headers.Host;
  let path = event.requestContext.path;
  let callbackUrl = `https://${host}${path.replace('smsreceived', 'twiliocallback')}/${toNumber}`;

  if (accepted_user_numbers.indexOf(userNumber) > -1) {
    console.log(`connect user with number ${userNumber} to ${toNumber}`);
    await client.calls
        .create({
           url: callbackUrl,
           to: userNumber,
           from: twilioNumber
         })
        .then(call => console.log(`Twilio call ID: ${call.sid}`));
  } else {
    console.log(`Invalid user number: ${userNumber}`);
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/xml'
    }
  };
};

module.exports.twilioCallback = async (event) => {
  let post = qs.parse(event.body);
  let number = event.pathParameters.number;

  const response = new twilio.twiml.VoiceResponse();
  response.dial(number);
  console.log(`connected to user, now dialing ${number}`);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/xml'
    },
    body: response.toString()
  };
};
