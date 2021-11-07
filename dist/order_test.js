"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const account_1 = require("./account");
const order_1 = require("./order");
function testOrderSignature() {
    // https://github.com/Fluidex/rollup-state-manager/blob/e176ecada9080917e5b3a114cc1e6f373400c11c/src/account.rs#L501
    let acc = account_1.Account.fromMnemonic('olympic comfort palm large heavy verb acid lion attract vast dash memory olympic syrup announce sure body cruise flip merge fabric frame question result', 1);
    console.log('bjj key', acc.bjjPubKey);
    console_1.assert(acc.bjjPubKey == '0x5d182c51bcfe99583d7075a7a0c10d96bef82b8a059c4bf8c5f6e7124cf2bba3');
    let order = new order_1.OrderInput({
        accountID: 1n,
        orderId: 1n,
        side: order_1.OrderSide.Buy,
        tokenBuy: 1n,
        tokenSell: 2n,
        totalBuy: 999n,
        totalSell: 888n,
    });
    console.log('hash', order.hash().toString());
    console_1.assert(order.hash().toString() == '8056692562185768785417295010793063162660984530596417435073781442183268221458');
    let sig = acc.signHashPacked(order.hash());
    console.log('sig', sig);
    console_1.assert(sig ==
        '57e6cf2e5b8db0a90072d15bc49e737df2e10746e5f531a24d72557894f2c90964d77726505232a4c9e7631eed22ad9210dce2858642fdfe3e58e95d44b99002');
    console.log('sig len', sig.length);
}
testOrderSignature();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JkZXJfdGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9vcmRlcl90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQWlDO0FBQ2pDLHVDQUFvQztBQUNwQyxtQ0FBZ0Q7QUFHaEQsU0FBUyxrQkFBa0I7SUFDekIsb0hBQW9IO0lBQ3BILElBQUksR0FBRyxHQUFHLGlCQUFPLENBQUMsWUFBWSxDQUM1QiwwSkFBMEosRUFDMUosQ0FBQyxDQUNGLENBQUM7SUFDRixPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDdEMsZ0JBQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxJQUFJLG9FQUFvRSxDQUFDLENBQUM7SUFDOUYsSUFBSSxLQUFLLEdBQUcsSUFBSSxrQkFBVSxDQUFDO1FBQ3pCLFNBQVMsRUFBRSxFQUFFO1FBQ2IsT0FBTyxFQUFFLEVBQUU7UUFDWCxJQUFJLEVBQUUsaUJBQVMsQ0FBQyxHQUFHO1FBQ25CLFFBQVEsRUFBRSxFQUFFO1FBQ1osU0FBUyxFQUFFLEVBQUU7UUFDYixRQUFRLEVBQUUsSUFBSTtRQUNkLFNBQVMsRUFBRSxJQUFJO0tBQ2hCLENBQUMsQ0FBQztJQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0lBQzdDLGdCQUFNLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRSxJQUFJLDhFQUE4RSxDQUFDLENBQUM7SUFDbEgsSUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUMzQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztJQUN4QixnQkFBTSxDQUNKLEdBQUc7UUFDRCxrSUFBa0ksQ0FDckksQ0FBQztJQUNGLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNyQyxDQUFDO0FBQ0Qsa0JBQWtCLEVBQUUsQ0FBQyJ9