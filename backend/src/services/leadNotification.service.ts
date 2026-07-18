import nodemailer from 'nodemailer';
import type { ContactRequest, Setting } from '@prisma/client';

type NotificationSetting = Pick<Setting, 'key' | 'value'>;

type MailTransportConfig = {
  host: string;
  port: number;
  secure: boolean;
  auth?: {
    user: string;
    pass: string;
  };
};

const requestTypeLabels: Record<string, string> = {
  contact: 'رسالة تواصل',
  plan: 'طلب خطة',
  advertising: 'طلب حملة اعلانية',
};

const htmlEscape = (value: unknown) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const compact = (values: Array<string | null | undefined>) => values
  .map(value => value?.trim())
  .filter((value): value is string => Boolean(value));

function settingMap(settings: NotificationSetting[]) {
  return Object.fromEntries(settings.map(setting => [setting.key, setting.value]));
}

function notificationRecipients(settings: NotificationSetting[]) {
  const values = settingMap(settings);
  const configured = [
    process.env.LEAD_NOTIFICATION_EMAIL,
    process.env.ADMIN_EMAIL,
    values.lead_notification_email,
    values.admin_email,
    values.contact_email,
    values.email,
    process.env.SMTP_USER,
  ];
  return [...new Set(compact(configured).flatMap(value => value.split(',').map(item => item.trim()).filter(Boolean)))];
}

function senderAddress(settings: NotificationSetting[]) {
  const values = settingMap(settings);
  return compact([
    process.env.SMTP_FROM,
    process.env.SMTP_USER,
    values.email,
  ])[0];
}

function mailConfig(): MailTransportConfig | null {
  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT || 587);
  if (!host || !Number.isInteger(port)) return null;

  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  return {
    host,
    port,
    secure: String(process.env.SMTP_SECURE || '').toLowerCase() === 'true' || port === 465,
    auth: user && pass ? { user, pass } : undefined,
  };
}

function formatMoney(value?: number | null, currency?: string | null) {
  if (value == null || !Number.isFinite(value)) return '';
  return `${value.toLocaleString('en-US')} ${currency || 'EGP'}`;
}

function formatJson(value: unknown) {
  if (!value) return '';
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function leadRows(lead: ContactRequest) {
  const rows = [
    ['نوع الطلب', requestTypeLabels[lead.requestType] || lead.requestType],
    ['الاسم', lead.name],
    ['الموبايل / واتساب', lead.phone],
    ['البريد', lead.email],
    ['الشركة', lead.company],
    ['النشاط', lead.businessActivity],
    ['الخطة', lead.planTitle],
    ['القيمة', formatMoney(lead.planPrice, lead.planCurrency)],
    ['الميزانية', formatMoney(lead.budget, 'EGP')],
    ['الرسالة', lead.message],
    ['المصدر', lead.source],
    ['وقت الوصول', lead.createdAt.toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' })],
  ];
  return rows.filter(([, value]) => String(value || '').trim());
}

function buildAdminMessage(lead: ContactRequest) {
  const typeLabel = requestTypeLabels[lead.requestType] || lead.requestType || 'طلب جديد';
  const frontendUrl = process.env.FRONTEND_URL?.replace(/\/$/, '');
  const adminUrl = frontendUrl ? `${frontendUrl}/admin/leads` : '';
  const details = formatJson(lead.requestDetails);
  const rows = leadRows(lead);

  const text = [
    `وصل ${typeLabel} جديد من الموقع.`,
    '',
    ...rows.map(([label, value]) => `${label}: ${value}`),
    details ? `\nتفاصيل اضافية:\n${details}` : '',
    adminUrl ? `\nلوحة الادارة: ${adminUrl}` : '',
  ].filter(Boolean).join('\n');

  const htmlRows = rows.map(([label, value]) => `
    <tr>
      <td style="padding:8px 10px;border-bottom:1px solid #eee;font-weight:700;color:#221523">${htmlEscape(label)}</td>
      <td style="padding:8px 10px;border-bottom:1px solid #eee;color:#475467">${htmlEscape(value)}</td>
    </tr>
  `).join('');

  const html = `
    <div dir="rtl" style="font-family:Arial,Tahoma,sans-serif;line-height:1.7;color:#221523">
      <h2 style="margin:0 0 12px;color:#9d027c">وصل ${htmlEscape(typeLabel)} جديد</h2>
      <table cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;border:1px solid #eee;border-radius:8px;overflow:hidden">${htmlRows}</table>
      ${details ? `<h3 style="margin:18px 0 8px">تفاصيل اضافية</h3><pre dir="ltr" style="white-space:pre-wrap;background:#f8fafc;padding:12px;border-radius:8px;color:#344054">${htmlEscape(details)}</pre>` : ''}
      ${adminUrl ? `<p style="margin-top:18px"><a href="${htmlEscape(adminUrl)}" style="color:#9d027c;font-weight:700">فتح الطلبات في لوحة الادارة</a></p>` : ''}
    </div>
  `;

  return { subject: `طلب جديد من الموقع: ${lead.name}`, text, html };
}

function buildCustomerMessage(lead: ContactRequest) {
  const typeLabel = requestTypeLabels[lead.requestType] || 'طلبك';
  const title = lead.planTitle ? ` بخصوص ${lead.planTitle}` : '';
  const text = [
    `اهلا ${lead.name},`,
    '',
    `استلمنا ${typeLabel}${title}. فريق Select هيراجع التفاصيل ويتواصل معك قريبا لتأكيد الخطوة التالية.`,
    '',
    'شكرا لثقتك في Select.',
  ].join('\n');

  const html = `
    <div dir="rtl" style="font-family:Arial,Tahoma,sans-serif;line-height:1.8;color:#221523">
      <h2 style="margin:0 0 12px;color:#9d027c">استلمنا طلبك</h2>
      <p>اهلا ${htmlEscape(lead.name)},</p>
      <p>استلمنا ${htmlEscape(typeLabel)}${htmlEscape(title)}. فريق Select هيراجع التفاصيل ويتواصل معك قريبا لتأكيد الخطوة التالية.</p>
      <p>شكرا لثقتك في Select.</p>
    </div>
  `;

  return { subject: 'استلمنا طلبك - Select', text, html };
}

export async function notifyNewContactRequest(lead: ContactRequest, settings: NotificationSetting[]) {
  if (String(process.env.LEAD_NOTIFICATIONS_DISABLED || '').toLowerCase() === 'true') return;

  const config = mailConfig();
  if (!config) {
    console.warn('Lead notification skipped: SMTP_HOST/SMTP_PORT are not configured.');
    return;
  }

  const from = senderAddress(settings);
  const recipients = notificationRecipients(settings);
  if (!from || !recipients.length) {
    console.warn('Lead notification skipped: no sender or recipient email is configured.');
    return;
  }

  const transporter = nodemailer.createTransport(config);
  const adminMessage = buildAdminMessage(lead);
  await transporter.sendMail({
    from,
    to: recipients,
    replyTo: lead.email || undefined,
    ...adminMessage,
  });

  if (lead.email) {
    const customerMessage = buildCustomerMessage(lead);
    await transporter.sendMail({
      from,
      to: lead.email,
      replyTo: from,
      ...customerMessage,
    });
  }
}
