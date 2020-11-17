export namespace ServiceKeys {
  export const MD5 = 'md5';
  export const AES = 'aes';
  export const SHA_512 = 'sha512';
  export const CRYPTO_JS_SECRET_KEY = 'Secret@Password*CRYPTO'
  export const JWT_SECRET_KEY = 'Secret@Password*JWT'
  export const LOGIN_CRYPT_METHOD = MD5;
  export const TOKEN_EXPIRATION_TIME = Math.floor(Date.now() / 1000) + (60 * 60 * 3);
}
