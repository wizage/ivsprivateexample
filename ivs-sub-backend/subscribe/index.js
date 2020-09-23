const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
let response;

exports.lambdaHandler = async (event, context) => {
    
    // CHECK PAYMENTS OR VALIDATE PAYMENT BEFORE SUBSCRIBE
    if ( event.queryStringParameters 
        && event.queryStringParameters.userId 
        && event.queryStringParameters.channelId ) {
        const {userId, channelId} = event.queryStringParameters;
        var params = {
            TableName: process.env.DYNAMODB_TABLE,
            Item: {
                user_id: userId,
                channel_id: channelId,
                subscribed: true,
            }
        };
        
        try {
            const result = await docClient.put(params).promise();
            response = {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin':'*',
                },
                'body': JSON.stringify(result, null, 2),
            }
        } catch (err) {
            response = {
                'statusCode': 503,
                'headers': {
                    'Access-Control-Allow-Origin':'*',
                },
                'body': JSON.stringify(err, null, 2),
            }
        }
    } else {
        response = {
            'statusCode': 404,
            'headers': {
                'Access-Control-Allow-Origin':'*',
            },
            'body': JSON.stringify({
                message: 'userId/channelId not provided',
            })
        }
    }


    return response
};
