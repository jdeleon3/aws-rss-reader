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
        expect(JSON.stringify(item.PK)).toBe('"CATEGORY#Test Category"')
})

it('Category Should generate Sort Key', async() =>{
    //Arrange
    let category: Category = new Category('Test Category','Test Description');

    //Act
    let item = category.ToItem()
    console.log(item)
    

    //Assert
        expect(JSON.stringify(item.SK)).toBe('"CATEGORY#Test Category"')
})

it('Subcategory Should generate Primary Key', async() =>{
    //Arrange
    let category: Subcategory = new Subcategory('Jest Test','Test Description', 'Test Category');

    //Act
    let item = category.ToItem()
    console.log(item)
    

    //Assert
        expect(JSON.stringify(item.PK)).toBe('"SC#Test Category"')
})

it('Subcategory Should generate Sort Key', async() =>{
    //Arrange
    let category: Subcategory = new Subcategory('Jest Test','Test Description', 'Test Category');

    //Act
    let item = category.ToItem()
    console.log(item)
    

    //Assert
        expect(JSON.stringify(item.SK)).toBe('"SUBCATEGORY#Jest Test"')
})