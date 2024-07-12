import { transport } from '../config/nodemailer';

interface IEmail {
  email: string;
  name: string;
  token: string;
}

export class AuthEmail {
  // Cambié el nombre del método para que sea más descriptivo
  static sendConfirmationEmail = async (user: IEmail) => {
    const mailOptions = {
      from: 'UpTask <uptask@emeal.nttadta.com>',
      to: user.email,
      subject: 'UpTask - Confirma tu cuenta',
      text: 'UpTask - Confirma tu cuenta',
      html: `
        <p>Hola: ${user.name}, has creado tu cuenta en UpTask, ya casi está todo listo, solo debes confirmar tu cuenta.</p>
        <p>Visita el siguiente enlace:</p>
        <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar cuenta</a>
        <p>E ingresa el código: <b>${user.token}</b></p>
        <p>Este token expira en 10 minutos</p>
      `,
    };

    try {
      const info = await transport.sendMail(mailOptions);
      console.log('Mensaje enviado', info.messageId);
    } catch (error) {
      console.error('Error al enviar el mensaje', error);
    }
  };
}
