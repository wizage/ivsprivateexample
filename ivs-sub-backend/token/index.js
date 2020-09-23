// Need to install this using npm install jsonwebtoken
var jwt = require('jsonwebtoken');
const aws = require('aws-sdk');
const docClient = new aws.DynamoDB.DocumentClient();
const ivs = new aws.IVS();
var globalPem;

exports.lambdaHandler = async (event) => {
    if ( !event.queryStringParameters
        && !event.queryStringParameters.userId 
        && !event.queryStringParameters.channelId ) {
        const error = {
            statusCode: 403,
            body: 'Not Authorized',
            headers: {
                'Access-Control-Allow-Origin':'*',
            },
        };
        return error;
  }
  const userSubscription = await checkUser(event);
  if (!userSubscription) {
    const error = {
      statusCode: 403,
      body: 'Not Authorized',
      headers: {
        'Access-Control-Allow-Origin':'*',
      },
    };
    return error;
  }
  if (globalPem === undefined) { 
      //await getPemKey(process.env.SECRET_ARN);
  }
  const channelARN = `arn:aws:ivs:${process.env.REGION}:${process.env.ACCOUNTID}:channel/${event.queryStringParameters.channelId}`;
  var params = {
      arn: channelARN,
  }
  var payload = {
    "aws:channel-arn": channelARN,
    "aws:access-control-allow-origin": "*"
  };  
  //var token = jwt.sign(payload, globalPem, { algorithm: 'ES384', expiresIn: '2 days' });
  var token = "test";
  var channelInfo = await ivs.getChannel(params).promise();
  var tokenObj = {
    token,
    url: channelInfo.playbackURL,
  };
  const response = {
    statusCode: 200,
    body: JSON.stringify(tokenObj),
    headers: {
      'Access-Control-Allow-Origin':'*',
    },
  };
  return response;
};

async function getPemKey(pemId) {
  const secretsManager = new aws.SecretsManager({ apiVersion: '2017-10-17' });
  const secret = await secretsManager.getSecretValue({ SecretId: pemId }).promise();
  globalPem = secret.SecretBinary;
}


async function checkUser(userId, channelId) {
  // Get usersub from cognito
  const params = {
    TableName:process.env.DYNAMODB_TABLE,
    Key: {
        user_id: userId,
        channel_id: channelId,
    },
  };
  try {
    const result = docClient.get(params).promise();
    return result.subscribed;
  } catch (e) {
      return false;
  }
}