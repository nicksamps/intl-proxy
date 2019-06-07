## What does this do?

Send a text with a body of a phone number with its international code (which we'll call `X`) to a Twilio phone number that you own (which we'll call `Y`). You will then receive a phone call from `Y` connecting you to `X`.

## Why build this when we have Skype and Whatsapp calls?

I built this to use on a long distance hike in the states so that I can call my family back home in the UK. I know that when I do eventually get cell phone reception, it is unlikely that it will be good enough for any VoIP services. I'm hoping that this will work instead while avoiding gross international fees on regular networks (I think it should cost a bit less than 3¢ per minute for a US -> UK call using this). 

## Setup

1. Follow the instructions [here](https://serverless.com/framework/docs/providers/aws/guide/installation/) to install Serverless and set up the AWS cli and credentials.
1. Setup a Twilio account (unfortunately you can't use a trial account for this)
1. Run `npm install`
1. Set up a `keys.dev.yml`, `keys.test.yml` and do the same for any other environments (see example below)
1. To deploy run `serverless deploy -v` (you can optionally add the `--stage ENV_NAME` flag otherwise it defaults to `dev`)
1. Copy the endpoint from the `Stack Outputs` ending in `smsreceived` and add it as one of your number`s SMS webhook hook in the Twilio console
1. Text a phone number (with international code) to the number from the previous step, you'll then receive a call that connects you to the number in the text you sent

Example `keys.*.yml`:
```
ACCEPTED_USER_NUMBERS: '+15025855961'
TWILIO_ACCOUNT_SID: TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN: TWILIO_AUTH_TOKEN
TWILIO_NUMBER: '+12037774647'
```
