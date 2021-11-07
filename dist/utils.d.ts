/**
 * Convert to hexadecimal string padding until 256 characters
 * @param {Number | Scalar} n - Input number
 * @returns {String} String encoded as hexadecimal with 256 characters
 */
declare function padding256(n: any): any;
/**
 * Mask and shift a Scalar
 * @param {Scalar} num - Input number
 * @param {Number} origin - Initial bit
 * @param {Number} len - Bit lenght of the mask
 * @returns {Scalar} Extracted Scalar
 */
declare function extract(num: any, origin: any, len: any): any;
/**
 * Pad a string hex number with 0
 * @param {String} str - String input
 * @param {Number} length - Length of the resulting string
 * @returns {String} Resulting string
 */
declare function padZeros(str: any, length: any): any;
/**
 * (Hash Sha256 of an hexadecimal string) % (Snark field)
 * @param {String} str - String input in hexadecimal encoding
 * @returns {String} Resulting string encoded as hexadecimal
 */
declare function sha256Snark(str: any): any;
/**
 * Hash tree state
 * @param {Scalar} balance - account balance
 * @param {Scalar} tokenId - tokend identifier
 * @param {Scalar} Ax - x coordinate babyjubjub
 * @param {Scalar} Ay - y coordinate babyjubjub
 * @param {Scalar} ethAddress - ethereum address
 * @param {Scalar} nonce - nonce
 * @returns {Object} - Contains hash state value, entry elements and leaf raw object
 */
declare function hashStateTree(balance: any, tokenId: any, Ax: any, Ay: any, ethAddress: any, nonce: any): {
    leafObj: {
        balance: any;
        tokenId: any;
        Ax: any;
        Ay: any;
        ethAddress: any;
        nonce: any;
    };
    elements: {
        e0: string;
        e1: string;
        e2: string;
        e3: string;
        e4: string;
    };
    hash: any;
};
export { padding256, extract, padZeros, hashStateTree, sha256Snark };
