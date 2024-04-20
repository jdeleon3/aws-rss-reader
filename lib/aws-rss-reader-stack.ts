import {HttpApi, HttpMethod, CorsHttpMethod, HttpRoute} from 'aws-cdk-lib/aws-apigatewayv2';
import  {HttpLambdaIntegration} from 'aws-cdk-lib/aws-apigatewayv2-integrations'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import {Runtime} from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import {Stack, StackProps} from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import {PolicyStatement} from 'aws-cdk-lib/aws-iam';
import { create } from 'domain';
import { getAllCategories } from '../data/Category';
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
      sortKey: {name: 'GSI1SK', type: dynamodb.AttributeType.STRING},
      projectionType: dynamodb.ProjectionType.ALL
    });

    const awsRssRegisterFunction = new NodejsFunction(this, 'AwsRssRegisterFunction', {
      entry: 'handlers/AwsRssRegisterUrl.ts',
      handler: 'main',
      runtime: Runtime.NODEJS_20_X
    });

    //Category functions    
    const getAllCategoriesFunction = new NodejsFunction(this, 'getAllCategoriesFunction', {
      entry: 'handlers/GetAllCategories.ts',
      handler: 'main',
      runtime: Runtime.NODEJS_20_X
    });

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
    
    const updateCategoryFunction = new NodejsFunction(this, 'updateCategoryFunction', {
      entry: 'handlers/UpdateCategory.ts',
      handler: 'main',
      runtime: Runtime.NODEJS_20_X
    });
    
    const deleteCategoryFunction = new NodejsFunction(this, 'deleteCategoryFunction', {
      entry: 'handlers/DeleteCategory.ts',
      handler: 'main',
      runtime: Runtime.NODEJS_20_X
    });

    const getAllSubcategoriesFunction = new NodejsFunction(this, 'getAllSubcategoriesFunction', {
      entry: 'handlers/GetAllSubcategories.ts',
      handler: 'main',
      runtime: Runtime.NODEJS_20_X
    });

    const createSubcategoryFunction = new NodejsFunction(this, 'createSubcategoryFunction', {
      entry: 'handlers/CreateSubcategory.ts',
      handler: 'main',
      runtime: Runtime.NODEJS_20_X
    });

    const getSubcategoryFunction = new NodejsFunction(this, 'getSubcategoryFunction', {
      entry: 'handlers/GetSubcategory.ts',
      handler: 'main',
      runtime: Runtime.NODEJS_20_X
    });

    awsRssRegisterFunction.addEnvironment('TABLE_NAME', table.tableName);
    createCategoryFunction.addEnvironment('TABLE_NAME', table.tableName);
    getCategoryFunction.addEnvironment('TABLE_NAME', table.tableName);
    updateCategoryFunction.addEnvironment('TABLE_NAME', table.tableName);
    deleteCategoryFunction.addEnvironment('TABLE_NAME', table.tableName);
    getAllCategoriesFunction.addEnvironment('TABLE_NAME', table.tableName);

    createSubcategoryFunction.addEnvironment('TABLE_NAME', table.tableName);
    getSubcategoryFunction.addEnvironment('TABLE_NAME', table.tableName);
    getAllSubcategoriesFunction.addEnvironment('TABLE_NAME', table.tableName);

    const awsRssAPI = new HttpApi(this,'AwsRssAPI');
    awsRssAPI.addRoutes({
      path: '/register',
      methods: [HttpMethod.POST],
      integration: new HttpLambdaIntegration('AwsRssRegisterUrlIntegration', awsRssRegisterFunction)
    });
    

    awsRssAPI.addRoutes({
      path: '/getAllCategories',
      methods: [HttpMethod.GET],
      integration: new HttpLambdaIntegration('GetAllCategoriesIntegration', getAllCategoriesFunction),
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

    awsRssAPI.addRoutes({
      path: '/updateCategory',
      methods: [HttpMethod.POST],
      integration: new HttpLambdaIntegration('UpdateCategoryIntegration', updateCategoryFunction),
    });    

    awsRssAPI.addRoutes({
      path: '/deleteCategory',
      methods: [HttpMethod.POST],
      integration: new HttpLambdaIntegration('DeleteCategoryIntegration', deleteCategoryFunction),
    });    

    awsRssAPI.addRoutes({
      path: '/getAllSubcategories',
      methods: [HttpMethod.POST],
      integration: new HttpLambdaIntegration('GetAllSubcategoriesIntegration', getAllSubcategoriesFunction)
    });    

    awsRssAPI.addRoutes({
      path: '/createSubcategory',
      methods: [HttpMethod.POST],
      integration: new HttpLambdaIntegration('CreateSubcategoryIntegration', createSubcategoryFunction)
    });    

    awsRssAPI.addRoutes({
      path: '/getSubcategory',
      methods: [HttpMethod.POST],
      integration: new HttpLambdaIntegration('GetSubcategoryIntegration', getSubcategoryFunction)
    });

    table.grantReadData(getCategoryFunction);
    table.grantReadData(getAllCategoriesFunction);
    table.grantReadData(getSubcategoryFunction);
    table.grantReadData(getAllSubcategoriesFunction);

    table.grantReadWriteData(createCategoryFunction);
    table.grantReadWriteData(updateCategoryFunction);
    table.grantReadWriteData(deleteCategoryFunction);
    table.grantReadWriteData(createSubcategoryFunction);

    // example resource
    // const queue = new sqs.Queue(this, 'AwsRssReaderQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
