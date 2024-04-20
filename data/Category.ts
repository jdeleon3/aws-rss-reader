import {BaseItem} from './BaseItem'
import {getItem, transactWrite, TransactWriteInfo,TransactType,AvailableConditionExpressions} from './Client';
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
    protected static formatIdToPK(id:string){
        return `CATEGORY#${id}`;
    }
    protected static formatIdToSK(id:string){
        return `CATEGORY#${id}`;
    }
    

    get PK(): string {
        return Category.formatIdToPK(this.id);
    }
    get SK(): string {
        return Category.formatIdToSK(this.id);
    }
    public TitleKeys(){
        return {
            PK: `CATEGORYTITLE#${this.title}`,
            SK: `CATEGORYTITLE#${this.title}`
        }
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


export const createCategory = async (category: Category): Promise<Category> => {
    try{
        let infos = []
        infos.push(new TransactWriteInfo(category.TitleKeys(), TransactType.PUT,AvailableConditionExpressions.itemDoesNotExistCondition));
        infos.push(new TransactWriteInfo(category.toItem(), TransactType.PUT,AvailableConditionExpressions.itemDoesNotExistCondition));
        await transactWrite(process.env.TABLE_NAME!, infos);
        return category;
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
            infos.push(new TransactWriteInfo(current.TitleKeys(), TransactType.DELETE, AvailableConditionExpressions.itemExistsCondition));
            infos.push(new TransactWriteInfo(category.TitleKeys(), TransactType.PUT, AvailableConditionExpressions.itemDoesNotExistCondition));
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
        infos.push(new TransactWriteInfo(category.TitleKeys(), TransactType.DELETE, AvailableConditionExpressions.itemExistsCondition));
        infos.push(new TransactWriteInfo(category.Keys(), TransactType.DELETE, AvailableConditionExpressions.itemExistsCondition));
        let response = await transactWrite(process.env.TABLE_NAME!, infos);
        console.log(`Response: ${JSON.stringify(response)}`);
        return response.$metadata.httpStatusCode?.toString();
    }
    catch(err){
        console.log(err)
        throw err;
    }
}
