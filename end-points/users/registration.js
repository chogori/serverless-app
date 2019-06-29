
const AWS = require('aws-sdk');
const errorResponse = require('../../responses/errors-responses/template');
const response = require('../../responses/success-responses/template');
const bcrypt = require('bcrypt-nodejs');
const {
  isEmpty
} = require('ramda');
const {
  emailRexExp,
  userTable
} = require('../../config');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

/**
 * @api {POST} /user create
 * @apiName create
 * @apiVersion 0.0.1
 * @apiGroup user
 * @apiDescription This api add new user by admin
 * @apiHeader {String} accessToken Users unique JWT token.
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
 *}
 */

 const configureUserData = (email, password) => ({
  Item: {
    email,
    password: password,
  },
  TableName: userTable,
});

const configureEmailData = (email) => ({
  TableName: userTable,
  Key: {
    email,
  },
});

module.exports.registration = async (event) => {
  const {
    email,
    password
  } = JSON.parse(event.body);

  const isInputDataValid = !email || !password || !emailRexExp.test(email);

  if (isInputDataValid) {
    return errorResponse(400, 'Input email and password for registration');
  };

  const emailSearchParams = configureEmailData(email);

  const isUserExists = await dynamoDb.get(emailSearchParams)
  .promise()
  .catch(error => {
    errorResponse(error.statusCode, error.message);
  });

  if (!isEmpty(isUserExists)) {
    return errorResponse(403, 'User with this email already exists')
  };

  const salt = bcrypt.genSaltSync(10);
  const passwordHashed = bcrypt.hashSync(password, salt);
  const params = configureUserData(email, passwordHashed);
  console.log(passwordHashed)

  await dynamoDb.put(params)
    .promise()
    .catch(error => {
        return errorResponse(error.statusCode, error.message);
    })
    return response({ success: true })
};
