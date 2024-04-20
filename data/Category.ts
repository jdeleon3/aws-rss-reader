import {DynamoDB} from 'aws-sdk';
import {BaseItem} from './BaseItem'
import {putItem, getItem, updateItem, deleteItem, transactWrite, TransactWriteInfo,TransactType,AvailableConditionExpressions} from './Client';
import {getValue} from './Utils';
import { ulid } from 'ulid';

export class Category extends BaseItem{
    
    id: string
    title: string
    description: string

    constructor(title: string, description: string,id: string = ulid()){
        super()
        this.id = id
        this.title = title
        this.description = description
    }

    static FromItem(item?:Record<string,any>): Category {
        if(!item) throw new Error('Item is null');
        console.log(JSON.stringify(item));
        return new Category(getValue(item.title), getValue(item.description),getValue(item.id));
    }

    static getValue(itemValue: string|undefined): string{
        if(!itemValue) return "";
        return itemValue;
    }

    get PK(): string {
        return `CATEGORY#${this.id}`;
    }
    get SK(): string {
        return `CATEGORY#${this.id}`;
    }
    toItem(): Record<string, unknown> {
        return {
            ...this.Keys(),
            title: this.title,
            description: this.description,
            id: this.id
        }
    }
}

export class Subcategory extends Category{
    ParentCategoryId: string
    constructor(title: string, description: string, parentCategoryId: string){
        super(title, description)
        this.ParentCategoryId = parentCategoryId
    }   
    override get PK(): string {
        return `SC#${this.ParentCategoryId}`
    }
    override get SK(): string {        
        return `SUBCATEGORY#${this.id}`
    }
}

export const createCategory = async (category: Category): Promise<Category> => {
    try{
        let infos = []
        infos.push(new TransactWriteInfo(({
            PK: `CATEGORYTITLE#${category.title}`,
            SK: `CATEGORYTITLE#${category.title}`
        }), TransactType.PUT,AvailableConditionExpressions.itemDoesNotExistCondition));
        infos.push(new TransactWriteInfo(category.toItem(), TransactType.PUT,AvailableConditionExpressions.itemDoesNotExistCondition));
        await transactWrite(process.env.TABLE_NAME!, infos);
        return category;
    }
    catch(err){
        console.log(err)
        throw err;
    }
}

export const createSubcategory = async(subcat: Subcategory): Promise<Subcategory> =>{
    try{
        await putItem(process.env.TABLE_NAME!, subcat.toItem());
        return subcat;
    }
    catch(err){
        console.log(err)
        throw err;
    }
}

export const updateSubcategory = async(subcat: Subcategory): Promise<Subcategory> =>{
    try{
        await updateItem(process.env.TABLE_NAME!, subcat.toItem());
        return subcat;
    }
    catch(err){
        console.log(err)
        throw err;
    }
}


export const deleteSubcategory = async(subcat: Subcategory): Promise<string|undefined> =>{
    try{
        let response = await deleteItem(process.env.TABLE_NAME!, subcat.PK, subcat.SK);
        return response.$metadata.httpStatusCode?.toString();
    }
    catch(err){
        console.log(err)
        throw err;
    }
}

export const updateCategory = async (category: Category): Promise<Category> => {
    try{
        let infos = [];
        let current = await getCategory(category.id);
        if(current.title !== category.title){
            infos.push(new TransactWriteInfo(current.toItem(), TransactType.DELETE, AvailableConditionExpressions.itemExistsCondition));
            infos.push(new TransactWriteInfo(({
                PK: `CATEGORYTITLE#${category.title}`,
                SK: `CATEGORYTITLE#${category.title}`
            }), TransactType.PUT, AvailableConditionExpressions.itemDoesNotExistCondition));
        }
        infos.push(new TransactWriteInfo(category.toItem(), TransactType.PUT, AvailableConditionExpressions.itemExistsCondition));
        await transactWrite(process.env.TABLE_NAME!, infos);
        return category;
    }
    catch(err){
        console.log(err)
        throw err;
    }
}

export const getCategory = async(id: string): Promise<Category> =>{
    try{
        console.log(`Getting category with id: ${id}`);
        let response = await getItem(process.env.TABLE_NAME!, `CATEGORY#${id}`, `CATEGORY#${id}`);
        console.log(`Response: ${JSON.stringify(response)}`);
        return Category.FromItem(response.Item);
    }
    catch(err){
        console.log(err)
        throw err;
    }
}



export const deleteCategory = async(category: Category): Promise<string|undefined> =>{
    try{
        
        console.log(`Deleting category: ${JSON.stringify(category)}`);
        let infos = []
        infos.push(new TransactWriteInfo(({
            PK: `CATEGORYTITLE#${category.title}`,
            SK: `CATEGORYTITLE#${category.title}`
        }), TransactType.DELETE, AvailableConditionExpressions.itemExistsCondition));
        infos.push(new TransactWriteInfo(category.toItem(), TransactType.DELETE, AvailableConditionExpressions.itemExistsCondition));
        let response = await transactWrite(process.env.TABLE_NAME!, infos);
        console.log(`Response: ${JSON.stringify(response)}`);
        return response.$metadata.httpStatusCode?.toString();
    }
    catch(err){
        console.log(err)
        throw err;
    }
}
