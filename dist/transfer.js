"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferTx = void 0;
const hash_1 = require("./hash");
class TransferTx {
    constructor(data = {}) {
        this.token_id = 0n;
        this.amount = 0n;
        this.from = 0n;
        this.from_nonce = 0n;
        this.to = 0n;
        this.sig = null;
        Object.assign(this, data);
    }
    hash() {
        const magicHead = 2n; // TxType.Transfer
        let data = hash_1.hash([magicHead, this.token_id, this.amount, this.from, this.from_nonce, this.to]);
        return data;
    }
    signWith(account) {
        this.sig = account.signHash(this.hash());
    }
}
exports.TransferTx = TransferTx;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdHJhbnNmZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsaUNBQThCO0FBRTlCLE1BQWEsVUFBVTtJQU9yQixZQUFZLE9BQTRCLEVBQUU7UUFOMUMsYUFBUSxHQUFXLEVBQUUsQ0FBQztRQUN0QixXQUFNLEdBQVcsRUFBRSxDQUFDO1FBQ3BCLFNBQUksR0FBVyxFQUFFLENBQUM7UUFDbEIsZUFBVSxHQUFXLEVBQUUsQ0FBQztRQUN4QixPQUFFLEdBQVcsRUFBRSxDQUFDO1FBQ2hCLFFBQUcsR0FBZ0IsSUFBSSxDQUFDO1FBRXRCLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFDRCxJQUFJO1FBQ0YsTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDLENBQUMsa0JBQWtCO1FBQ3hDLElBQUksSUFBSSxHQUFHLFdBQUksQ0FBQyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzlGLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNELFFBQVEsQ0FBQyxPQUFnQjtRQUN2QixJQUFJLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDM0MsQ0FBQztDQUNGO0FBbEJELGdDQWtCQyJ9