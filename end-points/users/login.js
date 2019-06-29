const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const errorResponse = require('../../responses/errors-responses/template');
const response = require('../../responses/success-responses/template');
const bcrypt = require('bcrypt-nodejs');
const {
  isEmpty
} = require('ramda')
const {
  userTable,
  jwtSecret,
  jwtExpiresIn,
} = require('../../config');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const configureEmailData = (email) => ({
  TableName: userTable,
  Key: {
    email,
  },
});

/**
 * @api {POST} /user/auth authenticate
 * @apiName auth
 * @apiVersion 0.0.1
 * @apiGroup user
 * @apiDescription This api for authentication
 * @apiParam {String} email
 * email of new user
 * @apiParam {String} password
 * password of new user
 * @apiParamExample Request example
 * {
 *  "email": "user",
 *  "password":"12345"
 * }
 * @apiSuccessExample {json} Success-Response:
 *{
 *  "success": true,
 *  "token": "JWT token"
 *}
 */

module.exports.login = async (event) => {
  const {
    email,
    password,
  } = JSON.parse(event.body);

  if (!email || !password) {
    return errorResponse(400, 'Input email and password for authentication');
  };

  const params = configureEmailData(email)

  const result = await dynamoDb.get(params)
  .promise()
  .catch(error => {
      return errorResponse(error.statusCode, error.message);
  })

  if (isEmpty(result)) {
    return errorResponse(403, 'Wrong email');
  }

  const isRightPassword = bcrypt.compareSync(password, result.Item.password);

  if (!isRightPassword) {
    return errorResponse(403, 'Wrong password');
  }

  const token = jwt.sign({ email }, jwtSecret, { expiresIn: jwtExpiresIn });

  return response({ success: true, token: `JWT ${token}` });
};
