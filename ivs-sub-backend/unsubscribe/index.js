const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
let response;

exports.lambdaHandler = async (event, context) => {
    if (event.httpMethod === 'OPTIONS') {
        const optionsResponse = {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin':'*',
                'Access-Control-Allow-Methods':'OPTIONS,POST',
                'Access-Control-Allow-Headers':'*',
            },
            'body': JSON.stringify({ statusCode: 200}, null, 2),
        };
        return optionsResponse;
    }

    const parameters = JSON.parse(event.body);
    if ( parameters 
        && parameters.userId 
        && parameters.channelId ) {
        const {userId, channelId} = parameters;
        var params = {
            TableName: process.env.DYNAMODB_TABLE,
            Key: {
                user_id: userId,
                channel_id: channelId,
            },
            UpdateExpression: 'set #sub = :sub',
            ExpressionAttributeNames: {'#sub' : 'subscribed'},
            ExpressionAttributeValues: {
                ':sub': false,
            },
            ReturnValues: 'NONE',
        };
        
        try {
            const result = await docClient.update(params).promise();
            response = {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin':'*',
                },
                'body': JSON.stringify({unsubscribed:true}, null, 2),
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
