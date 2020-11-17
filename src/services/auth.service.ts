import {repository} from '@loopback/repository';
import {generate as passGenerator} from 'generate-password';
import {PasswordKeys as passKeys} from '../keys/password-keys';
import {ServiceKeys as keys} from '../keys/service-keys';
import {AuthenticatedUser, User} from '../models';
import {ShoppingCartRepository, UserRepository} from '../repositories';
import {EncryptDecrypt} from './encrypt-decrypt.service';
const jwt = require('jsonwebtoken');

export class AuthService {

  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(ShoppingCartRepository)
    public cartRepository: ShoppingCartRepository) {}

  /**
   * To identify an user when try to login
   * @param username
   * @param password
   */
  async Identify(username: string, password: string): Promise<AuthenticatedUser | false> {
    let user = await this.userRepository.findOne({where: {username: username}});
    if (user) {
      let encryptPass = new EncryptDecrypt(keys.LOGIN_CRYPT_METHOD).Encrypt(password);
      if (user.password == encryptPass) {
        let cart = await this.cartRepository.findOne({where: {customerId: user.customerId}})
        return new AuthenticatedUser({
          id: user.id,
          cartId: cart?.id,
          customerId: user.customerId,
          role: user.role,
          username: user.username
        });
      }
    }
    return false;
  }

  async VerifyUserToChangePassword(id: string, currentPassword: string): Promise<User | false> {
    let user = await this.userRepository.findById(id);
    if (user) {
      let encryptPass = new EncryptDecrypt(keys.LOGIN_CRYPT_METHOD).Encrypt(currentPassword);
      if (user.password == encryptPass) {
        return user;
      }
    }
    return false;
  }

  async ChangePassword(user: User, newPassword: String): Promise<boolean> {
    try {
      let encryptPass = new EncryptDecrypt(keys.LOGIN_CRYPT_METHOD).Encrypt(newPassword);
      user.password = encryptPass;
      await this.userRepository.updateById(user.id, user);
      return true;
    } catch (_) {
      return false;
    }
  }

  /**
   * When user miss the password and want to get one
   * @param username
   */
  async ResetPassword(username: string): Promise<string | false> {
    let user = await this.userRepository.findOne({where: {username: username}});
    if (user) {
      let randomPassword = await this.GenerateRandomPassword();
      let encrypter = new EncryptDecrypt(keys.LOGIN_CRYPT_METHOD);
      let encryptPass = encrypter.Encrypt(encrypter.Encrypt(randomPassword));
      user.password = encryptPass;
      this.userRepository.replaceById(user.id, user);
      return randomPassword;
    }
    return false;
  }

  /**
   * It generates a random password
   */
  async GenerateRandomPassword() {
    let randomPassword = passGenerator({
      length: passKeys.LENGTH,
      numbers: passKeys.NUMBERS,
      uppercase: passKeys.UPPERCASE,
      lowercase: passKeys.LOWERCASE
    });
    return randomPassword;
  }

  /**
   * Generta a jwt token
   * @param user
   */
  async GenerateToken(user: AuthenticatedUser) {
    let secretKey = keys.JWT_SECRET_KEY;
    return jwt.sign({
      exp: keys.TOKEN_EXPIRATION_TIME,
      data: {
        _id: user.id,
        username: user.username,
        role: user.role,
        paternId: user.customerId,
        cartId: user.cartId
      }
    },
      secretKey);
  }

  /**
   * Verify if a jwt token is valid
   * @param token
   */
  async VerifyToken(token: string) {
    try {
      //console.log("Token in VerifyToken: " + token);
      let data = jwt.verify(token, keys.JWT_SECRET_KEY);
      //console.log("data verifying");
      //console.log(data);
      return data;
    } catch (error) {
      //console.log(error);
      return false;
    }
  }

}
