'use strict';

let qs = require('querystring');
var number;

module.exports.hello = async (event) => {
  let post = qs.parse(event.body);
  if (post.Body === 'log') {
    console.log('presaved: ' + number);
  } else {
    number = post.Body;
    console.log('saved: ' + number);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }, null, 2),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
