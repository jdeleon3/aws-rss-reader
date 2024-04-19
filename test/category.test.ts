import {mockClient} from 'aws-sdk-client-mock'
import {DynamoDBDocumentClient, GetCommand, PutCommand} from '@aws-sdk/lib-dynamodb'
import {createCategory, Category, Subcategory} from '../data/Category'


const mockDdbClient = mockClient(DynamoDBDocumentClient);

beforeEach(() =>{
    mockDdbClient.reset()
})

it('Category Should generate Primary Key', async() =>{
    //Arrange
    let category: Category = new Category('Test Category','Test Description');

    //Act
    let item = category.ToItem()
    console.log(item)
    

    //Assert
    if(typeof item.PK === 'object'){
        expect(JSON.stringify(item.PK)).toBe('{"S":"CATEGORY#Test Category"}')
    }
    else{
        fail('PK is not an object')
    }
})

it('Category Should generate Sort Key', async() =>{
    //Arrange
    let category: Category = new Category('Test Category','Test Description');

    //Act
    let item = category.ToItem()
    console.log(item)
    

    //Assert
    if(typeof item.SK === 'object'){
        expect(JSON.stringify(item.SK)).toBe('{"S":"CATEGORY#Test Category"}')
    }
    else{
        fail('SK is not an object')
    }
})

it('Subcategory Should generate Primary Key', async() =>{
    //Arrange
    let category: Subcategory = new Subcategory('Jest Test','Test Description', 'Test Category');

    //Act
    let item = category.ToItem()
    console.log(item)
    

    //Assert
    if(typeof item.PK === 'object'){
        expect(JSON.stringify(item.PK)).toBe('{"S":"SC#Test Category"}')
    }
    else{
        fail('PK is not an object')
    }
})

it('Subcategory Should generate Sort Key', async() =>{
    //Arrange
    let category: Subcategory = new Subcategory('Jest Test','Test Description', 'Test Category');

    //Act
    let item = category.ToItem()
    console.log(item)
    

    //Assert
    if(typeof item.SK === 'object'){
        expect(JSON.stringify(item.SK)).toBe('{"S":"SUBCATEGORY#Jest Test"}')
    }
    else{
        fail('SK is not an object')
    }
})