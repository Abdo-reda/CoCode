import { Ref } from "vue";

export interface IClientInfo {
    name: string;
    uuid: string;
}

export interface IHost {
    name: string;
    roomId: string;
    isHosting: boolean;
    clientList: Ref<Map<string, IClientInfo>>; //The only reason that this is a ref, is because I want to make the clients have the ability to change their name later on.
    clientsContent: Ref<Map<string, string>>; 

    hostRoom(): Promise<string>;
    destroy(): void;
}
