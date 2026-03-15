export const MAYAR_API_KEY = process.env.MAYAR_API_KEY;
export const MAYAR_BASE_URL = process.env.MAYAR_BASE_URL || "https://api.mayar.id/hl/v1";

export interface CreatePaymentParams {
  name: string;
  email: string;
  amount: number;
  description: string;
  mobile?: string;
  metadata?: Record<string, any>;
}

export async function createPayment(params: CreatePaymentParams) {
  if (!MAYAR_API_KEY) {
    throw new Error("Mayar API Key is not configured");
  }

  const response = await fetch(`${MAYAR_BASE_URL}/payment/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${MAYAR_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: params.name,
      email: params.email,
      amount: params.amount,
      description: params.description,
      mobile: params.mobile || "0000000000",
      custom_field: params.metadata // Pass metadata as custom fields if Mayar supports it
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Mayar API Error:", data);
    throw new Error(data.message || "Failed to create Mayar payment link");
  }

  return data;
}
