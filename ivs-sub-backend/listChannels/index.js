const AWS = require('aws-sdk');

var ivs = new AWS.IVS();
let response;

exports.lambdaHandler = async (event, context) => {
    let params = {};
    if ( event.queryStringParameters && event.queryStringParameters.nextToken) {
        params.nextToken = event.queryStringParameters.nextToken;
    }
    
    try {
        const result = await ivs.listChannels(params).promise();
        const channelArray = result.channels.map((channel) => {
            const filteredChannel = {};
            filteredChannel.name = channel.name;
            filteredChannel.id = channel.arn.split('channel/')[1];
            filteredChannel.authorized = channel.authorized; 
            return filteredChannel;
        });
        response = {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin':'*',
            },
            'body': JSON.stringify(channelArray, null, 2),
        }
    } catch (err) {
        console.log(err);
        response = {
            'statusCode': 503,
            'headers': {
                'Access-Control-Allow-Origin':'*',
            },
            'body': JSON.stringify(err, null, 2),
        }
    }

    return response
};
