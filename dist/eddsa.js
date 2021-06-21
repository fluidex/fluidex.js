"use strict";
/* modified from circomlib/src/eddsa.js */
Object.defineProperty(exports, "__esModule", { value: true });
exports.pruneBuffer = exports.unpackSignature = exports.packSignature = exports.verifyWithHasher = exports.signWithHasher = exports.prv2pub = exports.prv2bigint = void 0;
const createBlakeHash = require("blake-hash");
const ffjs_1 = require("./ffjs");
const circomlib_1 = require("circomlib");
function pruneBuffer(_buff) {
    const buff = Buffer.from(_buff);
    buff[0] = buff[0] & 0xf8;
    buff[31] = buff[31] & 0x7f;
    buff[31] = buff[31] | 0x40;
    return buff;
}
exports.pruneBuffer = pruneBuffer;
function prv2bigint(prv) {
    const sBuff = pruneBuffer(createBlakeHash("blake512").update(prv).digest().slice(0, 32));
    let s = ffjs_1.ffutils.leBuff2int(sBuff);
    return ffjs_1.Scalar.shr(s, 3);
}
exports.prv2bigint = prv2bigint;
function prv2pub(prv) {
    const A = circomlib_1.babyJub.mulPointEscalar(circomlib_1.babyJub.Base8, prv2bigint(prv));
    return A;
}
exports.prv2pub = prv2pub;
function signWithHasher(prv, msg, hasher) {
    const h1 = createBlakeHash("blake512").update(prv).digest();
    const sBuff = pruneBuffer(h1.slice(0, 32));
    const s = ffjs_1.ffutils.leBuff2int(sBuff);
    const A = circomlib_1.babyJub.mulPointEscalar(circomlib_1.babyJub.Base8, ffjs_1.Scalar.shr(s, 3));
    const msgBuff = ffjs_1.ffutils.leInt2Buff(msg, 32);
    const rBuff = createBlakeHash("blake512")
        .update(Buffer.concat([h1.slice(32, 64), msgBuff]))
        .digest();
    let r = ffjs_1.ffutils.leBuff2int(rBuff);
    const Fr = new ffjs_1.F1Field(circomlib_1.babyJub.subOrder);
    r = Fr.e(r);
    const R8 = circomlib_1.babyJub.mulPointEscalar(circomlib_1.babyJub.Base8, r);
    const hm = hasher([R8[0], R8[1], A[0], A[1], msg]);
    const S = Fr.add(r, Fr.mul(hm, s));
    return {
        R8: R8,
        S: S,
    };
}
exports.signWithHasher = signWithHasher;
function verifyWithHasher(msg, sig, A, hasher) {
    // Check parameters
    if (typeof sig != "object")
        return false;
    if (!Array.isArray(sig.R8))
        return false;
    if (sig.R8.length != 2)
        return false;
    if (!circomlib_1.babyJub.inCurve(sig.R8))
        return false;
    if (!Array.isArray(A))
        return false;
    if (A.length != 2)
        return false;
    if (!circomlib_1.babyJub.inCurve(A))
        return false;
    if (sig.S >= circomlib_1.babyJub.subOrder)
        return false;
    const hm = hasher([sig.R8[0], sig.R8[1], A[0], A[1], msg]);
    const Pleft = circomlib_1.babyJub.mulPointEscalar(circomlib_1.babyJub.Base8, sig.S);
    let Pright = circomlib_1.babyJub.mulPointEscalar(A, ffjs_1.Scalar.mul(hm, 8));
    Pright = circomlib_1.babyJub.addPoint(sig.R8, Pright);
    if (!circomlib_1.babyJub.F.eq(Pleft[0], Pright[0]))
        return false;
    if (!circomlib_1.babyJub.F.eq(Pleft[1], Pright[1]))
        return false;
    return true;
}
exports.verifyWithHasher = verifyWithHasher;
function packSignature(sig) {
    const R8p = circomlib_1.babyJub.packPoint(sig.R8);
    const Sp = ffjs_1.ffutils.leInt2Buff(sig.S, 32);
    return Buffer.concat([R8p, Sp]);
}
exports.packSignature = packSignature;
function unpackSignature(sigBuff) {
    return {
        R8: circomlib_1.babyJub.unpackPoint(sigBuff.slice(0, 32)),
        S: ffjs_1.ffutils.leBuff2int(sigBuff.slice(32, 64)),
    };
}
exports.unpackSignature = unpackSignature;
//# sourceMappingURL=eddsa.js.map