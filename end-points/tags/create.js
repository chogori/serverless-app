const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const errorResponse = require('../../responses/errors-responses/template');
const response = require('../../responses/success-responses/template');
const {
  jwtSecret,
  tagTable,
} = require('../../config');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

/**
 * @api {POST} /tag create
 * @apiName create
 * @apiVersion 0.0.1
 * @apiGroup tag
 * @apiDescription This api save tag in base
 * @apiParam {String} newTag
 * new tag
 * @apiParamExample Request example
 * {
 *  "newTag": "tag_IphoneX",
 * }
 * @apiSuccessExample {json} Success-Response:
 *{
 *  "success": true,
 *  "result": {
 *     "tag": "helloBitch",
 *     "type": "tag"
 *  }
 *}
 */

module.exports.create = async (event) => {
  const {
    body,
    headers: {
      accesstoken,
    },
  } = event;

  if (!accesstoken) {
    return errorResponse(403, 'Permission denied');
  }

  const token = accesstoken.split(' ')[1];

  try {
    jwt.verify(token, jwtSecret);
  } catch (error) {
    return errorResponse(403, 'Permission denied');
  }

  const {
    newTag,
  } = JSON.parse(body);

  if (!newTag) {
    return errorResponse(400, 'Input tag for save');
  }

  const splitTag = newTag.split('_');

  const Item = {
    tag: splitTag[1],
    type: splitTag[0],
  };

  const params = {
    TableName: tagTable,
    Item,
    Exists: false,
  };

  const result = await dynamoDb.put(params)
    .promise()
    .catch(error => {
      return errorResponse(error.statusCode, error.message);
    });

  return response({
    success: true,
    result: params.Item,
  });
};