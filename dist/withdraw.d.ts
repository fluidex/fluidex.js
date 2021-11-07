import { Account, TxSignature } from './account';
export declare class WithdrawTx {
    account_id: bigint;
    token_id: bigint;
    amount: bigint;
    nonce: bigint;
    old_balance: bigint;
    sig: TxSignature;
    constructor(data?: Partial<WithdrawTx>);
    hash(): bigint;
    signWith(account: Account): void;
}
