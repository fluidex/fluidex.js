/// <reference types="node" />
declare function pruneBuffer(_buff: any): Buffer;
declare function prv2bigint(prv: any): any;
declare function prv2pub(prv: any): any;
declare function signWithHasher(prv: any, msg: any, hasher: any): {
    R8: any;
    S: any;
};
declare function verifyWithHasher(msg: any, sig: any, A: any, hasher: any): boolean;
declare function packSignature(sig: any): Buffer;
declare function unpackSignature(sigBuff: any): {
    R8: any;
    S: any;
};
export { prv2bigint, prv2pub, signWithHasher, verifyWithHasher, packSignature, unpackSignature, pruneBuffer, };
