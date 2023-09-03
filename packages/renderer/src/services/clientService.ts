import { v4 as uuidv4 } from 'uuid';

export interface IClient {
    name: string;
    uuid: string;
    content: string;
}

export function newClient(name: string): IClient 
{
    return {
        name: name,
        uuid: uuidv4(),
        content: "console.log('hello client :)')",
    };
}