const errorResponse = require('../../responses/errors-responses/template');
const response = require('../../responses/success-responses/template');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const {
  pathOr,
} = require('ramda')
const {
  tagTable,
} = require('../../config');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

/**
 * @api {GET} /tag list
 * @apiName list
 * @apiVersion 0.0.1
 * @apiGroup tag
 * @apiDescription This api returns all urls from base
 * @apiSuccessExample {json} Success-Response:
 *[
 *  {
 *    "type": "cat",
 *    "tag": "wood"
 *  },
 *  {
 *    "type": "tag",
 *    "tag": "IphoneX"
 *  },
 *  {
 *    "type": "tag",
 *    "tag": "iphoneX"
 *  },
 *  {
 *    "type": "clr",
 *    "tag": "Red"
 *  },
 *  {
 *    "type": "tag",
 *    "tag": "iphone7"
 *  }
 *]
 */

module.exports.list = async (event) => {
  const {
    queryStringParameters:{
      limit : Limit,
      last,
    }
  } = event

  const params = {
    TableName: tagTable,
    Limit,
    ... last
    ? { ExclusiveStartKey: {
          tag: last,
        }
      } 
    : {}
  };

  console.log(params)

  const result = await dynamoDb.scan(params)
    .promise()
    .catch(error => {
      return errorResponse(error.statusCode, error.message);
    });

  return response({ result });
};
