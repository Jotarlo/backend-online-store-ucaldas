/*
echo "export SENDGRID_API_KEY='YOUR_API_KEY'" > sendgrid.env
echo "sendgrid.env" >> .gitignore
source ./sendgrid.env

process.env.SENDGRID_API_KEY

echo "export TWILIO_SID='YOUR_SID'" > twilio_sid.env
echo "twilio_sid.env" >> .gitignore
source ./twilio_sid.env

process.env.TWILIO_SID

echo "export TWILIO_AUTH_TOKEN='YOUR_AUTH_TOKEN'" > auth_token.env
echo "auth_token.env" >> .gitignore
source ./auth_token.env

process.env.TWILIO_AUTH_TOKEN

*/

export const NotificationDataSource = {
  fromSMS: process.env.TWILIO_FROM,
  accountSid: process.env.TWILIO_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  fromEmail: process.env.SENDGRID_FROM,
  sendgridApiKey: process.env.SENDGRID_API_KEY
};
