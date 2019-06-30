### My serverless app

My application based on [Serverless framework](https://serverless.com/)

Simple application - tag storage based on AWS Lambda, AWS DynamoDB and AWS API GateWay

#### Install Serverless
```
npm install -g serverless
```
The Serverless Framework needs access to your cloud provider's
account so that it can create and manage resources on your behalf.
Generate keys in console in provider's account and add it to serverless
##### Example in AWS
```
serverless config credentials --provider aws --key AKIAIOSFODNN7EXAMPLE --secret wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```
#### Application install
Clone the repo of application, make sure that cloned files have
a 'serverless.yml' file, and use this command for deployment:
```
sls deploy
```
And now your application in AWS and already work!


