import { Ref } from "vue";

export interface IClient {
    uuid: string;
    name: string;
    isConnected: Ref<boolean>;
    content: Ref<string>; //TODO: I don't know if the content should be saved in a variable.
    roomId: string;

    setInfo(clientName: string): void;
    joinRoom(roomId: string): Promise<void>;
    sendCode(content: string): void;
    destroy(): void;
}