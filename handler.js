'use strict';

const qs = require('querystring');
const helpers = require('./helpers');
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_NUMBER;
const acceptedUserNumbers = process.env.ACCEPTED_USER_NUMBERS.split(',');

module.exports.smsReceived = async (event) => {
  let post = qs.parse(event.body);
  let toNumber = post.Body;
  let userNumber = post.From;

  let host = event.headers.Host;
  let path = event.requestContext.path;
  let callbackUrl = `https://${host}${path.replace('smsreceived', 'twiliocallback')}/${toNumber}`;

  let client = helpers.getTwilioClient(accountSid, authToken);

  if (acceptedUserNumbers.indexOf(userNumber) > -1) {
    console.log(`connect user with number ${userNumber} to ${toNumber}`);
    await client.calls
        .create({
           url: callbackUrl,
           to: userNumber,
           from: twilioNumber
         })
        .then(call => console.log(`Twilio call ID: ${call.sid}`));
  } else {
    console.warn(`Invalid user number: ${userNumber}`);
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/xml'
    }
  };
};

module.exports.twilioCallback = async (event) => {
  let number = event.pathParameters.number;

  const response = helpers.getVoiceResponse();
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
