import { readFile } from 'fs/promises';

export const getTemplate = (templateName) => readFile(new URL(`./templates/${templateName}_template.html`, import.meta.url), 'utf8');

export const TEMPLATES = {
  // ACCOUNT_DELETION_CONFIRMATION:  getTemplate('account_deletion_confirmation'),
  // ACCOUNT_REACTIVATION:  getTemplate('account_reactivation'),
  // ACCOUNT_SETTINGS_UPDATE:  getTemplate('account_settings_update'),
  // ACCOUNT_SUSPENSION_NOTIFICATION:  getTemplate('account_suspension_notification'),
  // ACCOUNT_UPDATE_NOTIFICATION:  getTemplate('account_update_notification'),
  // ACCOUNT_VERIFICATION:  getTemplate('account_verification'),
  // BILLING_CONFIRMATION:  getTemplate('billing_confirmation'),
  // BILLING_FAILURE:  getTemplate('billing_failure'),
  // BILLING_REMINDER:  getTemplate('billing_reminder'),
  // CUSTOM_REPORT:  getTemplate('custom_report'),
  // FEEDBACK_REQUEST:  getTemplate('feedback_request'),
  // FEEDBACK_THANK_YOU:  getTemplate('feedback_thank_you'),
  // FOLLOW_UP_EMAIL:  getTemplate('follow_up_email'),
  // INVOICE:  getTemplate('invoice'),
  // MONTHLY_REPORT:  getTemplate('monthly_report'),
  // NEWSLETTER:  getTemplate('newsletter'),
  // PASSWORD_CHANGE_NOTIFICATION:  getTemplate('password_change_notification'),
  // PASSWORD_RESET:  getTemplate('password_reset'),
  // RECEIPT:  getTemplate('receipt'),
  // REMINDER_EMAIL:  getTemplate('reminder_email'),
  // SECURITY_ALERT:  getTemplate('security_alert'),
  // SUBJECT_REGISTRATION:  getTemplate('subject_registration'),
  // SURVEY_INVITATION:  getTemplate('survey_invitation'),
  // THANK_YOU_EMAIL:  getTemplate('thank_you_email'),
  // WEEKLY_REPORT:  getTemplate('weekly_report'),
  // WELCOME_EMAIL: getTemplate('welcome_email'),
  OTP_EMAIL: getTemplate('otp_email'),
};
