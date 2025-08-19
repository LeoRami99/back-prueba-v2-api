export class Webhook {
  constructor(
    public event: string,
    public data: WebhookData,
    public sent_at: string,
    public timestamp: number,
    public signature: WebhookSignature,
    public environment: string,
  ) {}
}

export interface WebhookSignature {
  checksum: string;
  properties: string[];
}

export interface WebhookData {
  transaction: TransactionData;
}

export interface TransactionData {
  id: string;
  created_at: string;
  finalized_at: string;
  amount_in_cents: number;
  reference: string;
  customer_email: string;
  currency: string;
  payment_method_type: string;
  payment_method: any;
  status: string;
  status_message: string;
  shipping_address: string;
  redirect_url: string;
  payment_source_id: string;
  payment_link_id: string;
  customer_data: string;
  billing_data: string;
}
