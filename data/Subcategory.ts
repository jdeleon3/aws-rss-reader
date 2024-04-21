
import {BaseItem} from './BaseItem'
import {getItem, queryItems, TransactWriteInfo, TransactType,AvailableConditionExpressions, transactWrite} from './Client';
import {getValue} from './Utils';
import { ulid } from 'ulid';
import {Category} from './Category';


export class Subcategory extends Category{
    ParentCategoryId: string
    constructor(title: string, description: string, parentCategoryId: string, id:string = ulid()){
        super(title, description)
        this.ParentCategoryId = parentCategoryId
    }   
    override get PK(): string {
        return Subcategory.formatIdToPK(this.ParentCategoryId);
    }
    override get SK(): string {        
        return Subcategory.formatIdToSK(this.id);
    }
    public override TitleKeys(){
        return {
            PK: `SUBCATEGORYTITLE#${this.title}`,
            SK: `SUBCATEGORYTITLE#${this.title}`
        }
    }

    static formatIdToPK(parentId:string){
        return `SC#${parentId}`;
    }
    static formatIdToSK(id:string){
        return `SUBCATEGORY#${id}`;
    }
    static FromItem(item?:Record<string,any>): Subcategory {
        if(!item) throw new Error('Item is null');
        console.log(JSON.stringify(item));
        return new Subcategory(getValue(item.title), getValue(item.description),getValue(item.id), getValue(item.parentCategoryId));
    }
    

    toItem(): Record<string, unknown> {
        return {
            ...this.Keys(),
            title: this.title,
            description: this.description,
            id: this.id,
            parentCategoryId: this.ParentCategoryId
        }
    }
}

export const getSubcategory = async(id: string, parentId: string): Promise<Subcategory> =>{
    try{
        console.log(`Getting subcategory with id: ${id}, parent Category id: ${parentId}`);
        let response = await getItem(process.env.TABLE_NAME!, Subcategory.formatIdToPK(parentId), Subcategory.formatIdToSK(id));
        console.log(`Response: ${JSON.stringify(response)}`);
        return Subcategory.FromItem(response.Item) as Subcategory;
    }
    catch(err){
        console.log(err)
        throw err;
    }
}
export const updateSubcategory = async (category: Subcategory): Promise<Subcategory> => {
    try{
        let infos = [];
        let current = await getSubcategory(category.id, category.ParentCategoryId);
        console.log(`Current: ${JSON.stringify(current)}`);
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

export const getAllSubcategories = async(parentId: string): Promise<Subcategory[]> =>{
    try{
        console.log(`Getting all subcategories with parent id: ${parentId}`);
        let response = await queryItems(process.env.TABLE_NAME!,undefined,"PK = :val",{':val': Subcategory.formatIdToPK(parentId)})
        console.log(`Response: ${JSON.stringify(response)}`);
        return response.Items?.map(Subcategory.FromItem) || [];
    }
    catch(err){
        console.log(err)
        throw err;
    }
}