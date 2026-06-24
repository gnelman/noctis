import AfricasTalking from "africastalking";

const at = AfricasTalking({
  apiKey: process.env.AFRICASTALKING_API_KEY!,
  username: process.env.AFRICASTALKING_USERNAME!,
});

export const sms = at.SMS;

export async function sendOTP(phone: string, code: string) {
  await sms.send({
    to: [phone],
    message: `Noctis - Votre code de verification est : ${code}. Valable 10 minutes.`,
    from: "Noctis",
  });
}