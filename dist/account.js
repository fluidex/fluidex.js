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
        this.bjjPubKey = '0x' + compressedBuff.toString('hex');
        //this.bjjCompressed = utils.padZeros(ffutils.leBuff2int(compressedBuff).toString(16), 64);
    }
    signHashPacked(h) {
        const sig = eddsa_1.signWithHasher(this.rollupPrvKey, h, hash_1.hash);
        return eddsa_1.packSignature(sig);
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
//# sourceMappingURL=account.js.map