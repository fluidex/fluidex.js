"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TxSignature = exports.randomMnemonic = exports.recoverPublicKeyFromSignature = exports.get_CREATE_L2_ACCOUNT_MSG = exports.Account = exports.L2Account = void 0;
const eddsa_1 = require("./eddsa");
const circomlib_1 = require("circomlib");
const ffjs_1 = require("./ffjs");
const ethers = require("ethers");
const random_1 = require("@ethersproject/random");
const hdnode_1 = require("@ethersproject/hdnode");
const signing_key_1 = require("@ethersproject/signing-key");
const hash_1 = require("./hash");
function get_CREATE_L2_ACCOUNT_MSG(chainID) {
    return 'FLUIDEX_L2_ACCOUNT' + `\nChain ID: ${chainID}.`;
}
exports.get_CREATE_L2_ACCOUNT_MSG = get_CREATE_L2_ACCOUNT_MSG;
// https://github.com/ethers-io/ethers.js/issues/447#issuecomment-519163178
function recoverPublicKeyFromSignature(message, signature) {
    const msgHash = ethers.utils.hashMessage(message);
    const msgHashBytes = ethers.utils.arrayify(msgHash);
    return ethers.utils.recoverPublicKey(msgHashBytes, signature);
}
exports.recoverPublicKeyFromSignature = recoverPublicKeyFromSignature;
class L2Account {
    constructor(seed) {
        if (seed.length != 32) {
            throw new Error('invalid l2 key seed');
        }
        this.rollupPrvKey = Buffer.from(seed);
        const bjPubKey = eddsa_1.prv2pub(this.rollupPrvKey);
        this.ax = ffjs_1.Scalar.fromString(bjPubKey[0].toString(16), 16);
        this.ay = ffjs_1.Scalar.fromString(bjPubKey[1].toString(16), 16);
        const compressedBuff = circomlib_1.babyJub.packPoint(bjPubKey);
        this.sign = 0n;
        if (compressedBuff[31] & 0x80) {
            this.sign = 1n;
        }
        this.bjjPubKey = '0x' + Buffer.from(compressedBuff).toString('hex');
        //this.bjjCompressed = utils.padZeros(ffutils.leBuff2int(compressedBuff).toString(16), 64);
    }
    signHashPacked(h) {
        const sig = eddsa_1.signWithHasher(this.rollupPrvKey, h, hash_1.hash);
        return eddsa_1.packSignature(sig).toString('hex');
    }
    signHash(h) {
        const sig = eddsa_1.signWithHasher(this.rollupPrvKey, h, hash_1.hash);
        return {
            hash: h,
            S: sig.S,
            R8x: sig.R8[0],
            R8y: sig.R8[1],
        };
    }
}
exports.L2Account = L2Account;
function randomMnemonic() {
    let entropy = random_1.randomBytes(16);
    const mnemonic = hdnode_1.entropyToMnemonic(entropy);
    return mnemonic;
}
exports.randomMnemonic = randomMnemonic;
class TxSignature {
}
exports.TxSignature = TxSignature;
class Account {
    static fromMnemonic(mnemonic, chainId = 1) {
        const privKey = hdnode_1.HDNode.fromMnemonic(mnemonic, null, null).derivePath(hdnode_1.defaultPath).privateKey;
        //console.log('eth priv key', privKey);
        return Account.fromPrivkey(privKey, chainId);
    }
    static fromPrivkey(privKey, chainId = 1) {
        const msgHash = ethers.utils.hashMessage(get_CREATE_L2_ACCOUNT_MSG(chainId));
        const signKey = new signing_key_1.SigningKey(privKey);
        const signature = ethers.utils.joinSignature(signKey.signDigest(msgHash));
        return Account.fromSignature(signature, chainId);
    }
    static fromSignature(signature, chainId = 1) {
        // ethers signature is 65-byte
        let acc = new Account();
        acc.publicKey = recoverPublicKeyFromSignature(get_CREATE_L2_ACCOUNT_MSG(chainId), signature);
        acc.ethAddr = ethers.utils.computeAddress(acc.publicKey);
        // Derive a L2 private key from seed
        const seed = ethers.utils.arrayify(signature).slice(0, 32);
        //console.log('seed', seed)
        acc.l2Account = new L2Account(seed);
        return acc;
    }
    static random() {
        const mnemonic = randomMnemonic();
        return Account.fromMnemonic(mnemonic, 1); // default chainID: 1
    }
    signHash(h) {
        return this.l2Account.signHash(h);
    }
    signHashPacked(h) {
        return this.l2Account.signHashPacked(h);
    }
    get ay() {
        return this.l2Account.ay;
    }
    get ax() {
        return this.l2Account.ax;
    }
    get sign() {
        return this.l2Account.sign;
    }
    get bjjPubKey() {
        return this.l2Account.bjjPubKey;
    }
}
exports.Account = Account;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3VudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9hY2NvdW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFpRTtBQUNqRSx5Q0FBb0M7QUFDcEMsaUNBQXlDO0FBQ3pDLGlDQUFpQztBQUNqQyxrREFBb0Q7QUFDcEQsa0RBQXlGO0FBQ3pGLDREQUF3RDtBQUN4RCxpQ0FBOEI7QUFFOUIsU0FBUyx5QkFBeUIsQ0FBQyxPQUFlO0lBQ2hELE9BQU8sb0JBQW9CLEdBQUcsZUFBZSxPQUFPLEdBQUcsQ0FBQztBQUMxRCxDQUFDO0FBbUg0Qiw4REFBeUI7QUFqSHRELDJFQUEyRTtBQUMzRSxTQUFTLDZCQUE2QixDQUFDLE9BQWUsRUFBRSxTQUFpQjtJQUN2RSxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNsRCxNQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNwRCxPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ2hFLENBQUM7QUE0R3VELHNFQUE2QjtBQTFHckYsTUFBTSxTQUFTO0lBTWIsWUFBWSxJQUFJO1FBQ2QsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLEVBQUUsRUFBRTtZQUNyQixNQUFNLElBQUksS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUM7U0FDeEM7UUFFRCxJQUFJLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFdEMsTUFBTSxRQUFRLEdBQUcsZUFBTyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUU1QyxJQUFJLENBQUMsRUFBRSxHQUFHLGFBQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FB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