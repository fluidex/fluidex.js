import { prv2pub, signWithHasher, packSignature } from './eddsa';
import { babyJub } from 'circomlib';
import { Scalar } from './ffjs';
import * as ethers from 'ethers';
import { randomBytes } from '@ethersproject/random';
import { defaultPath, HDNode, entropyToMnemonic } from '@ethersproject/hdnode';
import { SigningKey } from '@ethersproject/signing-key';
import { hash } from './hash';
function get_CREATE_L2_ACCOUNT_MSG(chainID) {
    return 'FLUIDEX_L2_ACCOUNT' + `\nChain ID: ${chainID}.`;
}
// https://github.com/ethers-io/ethers.js/issues/447#issuecomment-519163178
function recoverPublicKeyFromSignature(message, signature) {
    const msgHash = ethers.utils.hashMessage(message);
    const msgHashBytes = ethers.utils.arrayify(msgHash);
    return ethers.utils.recoverPublicKey(msgHashBytes, signature);
}
class L2Account {
    constructor(seed) {
        if (seed.length != 32) {
            throw new Error('invalid l2 key seed');
        }
        this.rollupPrvKey = Buffer.from(seed);
        const bjPubKey = prv2pub(this.rollupPrvKey);
        this.ax = Scalar.fromString(bjPubKey[0].toString(16), 16);
        this.ay = Scalar.fromString(bjPubKey[1].toString(16), 16);
        const compressedBuff = babyJub.packPoint(bjPubKey);
        this.sign = 0n;
        if (compressedBuff[31] & 0x80) {
            this.sign = 1n;
        }
        this.bjjPubKey = '0x' + compressedBuff.toString('hex');
        //this.bjjCompressed = utils.padZeros(ffutils.leBuff2int(compressedBuff).toString(16), 64);
    }
    signHashPacked(h) {
        const sig = signWithHasher(this.rollupPrvKey, h, hash);
        return packSignature(sig);
    }
    signHash(h) {
        const sig = signWithHasher(this.rollupPrvKey, h, hash);
        return {
            hash: h,
            S: sig.S,
            R8x: sig.R8[0],
            R8y: sig.R8[1],
        };
    }
}
function randomMnemonic() {
    let entropy = randomBytes(16);
    const mnemonic = entropyToMnemonic(entropy);
    return mnemonic;
}
class TxSignature {
}
class Account {
    static fromMnemonic(mnemonic, chainId = 1) {
        const privKey = HDNode.fromMnemonic(mnemonic, null, null).derivePath(defaultPath).privateKey;
        return Account.fromPrivkey(privKey, chainId);
    }
    static fromPrivkey(privKey, chainId = 1) {
        const msgHash = ethers.utils.hashMessage(get_CREATE_L2_ACCOUNT_MSG(chainId));
        const signKey = new SigningKey(privKey);
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
export { L2Account, Account, get_CREATE_L2_ACCOUNT_MSG, recoverPublicKeyFromSignature, randomMnemonic, TxSignature };
//# sourceMappingURL=account.js.map