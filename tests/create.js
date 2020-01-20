import * as uuid from 'uuid';
import AWS from 'aws-sdk';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export function main(event, context, callback) {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.tableName,
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: uuid.v1(), // unique uuid
      content: data.content, // parsed from request body
      attachment: data.attachment, // parsed from request body
      createdAt: Data.now(), // current Unix timestamp
    },
  };

  dynamoDB.put(params, (err, data) => {
    // Set response headers to enable CORS
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    };

    // Return status code 500 on error
    if (err) {
      const response = {
        statusCode: 500,
        headers: headers,
        body: JSON.stringify({ status: false }),
      };
      callback(null, response);
      return;
    }

    // Return status code 200 and the newly created item
    const response = {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
}
