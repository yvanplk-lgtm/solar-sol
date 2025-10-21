export interface Client {
  id: string;
  name: string;
  address: string;
  contact: string;
  email: string;
}

export interface Product {
  id: string;
  designation: string;
  unitPrice: number;
}

export interface InvoiceItem {
  productId: string;
  designation: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  id: string;
  number: string;
  type: "invoice" | "quote";
  clientId: string;
  clientName: string;
  clientAddress: string;
  clientContact: string;
  items: InvoiceItem[];
  labor: number;
  discount: number;
  date: string;
  logo?: string;
}

export interface InvoiceCalculations {
  subtotal: number;
  laborAmount: number;
  totalBeforeDiscount: number;
  discountAmount: number;
  totalAfterDiscount: number;
  teeAmount: number;
  totalTTC: number;
}

export function calculateInvoice(invoice: Invoice): InvoiceCalculations {
  const subtotal = invoice.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const laborAmount = invoice.labor;
  const totalBeforeDiscount = subtotal + laborAmount;
  const discountAmount = (totalBeforeDiscount * invoice.discount) / 100;
  const totalAfterDiscount = totalBeforeDiscount - discountAmount;
  const teeAmount = (totalAfterDiscount * 2) / 100; // 2% TEE
  const totalTTC = totalAfterDiscount + teeAmount;

  return {
    subtotal,
    laborAmount,
    totalBeforeDiscount,
    discountAmount,
    totalAfterDiscount,
    teeAmount,
    totalTTC,
  };
}
