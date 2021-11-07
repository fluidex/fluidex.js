"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawTx = void 0;
const hash_1 = require("./hash");
class WithdrawTx {
    constructor(data = {}) {
        this.account_id = 0n;
        this.token_id = 0n;
        this.amount = 0n;
        this.nonce = 0n;
        this.old_balance = 0n;
        this.sig = null;
        Object.assign(this, data);
    }
    hash() {
        const magicHead = 3n; // TxType.Withdraw
        return hash_1.hash([magicHead, this.account_id, this.token_id, this.amount, this.nonce, this.old_balance]);
    }
    signWith(account) {
        this.sig = account.signHash(this.hash());
    }
}
exports.WithdrawTx = WithdrawTx;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l0aGRyYXcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvd2l0aGRyYXcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsaUNBQThCO0FBRTlCLE1BQWEsVUFBVTtJQU9yQixZQUFZLE9BQTRCLEVBQUU7UUFOMUMsZUFBVSxHQUFXLEVBQUUsQ0FBQztRQUN4QixhQUFRLEdBQVcsRUFBRSxDQUFDO1FBQ3RCLFdBQU0sR0FBVyxFQUFFLENBQUM7UUFDcEIsVUFBSyxHQUFXLEVBQUUsQ0FBQztRQUNuQixnQkFBVyxHQUFXLEVBQUUsQ0FBQztRQUN6QixRQUFHLEdBQWdCLElBQUksQ0FBQztRQUV0QixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBQ0QsSUFBSTtRQUNGLE1BQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQjtRQUN4QyxPQUFPLFdBQUksQ0FBQyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0lBQ3RHLENBQUM7SUFDRCxRQUFRLENBQUMsT0FBZ0I7UUFDdkIsSUFBSSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQzNDLENBQUM7Q0FDRjtBQWpCRCxnQ0FpQkMifQ==