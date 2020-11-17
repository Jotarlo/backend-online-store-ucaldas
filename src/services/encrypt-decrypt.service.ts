import {ServiceKeys as keys} from '../keys/service-keys';

const CryptoJS = require("crypto-js");
export class EncryptDecrypt {
  type: String;
  constructor(type: String) {
    this.type = type;
  }

  Encrypt(text: String) {
    switch (this.type) {
      case keys.MD5:
        return CryptoJS.MD5(text).toString();
        break;

      case keys.AES:
        return CryptoJS.AES.encrypt(text, keys.CRYPTO_JS_SECRET_KEY).toString();
        break;

      case keys.SHA_512:
        return CryptoJS.SHA256(text);
        break;

      default:
        return `${this.type} is an encrypt method not supported.`
        break;
    }
  }

}
