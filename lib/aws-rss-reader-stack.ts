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

    table.addGlobalSecondaryIndex({
      indexName: 'GSI2',
      partitionKey: {name: 'GSI2PK', type: dynamodb.AttributeType.STRING},
      sortKey: {name: 'GSI2SK', type: dynamodb.AttributeType.STRING},
      projectionType: dynamodb.ProjectionType.ALL
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
    
    const updateSubcategoryFunction = new NodejsFunction(this, 'updateSubcategoryFunction', {
      entry: 'handlers/UpdateSubcategory.ts',
      handler: 'main',
      runtime: Runtime.NODEJS_20_X
    });
    
    const deleteSubcategoryFunction = new NodejsFunction(this, 'deleteSubcategoryFunction', {
      entry: 'handlers/DeleteSubcategory.ts',
      handler: 'main',
      runtime: Runtime.NODEJS_20_X
    });

    const createFeedFunction = new NodejsFunction(this, 'createFeedFunction', {
      entry: 'handlers/CreateFeed.ts',
      handler: 'main',
      runtime: Runtime.NODEJS_20_X
    });

    const getFeedFunction = new NodejsFunction(this, 'getFeedFunction', {
      entry: 'handlers/GetFeed.ts',
      handler: 'main',
      runtime: Runtime.NODEJS_20_X
    });


    
    createCategoryFunction.addEnvironment('TABLE_NAME', table.tableName);
    getCategoryFunction.addEnvironment('TABLE_NAME', table.tableName);
    updateCategoryFunction.addEnvironment('TABLE_NAME', table.tableName);
    deleteCategoryFunction.addEnvironment('TABLE_NAME', table.tableName);
    getAllCategoriesFunction.addEnvironment('TABLE_NAME', table.tableName);

    createSubcategoryFunction.addEnvironment('TABLE_NAME', table.tableName);
    getSubcategoryFunction.addEnvironment('TABLE_NAME', table.tableName);
    updateSubcategoryFunction.addEnvironment('TABLE_NAME', table.tableName);
    deleteSubcategoryFunction.addEnvironment('TABLE_NAME', table.tableName);
    getAllSubcategoriesFunction.addEnvironment('TABLE_NAME', table.tableName);

    createFeedFunction.addEnvironment('TABLE_NAME', table.tableName);
    getFeedFunction.addEnvironment('TABLE_NAME', table.tableName);

    const awsRssAPI = new HttpApi(this,'AwsRssAPI');
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
      path: '/getAllSubcategories/{parentCategoryId}',
      methods: [HttpMethod.GET],
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

    awsRssAPI.addRoutes({
      path: '/updateSubcategory',
      methods: [HttpMethod.POST],
      integration: new HttpLambdaIntegration('UpdateSubcategoryIntegration', updateSubcategoryFunction),
    });    

    awsRssAPI.addRoutes({
      path: '/deleteSubcategory',
      methods: [HttpMethod.POST],
      integration: new HttpLambdaIntegration('DeleteSubcategoryIntegration', deleteSubcategoryFunction),
    });

    awsRssAPI.addRoutes({
      path: '/createFeed',
      methods: [HttpMethod.POST],
      integration: new HttpLambdaIntegration('CreateFeedIntegration', createFeedFunction)
    });

    awsRssAPI.addRoutes({
      path: '/getFeed/{id}/{subcategoryId}',
      methods: [HttpMethod.GET],
      integration: new HttpLambdaIntegration('GetFeedIntegration', getFeedFunction),
    });

    table.grantReadData(getCategoryFunction);
    table.grantReadData(getAllCategoriesFunction);
    table.grantReadData(getSubcategoryFunction);
    table.grantReadData(getAllSubcategoriesFunction);
    table.grantReadData(getFeedFunction);

    table.grantReadWriteData(createCategoryFunction);
    table.grantReadWriteData(updateCategoryFunction);
    table.grantReadWriteData(deleteCategoryFunction);
    table.grantReadWriteData(createSubcategoryFunction);
    table.grantReadWriteData(updateSubcategoryFunction);
    table.grantReadWriteData(deleteSubcategoryFunction);
    table.grantReadWriteData(createFeedFunction);

    // example resource
    // const queue = new sqs.Queue(this, 'AwsRssReaderQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
