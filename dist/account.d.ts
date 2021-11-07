declare function get_CREATE_L2_ACCOUNT_MSG(chainID: number): string;
declare function recoverPublicKeyFromSignature(message: string, signature: string): string;
declare class L2Account {
    private rollupPrvKey;
    ax: bigint;
    ay: bigint;
    sign: bigint;
    bjjPubKey: string;
    constructor(seed: any);
    signHashPacked(h: bigint): string;
    signHash(h: bigint): TxSignature;
}
declare function randomMnemonic(): string;
declare class TxSignature {
    hash: bigint;
    S: bigint;
    R8x: bigint;
    R8y: bigint;
}
declare class Account {
    publicKey: string;
    ethAddr: string;
    l2Account: L2Account;
    static fromMnemonic(mnemonic: any, chainId?: number): Account;
    static fromPrivkey(privKey: any, chainId?: number): Account;
    static fromSignature(signature: any, chainId?: number): Account;
    static random(): Account;
    signHash(h: bigint): TxSignature;
    signHashPacked(h: bigint): string;
    get ay(): bigint;
    get ax(): bigint;
    get sign(): bigint;
    get bjjPubKey(): string;
}
export { L2Account, Account, get_CREATE_L2_ACCOUNT_MSG, recoverPublicKeyFromSignature, randomMnemonic, TxSignature };
