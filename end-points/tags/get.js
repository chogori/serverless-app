const errorResponse = require('../../responses/errors-responses/template');
const response = require('../../responses/success-responses/template');
const AWS = require('aws-sdk');
const {
  tagTable,
} = require('../../config');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

configureFilterParams = (tagsFromRequest, limit, last) => ({
  TableName: tagTable,
  FilterExpression: 'contains (tag, :tag)',
  ExpressionAttributeValues: {
    ':tag': tagsFromRequest,
  },
  Limit: limit,
  ...last ? {
    ExclusiveStartKey: {
      tag: last,
    }
  } : {}
});

/**
 * @api {GET} /tag/find?tags=:tagsNames&limit=:limit&last=:last get
 * @apiName get
 * @apiVersion 0.0.1
 * @apiGroup tag
 * @apiDescription This api returns list of tags by string
 * @apiParam {String} :tagsNames name of tag.
 * @apiParam {String} :limit numbers of rows from base
 * @apiParam {String} :last value of LastEvaluatedKey for pagination as offset
 * @apiParamExample Request example
 * http://your_api_url/tag/find?tags=pho&limit=2&last=helloMyDarling
 * @apiSuccessExample {json} Success-Response:
 *{
 *   "Items": [
 *       {
 *           "type": "tag",
 *           "tag": "IphoneX"
 *       },
 *       {
 *           "type": "tag",
 *           "tag": "iphoneX"
 *       },
 *       {
 *           "type": "tag",
 *           "tag": "iphone7"
 *       }
 *   ],
 *   "Count": 3,
 *   "ScannedCount": 5
 *}
 */

module.exports.get = async (event) => {
  const {
    queryStringParameters: {
      tags,
      limit,
      last,
    }
  } = event;

  if (!tags) {
    return errorResponse(400, 'Input tags for search');
  }

  const tagsFromRequest = tags;

  const params = configureFilterParams(tagsFromRequest, limit, last)

  const data = await dynamoDb.scan(params)
    .promise()
    .catch(error => {
      return errorResponse(error.statusCode, error.message);
    });

  return response({
    data
  });
};