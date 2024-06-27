import * as dotenv from 'dotenv';

dotenv.config();
export const recoverPasswordEmail = (token: string) => `
  <div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.5; color: #4d4d4d; background-color: #ffffff; margin: 0;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td>
          <div style="background-color: #f2f2f2; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td>
                    <img src="https://www.example.com/logo.png" alt="Logo" style="display: block; margin: 0 auto; max-width: 200px;">
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px;">
                    <h1 style="font-size: 24px; margin-bottom: 20px;">Altere a sua senha</h1>
                    <p style="margin-bottom: 10px;">Caro usuário,</p>
                    <p style="margin-bottom: 10px;">Você recebeu uma solicitação para alterar sua senha. Caso você não tenha solicitado, ignore este email.</p>
                    <p style="margin-bottom: 10px;">To reset your password, please click the button below:</p>
                    <p style="text-align: center; margin-top: 20px; margin-bottom: 20px;">
                      <a href="${process.env.HOST_URL}/reset-password?token=${token}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 3px;">Alterar senha</a>
                    </p>
                    <p style="margin-bottom: 10px;">Caso o botão não funcione, copie o link e cole no seu navegador:</p>
                    <p style="margin-bottom: 10px;">${process.env.HOST_URL}/reset-password?token=${token}</p>
                    <p style="margin-bottom: 0;">Atenciosamente,</p>
                    <p style="margin-bottom: 0;">Fretes Team</p>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </td>
      </tr>
    </table>
  </div>
`;
