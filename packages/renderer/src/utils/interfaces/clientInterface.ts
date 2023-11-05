import { type Ref } from 'vue';
import { type SupportedLanguages } from '@shared/utils/enums/supportedLanguagesEnum';

export interface IClient {
    uuid: string;
    name: string;
    isConnected: Ref<boolean>;
    content: Ref<string>; //TODO: I don't know if the content should be saved in a variable.
    roomId: string;

    setInfo(clientName: string): void;
    joinRoom(roomId: string): Promise<void>;
    sendCode(channelData: string): void;
    executeCode(lang: SupportedLanguages): void;
    destroy(): void;
}
