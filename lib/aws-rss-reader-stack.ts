import * as cdk from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AwsRssReaderStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const awsRssRegisterFunction = new NodejsFunction(this, 'AwsRssRegisterFunction', {
      entry: 'lambda/AwsRssRegisterUrl.ts',
      handler: 'main',
      runtime: cdk.aws_lambda.Runtime.NODEJS_20_X,
    });

    // example resource
    // const queue = new sqs.Queue(this, 'AwsRssReaderQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
