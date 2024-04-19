import {mockClient} from 'aws-sdk-client-mock'
import {DynamoDBDocumentClient, GetCommand, PutCommand} from '@aws-sdk/lib-dynamodb'
import {createCategory, Category, Subcategory} from '../data/Category'
import { ulid } from 'ulid';


const mockDdbClient = mockClient(DynamoDBDocumentClient);
const testId = '01HVT9C42YCSZZ5TNPGJMRVHK7'
beforeEach(() =>{
    mockDdbClient.reset()
    jest.mock('ulid', () => testId);
})

it('Category Should generate Primary Key', async() =>{
    //Arrange
    
    let category: Category = new Category('Test Category','Test Description');
    

    //Act
    let item = category.toItem()
    console.log(item)
    

    //Assert
        //expect(JSON.stringify(item.PK)).toBe(`"CATEGORY#${testId}"`)
})

it('Category Should generate Sort Key', async() =>{
    //Arrange
    
    let category: Category = new Category('Test Category','Test Description');
//01HVT9C42YCSZZ5TNPGJMRVHK7
    //Act
    let item = category.toItem()
    console.log(item)
    

    //Assert
        //expect(JSON.stringify(item.SK)).toBe(`"CATEGORY#${testId}"`)
})

it('Subcategory Should generate Primary Key', async() =>{
    //Arrange
    let category: Subcategory = new Subcategory('Jest Test','Test Description', 'Test Category');

    //Act
    let item = category.toItem()
    console.log(item)
    

    //Assert
        //expect(JSON.stringify(item.PK)).toBe(`"SC#${testId}"`)
})

it('Subcategory Should generate Sort Key', async() =>{
    //Arrange
    let category: Subcategory = new Subcategory('Jest Test','Test Description', 'Test Category');

    //Act
    let item = category.toItem()
    console.log(item)
    

    //Assert
        //expect(JSON.stringify(item.SK)).toBe(`"SUBCATEGORY#${testId}"`)
})