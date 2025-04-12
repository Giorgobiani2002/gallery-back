import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { from } from 'rxjs';

@Injectable()
export class EmailSenderService {
  constructor(private emailService: MailerService) {}

  async sendEmailText(to, subject, text) {
    const options = {
      from: 'web-10 <gio.nozadze1.10@gmail.com>',
      to,
      subject,
      text,
    };

    const info = await this.emailService.sendMail(options);

    console.log(info);
  }

  async sendEmailHtml(to: string, subject: string) {
    const html = `
        <div style="border: 2px solid black">
            <h1 style="color: red">Hello world</h1>
        </div>
        `;
    const options = {
      from: 'web-10 <gio.nozadze1.10@gmail.com>',
      to,
      subject,
      html,
    };

    try {
      const info = await this.emailService.sendMail(options);
      console.log('Email Sent Successfully', info);

      console.log(info, 'info');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async sendEmailHtmltoAdmin(
    to: string,
    subject: string,
    UserEmail: string,
    UploadedFiles: string[],
  ) {
    const html = `
        <div style="border: 2px solid black">
            <h1 style="color: red">Hello world email: ${UserEmail}</h1>
            <div>
              <p>art Works:</p>
                <ul> 
                ${UploadedFiles.map(
                  (img, index) => `
                  <li>Artwork ${index + 1}: <a href="${img}" target="_blank">${img}</a></li>
                `,
                ).join('')}
              </ul>
            </div>
        </div>
        `;
    const options = {
      from: 'web-10 <gio.nozadze1.10@gmail.com>',
      to,
      subject,
      html,
    };

    try {
      const info = await this.emailService.sendMail(options);
      console.log('Email Sent Successfully', info);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
