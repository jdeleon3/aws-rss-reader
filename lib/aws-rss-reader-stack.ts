import {HttpApi, HttpMethod, CorsHttpMethod, HttpRoute} from 'aws-cdk-lib/aws-apigatewayv2';
import  {HttpLambdaIntegration} from 'aws-cdk-lib/aws-apigatewayv2-integrations'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import {Runtime} from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import {Stack, StackProps} from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import {PolicyStatement} from 'aws-cdk-lib/aws-iam';
import { create } from 'domain';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AwsRssReaderStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Define The Stack
    const table = new dynamodb.Table(this, 'aws-rss-reader', {
      partitionKey: {name: 'PK', type: dynamodb.AttributeType.STRING}
      ,sortKey: {name: 'SK', type: dynamodb.AttributeType.STRING}
      ,tableName: 'aws-rss-reader-table'
      ,billingMode: dynamodb.BillingMode.PAY_PER_REQUEST
      ,stream: dynamodb.StreamViewType.NEW_IMAGE
    });

    table.addGlobalSecondaryIndex({
      indexName: 'GSI1',
      partitionKey: {name: 'GSI1PK', type: dynamodb.AttributeType.STRING},
      sortKey: {name: 'GSI1SK', type: dynamodb.AttributeType.STRING}
    });

    const awsRssRegisterFunction = new NodejsFunction(this, 'AwsRssRegisterFunction', {
      entry: 'handlers/AwsRssRegisterUrl.ts',
      handler: 'main',
      runtime: Runtime.NODEJS_20_X
    });

    //Category functions
    const createCategoryFunction = new NodejsFunction(this, 'createCategoryFunction', {
      entry: 'handlers/CreateCategory.ts',
      handler: 'main',
      runtime: Runtime.NODEJS_20_X
    });
    
    const getCategoryFunction = new NodejsFunction(this, 'getCategoryFunction', {
      entry: 'handlers/GetCategory.ts',
      handler: 'main',
      runtime: Runtime.NODEJS_20_X
    });

    awsRssRegisterFunction.addEnvironment('TABLE_NAME', table.tableName);
    createCategoryFunction.addEnvironment('TABLE_NAME', table.tableName);

    const awsRssAPI = new HttpApi(this,'AwsRssAPI');
    awsRssAPI.addRoutes({
      path: '/register',
      methods: [HttpMethod.POST],
      integration: new HttpLambdaIntegration('AwsRssRegisterUrlIntegration', awsRssRegisterFunction)
    });

    awsRssAPI.addRoutes({
      path: '/createCategory',
      methods: [HttpMethod.POST],
      integration: new HttpLambdaIntegration('CreateCategoryIntegration', createCategoryFunction)
    });

    awsRssAPI.addRoutes({
      path: '/getCategory/{id}',
      methods: [HttpMethod.GET],
      integration: new HttpLambdaIntegration('GetCategoryIntegration', getCategoryFunction),
    });

    // Define and add permissions to the Stack Objects
    const lambdaPolicy = new PolicyStatement({
      resources: [table.tableArn],
      actions: ['dynamodb:PutItem'
                ,'dynamodb:GetItem'
                ,'dynamodb:BatchGetItem'
                ,'dynamodb:ConditionCheckItem'
                ,'dynamodb:Query'
                ,'dynamodb:UpdateItem'
                ,'dynamodb:DeleteItem']
    });
    createCategoryFunction.addToRolePolicy(lambdaPolicy);
    getCategoryFunction.addToRolePolicy(lambdaPolicy);
    // example resource
    // const queue = new sqs.Queue(this, 'AwsRssReaderQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
