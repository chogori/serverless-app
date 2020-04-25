const errorResponse = require('../../responses/errors-responses/template');
const response = require('../../responses/success-responses/template');
const jwt = require('jsonwebtoken');
const {
  jwtSecret,
  tagTable,
} = require('../../config');

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();


/**
 * @api {DELETE} /tag/:identifier delete
 * @apiName delete
 * @apiVersion 0.0.1
 * @apiGroup tag
 * @apiDescription This api delete tag
 * @apiParam {String} identifier of entity (primary key)
 * @apiSuccessExample {json} Success-Response:
 *{
 *  "success": true
 *}
 */

exports.delete = async (event) => {
  const {
    headers: {
      accesstoken
    },
    pathParameters: {
      identifier,
    }
  } = event

  if (!accesstoken) {
    return errorResponse(403, 'Permission denied');
  }

  const token = accesstoken.split(' ')[1];
  try {
    jwt.verify(token, jwtSecret)
  } catch (error) {
    return errorResponse(403, 'Permission denied');
  };

  if (!identifier) {
    return errorResponse(400, 'Input name of tag for deleting');
  }

  const params = {
    TableName: tagTable,
    Key: {
      tag: identifier,
    },
  };

  await dynamoDb.delete(params)
    .promise()
    .catch(error => {
      return errorResponse(error.statusCode, error.message);
    });

  return response({
    success: true
  });
};