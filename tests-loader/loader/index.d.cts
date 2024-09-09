declare function _exports(binary: ArrayBuffer, options?: Options): Promise<handleFunction>;
export = _exports;
export type Tag = {
    name: string;
    value: string;
};
export type Message = {
    Signature?: string;
    Owner: string;
    Target: string;
    Anchor?: string;
    Tags: Tag[];
    Data?: DataItem;
    From: string;
    "Forwarded-By"?: string;
    Epoch?: string;
    Nonce?: string;
    "Block-Height": string;
    Timestamp: string;
    "Hash-Chain"?: string;
    Cron: boolean;
};
export namespace AssignmentTypes {
    type Message = string;
    type Processes = string[];
    type Assignment = {
        Processes: AssignmentTypes.Processes;
        Message: AssignmentTypes.Message;
    };
}
export type Environment = {
    Process: {
        Id: string;
        Owner: string;
        Tags: Tag[];
    };
};
export type HandleResponse = {
    Memory: ArrayBuffer;
    Output: DataItem;
    Messages: Message[];
    Spawns: Message[];
    Assignments: AssignmentTypes.Assignment[];
};
export type handleFunction = (buffer: ArrayBuffer | null, msg: Message, env: Environment) => Promise<HandleResponse>;
export type BinaryFormat = 'wasm32-unknown-emscripten' | 'wasm32-unknown-emscripten2' | 'wasm32-unknown-emscripten3' | 'wasm64-unknown-emscripten-draft_2024_02_15';
export type Options = {
    format?: BinaryFormat;
    computeLimit?: number;
    memoryLimit?: string;
    extensions?: string[];
};
