// Uncomment these imports to begin using these cool features!

import {repository} from '@loopback/repository';
import {HttpErrors, post, requestBody} from '@loopback/rest';
import {NotificationKeys} from '../keys/notification-keys';
import {EmailNotification, SmsNotification} from '../models';
import {CustomerRepository, ShoppingCartRepository, UserRepository} from '../repositories';
import {AuthService} from '../services/auth.service';
import {NotificationService} from '../services/notification.service';

// import {inject} from '@loopback/core';

class Credentials {
  username: string;
  password: string;
}


class ChangePasswordData {
  id: string;
  currentPassword: string;
  newPassword: string;
}

// type of request: 1. SMS, 2. Email
class PasswordResetData {
  username: string;
  type: number;
}

export class UserController {
  authService: AuthService;

  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(CustomerRepository)
    public customerRepository: CustomerRepository,
    @repository(ShoppingCartRepository)
    public shoppingCartRepository: ShoppingCartRepository
  ) {
    this.authService = new AuthService(userRepository, shoppingCartRepository);
  }

  @post('/login', {
    responses: {
      '200': {
        description: 'Login for user',
      },
    },
  })
  async login(
    @requestBody() credentials: Credentials): Promise<object> {
    let data = await this.authService.Identify(credentials.username, credentials.password);
    console.log(data);
    if (data) {
      let tk = await this.authService.GenerateToken(data);
      return {
        data: data,
        token: tk
      };
    } else {
      throw new HttpErrors[401]("User or Password invalid");
    }
  }


  @post('/password-reset', {
    responses: {
      '200': {
        description: 'reset the password',
      },
    },
  })
  async reset(
    @requestBody() data: PasswordResetData): Promise<boolean> {
    let newPass = await this.authService.ResetPassword(data.username);
    let customer = await this.customerRepository.findOne({where: {document: data.username}});
    if (newPass) {
      switch (data.type) {
        // sms
        case 1:
          let smsNotification: SmsNotification = new SmsNotification({
            body: `${NotificationKeys.resetPasswordBody} ${newPass}`,
            to: customer?.phone
          });
          let sms = await new NotificationService().SmsNotification(smsNotification);
          if (sms) {
            return true;
          }
          throw new HttpErrors[400]("Error sending sms message.");
          break;
        case 2:
          let emailNotification: EmailNotification = new EmailNotification({
            subject: NotificationKeys.subjectReset,
            textBody: `${NotificationKeys.resetPasswordBody} ${newPass}`,
            htmlBody: `${NotificationKeys.resetPasswordBody} ${newPass}`,
            to: customer?.email
          });
          let email = await new NotificationService().EmailNotification(emailNotification);
          if (email) {
            return true;
          }
          throw new HttpErrors[400]("Error sending email message.");
          break;

        default:
          throw new HttpErrors[400]("This type of communication is not valid.");
          break;
      }
    }
    throw new HttpErrors[401]("User not found");
  }


  @post('/change-password', {
    responses: {
      '200': {
        description: 'Login for user',
      },
    },
  })
  async changePassword(
    @requestBody() data: ChangePasswordData): Promise<boolean> {
    let user = await this.authService.VerifyUserToChangePassword(data.id, data.currentPassword);
    if (user) {
      return await this.authService.ChangePassword(user, data.newPassword);
    } else {
      throw new HttpErrors[401]("User or Password invalid");
    }
  }

}
