import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SendConfirmationEmailEvent, SendResetPasswordEmailEvent } from '../events/impl';
import { SendConfirmationEmailDto, SendResetPasswordEmailDto } from '../model';

@Injectable()
export class MailService {

  constructor(
    @Inject('MAIL_SERVER') private readonly mailServerClient: ClientProxy
  ) { }

  sendConfirmationEmail(sendConfirmationEmailDto: SendConfirmationEmailDto) {
    return this.mailServerClient.emit(
      'send_confirmation_email',
      new SendConfirmationEmailEvent(sendConfirmationEmailDto.email, sendConfirmationEmailDto.token)
    );
  }

  sendResetPasswordEmail(sendResetPasswordEmailDto: SendResetPasswordEmailDto) {
    return this.mailServerClient.emit(
      'send_reset_password_email',
      new SendResetPasswordEmailEvent(sendResetPasswordEmailDto.email, sendResetPasswordEmailDto.token)
    );
  }
}
