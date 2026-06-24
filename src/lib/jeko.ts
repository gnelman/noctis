const JEKO_BASE_URL = "https://api.jeko.africa";

export async function initiatePayment({
  phone,
  amount,
  memberId,
}: {
  phone: string;
  amount: number;
  memberId: string;
}) {
  const response = await fetch(`${JEKO_BASE_URL}/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.JEKO_API_KEY}`,
    },
    body: JSON.stringify({
      phone,
      amount,
      currency: "XOF",
      reference: `noctis-${memberId}-${Date.now()}`,
      description: "Abonnement Noctis - 1 semaine",
    }),
  });

  return response.json();
}