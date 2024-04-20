import {DynamoDB} from 'aws-sdk';
import {BaseItem} from './BaseItem'
import {putItem, getItem, updateItem, deleteItem, transactWrite} from './Client';
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
    toPutTransactionItem(): Record<string,unknown>[]{
        return [            
            {
                PK: `CATEGORYTITLE#${this.title}`,
                SK: `CATEGORYTITLE#${this.title}`
            },
            this.toItem()
        ]
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
        await transactWrite(process.env.TABLE_NAME!, category.toPutTransactionItem());
        return category;
    }
    catch(err){
        console.log(err)
        throw err;
    }
}

export const updateCategory = async (category: Category): Promise<Category> => {
    try{
        await transactWrite(process.env.TABLE_NAME!, category.toPutTransactionItem());
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



export const deleteCategory = async(id: string): Promise<string|undefined> =>{
    try{
        console.log(`Deleting category with id: ${id}`);
        let response = await deleteItem(process.env.TABLE_NAME!, `CATEGORY#${id}`, `CATEGORY#${id}`);
        console.log(`Response: ${JSON.stringify(response)}`);
        return response.$metadata.httpStatusCode?.toString();
    }
    catch(err){
        console.log(err)
        throw err;
    }
}
