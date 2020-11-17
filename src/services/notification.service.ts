import {NotificationDataSource} from '../datasources/notification.datasource';
import {EmailNotification, SmsNotification} from '../models';

const twilio = require("twilio");
const sgMail = require("@sendgrid/mail");

const CryptoJS = require("crypto-js");
export class NotificationService {
  constructor() {
  }

  /**
   * Send notification by sms
   * @param notification
   */
  async SmsNotification(notification: SmsNotification): Promise<boolean> {
    try {
      const client = twilio(NotificationDataSource.accountSid, NotificationDataSource.authToken);
      await client.messages.create({
        body: notification.body,
        to: notification.to,
        from: NotificationDataSource.fromSMS
      }).then((res: any) => {
        console.log(res);
      });
      return true;
    } catch (error) {
      return false;
    }
  }


  /**
   * Send notification by email
   * @param notification
   */
  async EmailNotification(notification: EmailNotification): Promise<boolean> {
    try {
      sgMail.setApiKey(NotificationDataSource.sendgridApiKey);
      const msg = {
        to: notification.to,
        from: NotificationDataSource.fromEmail,
        subject: notification.subject,
        text: notification.textBody,
        html: notification.htmlBody
      };
      console.log(msg);
      await sgMail.send(msg).then((d: any) => {
        console.log(d)
      }, function (error: any) {
        if (error) {
          console.error(error.message);
        }
      });
      return true;
    } catch (error) {
      return false;
    }
  }

}
