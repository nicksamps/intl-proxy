'use strict';

module.exports.hello = async (event) => {
  let requestBody = event.body;
  let firstSlice = requestBody.substring(requestBody.indexOf('Body=') + 5);
  let number = firstSlice.substring(0, firstSlice.indexOf('&'));

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
