import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { siteConfig } from '@/data/site'

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from: 'Portfolio Contact <noreply@clevisgikenyi.dev>',
      to: siteConfig.email,
      replyTo: email,
      subject: `New message from ${name} via portfolio`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;padding:24px;">
          <h2 style="margin:0 0 16px;font-size:18px;">New portfolio enquiry</h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
            <tr>
              <td style="padding:8px 12px;background:#f5f5f5;font-weight:bold;width:80px;">Name</td>
              <td style="padding:8px 12px;border-bottom:1px solid #eee;">${name}</td>
            </tr>
            <tr>
              <td style="padding:8px 12px;background:#f5f5f5;font-weight:bold;">Email</td>
              <td style="padding:8px 12px;border-bottom:1px solid #eee;"><a href="mailto:${email}">${email}</a></td>
            </tr>
          </table>
          <div style="background:#f9f9f9;border-left:3px solid #4f46e5;padding:16px;border-radius:4px;">
            <p style="margin:0;white-space:pre-wrap;">${message}</p>
          </div>
          <p style="margin:16px 0 0;font-size:12px;color:#888;">
            Sent from your portfolio · Reply directly to respond to ${name}
          </p>
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}