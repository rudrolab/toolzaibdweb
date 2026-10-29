// Vercel Serverless Function: /api/verify-and-deliver
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      resendApiKey: clientApiKey,
      senderEmail,
      customerEmail,
      customerName,
      orderId,
      credentialsText,
      instructionsText,
      storeName,
      totalAmount,
      subject: customSubject,
      html: customHtml
    } = req.body;

    const resendApiKey = process.env.RESEND_API_KEY || clientApiKey;

    if (!resendApiKey) {
      return res.status(400).json({ error: 'Missing Resend API Key. Configure RESEND_API_KEY environment variable or in Admin Settings.' });
    }

    if (!customerEmail) {
      return res.status(400).json({ error: 'Missing customer email' });
    }

    const emailSubject = customSubject || `🎉 Your Digital Product Credentials (#${orderId}) - ${storeName || 'ToolzAi BD'}`;

    const html = customHtml || `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your Digital Order Credentials</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 20px; color: #0F172A; }
    .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8F0; }
    .header { background: linear-gradient(135deg, #00C853 0%, #009624 100%); padding: 30px 24px; text-align: center; color: #FFFFFF; }
    .content { padding: 28px 24px; }
    .credential-box { background: #0F172A; color: #38BDF8; padding: 20px; border-radius: 12px; margin: 20px 0; font-family: monospace; font-size: 13px; line-height: 1.6; white-space: pre-wrap; word-break: break-all; }
    .summary-card { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 16px; margin: 16px 0; font-size: 13px; }
    .guide-box { background: #F0FDF4; border: 1px solid #86EFAC; border-radius: 12px; padding: 16px; font-size: 12px; line-height: 1.6; color: #166534; white-space: pre-line; margin: 20px 0; }
    .footer { background: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 20px 24px; text-align: center; font-size: 12px; color: #64748B; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin:0; font-size: 24px;">${storeName || 'ToolzAi BD'}</h1>
      <p style="margin:4px 0 0; opacity: 0.9; font-size: 13px;">Official Digital Product Delivery</p>
    </div>
    <div class="content">
      <h2 style="margin: 0 0 10px; font-size: 20px;">Thank you, ${customerName || 'Valued Customer'}!</h2>
      <p style="font-size: 13px; color: #475569;">Your payment has been successfully verified. Here are your digital product credentials:</p>
      
      <div class="credential-box">${credentialsText || 'Activation link dispatched to your email.'}</div>

      <div class="summary-card">
        <p style="margin: 0 0 6px;"><strong>Order ID:</strong> ${orderId}</p>
        <p style="margin: 0 0 6px;"><strong>Delivered to:</strong> ${customerEmail}</p>
        <p style="margin: 0;"><strong>Total Paid:</strong> ৳${totalAmount || '0'}</p>
      </div>

      <div class="guide-box">
        <strong>📖 Activation Guide:</strong><br/>
        ${instructionsText || 'Check your Gmail inbox and click the invitation link to activate.'}
      </div>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} ${storeName || 'ToolzAi BD'}. 100% Replacement Warranty Guaranteed.</p>
    </div>
  </div>
</body>
</html>
    `;

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: senderEmail || 'ToolzAi BD <onboarding@resend.dev>',
        to: [customerEmail],
        subject: emailSubject,
        html: html,
      }),
    });

    const resendData = await resendRes.json();

    if (!resendRes.ok) {
      return res.status(resendRes.status).json({ error: resendData.message || resendData.name || 'Resend error', details: resendData });
    }

    return res.status(200).json({ success: true, emailId: resendData.id });
  } catch (error: any) {
    console.error('Serverless verify and deliver error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
