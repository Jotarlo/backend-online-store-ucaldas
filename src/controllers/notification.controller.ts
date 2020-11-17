// Uncomment these imports to begin using these cool features!

import {post, requestBody} from '@loopback/rest';
import {EmailNotification, SmsNotification} from '../models';
import {NotificationService} from '../services/notification.service';


export class NotificationController {
  constructor(
  ) {}

  @post('/sendSMS', {
    responses: {
      '200': {
        description: 'Send info by sms',
      },
    },
  })
  async smsNotification(
    @requestBody() smsNotification: SmsNotification): Promise<boolean> {
    let res = await new NotificationService().SmsNotification(smsNotification);
    return res;
  }

  @post('/sendEmail', {
    responses: {
      '200': {
        description: 'Send info by email',
      },
    },
  })
  async emailNotification(
    @requestBody() emailNotification: EmailNotification): Promise<boolean> {
    try {
      let res = await new NotificationService().EmailNotification(emailNotification);
      return res;
    } catch (error) {
      return false;
    }
  }
}
