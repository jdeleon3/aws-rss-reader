import {DynamoDB} from 'aws-sdk'

export abstract class BaseItem {
    abstract get PK(): string
    abstract get SK(): string

    public Keys(){
        return {
            PK: this.PK,
            SK: this.SK
        }
    }

    abstract toItem(): Record<string,unknown>;
}
