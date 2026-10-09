import QRCode from "qrcode";

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  clientName: string;
  clientPhone?: string;
  clientAddress?: string;
  projectName?: string;
  items: Array<{
    category?: string;
    itemTitle: string;
    quantity: number;
    unit?: string;
    unitPrice: number;
    amount: number;
  }>;
  subtotal: number;
  discount: number;
  total: number;
  advance: number;
  due: number;
  notes?: string;
}

export interface PaymentQRResult {
  qrDataUrl: string;
  paymentString: string;
  merchantNumber: string;
  invoiceNumber: string;
  amount: number;
}

/**
 * Generates a high-resolution bKash / Nagad Merchant Payment QR Code Data URL.
 * Encodes the direct merchant payment deep-link / reference string for instant mobile scanning.
 */
export async function generatePaymentQRCode(
  invoiceNumber: string,
  amount: number,
  merchantNumber: string = "01883012641"
): Promise<PaymentQRResult> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Standard Bangladesh MFS Merchant Payment format
  const paymentString = `bkash://payment?merchant=${merchantNumber}&amount=${amount}&ref=${invoiceNumber}`;
  const webPaymentUrl = `${appUrl}/client-dashboard?tab=invoices&pay=${invoiceNumber}&amt=${amount}`;

  // Use the web fallback deep-link in the QR so phone cameras and bKash QR scanners can both parse it
  const qrTarget = webPaymentUrl;

  try {
    const qrDataUrl = await QRCode.toDataURL(qrTarget, {
      errorCorrectionLevel: "H",
      type: "image/png",
      margin: 2,
      width: 280,
      color: {
        dark: "#0F172A", // Deep Navy slate
        light: "#FFFFFF",
      },
    });

    return {
      qrDataUrl,
      paymentString,
      merchantNumber,
      invoiceNumber,
      amount,
    };
  } catch (error) {
    console.error("Error generating QR code:", error);
    // Return transparent fallback if error
    return {
      qrDataUrl: "",
      paymentString,
      merchantNumber,
      invoiceNumber,
      amount,
    };
  }
}

/**
 * Generates a clean, professional, print-ready HTML Invoice document
 * with an embedded bKash / Nagad Instant Payment QR Code in the bottom-right corner.
 */
export async function generatePrintableInvoiceHtml(data: InvoiceData): Promise<string> {
  const qr = await generatePaymentQRCode(data.invoiceNumber, data.due > 0 ? data.due : data.total);

  return `
<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <title>Invoice #${data.invoiceNumber} — A R Green Garden</title>
  <style>
    @page { size: A4; margin: 16mm; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      margin: 0;
      padding: 24px;
      background: #ffffff;
      font-size: 13px;
      line-height: 1.5;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #15803d;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .brand h1 {
      margin: 0;
      color: #14532d;
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }
    .brand p {
      margin: 4px 0 0 0;
      color: #64748b;
      font-size: 11px;
    }
    .invoice-badge {
      text-align: right;
    }
    .invoice-badge h2 {
      margin: 0;
      color: #0f172a;
      font-size: 20px;
      font-weight: 800;
    }
    .invoice-badge p {
      margin: 2px 0 0 0;
      color: #64748b;
      font-size: 12px;
      font-family: monospace;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 24px;
      background: #f8fafc;
      padding: 16px;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
    }
    .meta-box h4 {
      margin: 0 0 6px 0;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #15803d;
      font-weight: 700;
    }
    .meta-box p {
      margin: 2px 0;
      font-size: 12px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    th {
      background: #14532d;
      color: #ffffff;
      text-align: left;
      padding: 10px 12px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    td {
      padding: 10px 12px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 12px;
    }
    tr:nth-child(even) td {
      background: #f8fafc;
    }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .font-mono { font-family: monospace; }
    .footer-grid {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 24px;
      align-items: start;
      margin-top: 16px;
    }
    .qr-card {
      border: 1.5px dashed #cbd5e1;
      border-radius: 16px;
      padding: 16px;
      background: #f8fafc;
      display: flex;
      gap: 16px;
      align-items: center;
    }
    .qr-card img {
      width: 110px;
      height: 110px;
      border-radius: 8px;
      background: #ffffff;
      padding: 4px;
      border: 1px solid #e2e8f0;
    }
    .qr-info h5 {
      margin: 0;
      font-size: 13px;
      font-weight: 800;
      color: #e11d48;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .qr-info p {
      margin: 4px 0;
      font-size: 11px;
      color: #475569;
      line-height: 1.4;
    }
    .totals-table {
      width: 100%;
    }
    .totals-table td {
      padding: 6px 12px;
      border: none;
    }
    .totals-table tr.grand-total td {
      border-top: 2px solid #0f172a;
      border-bottom: 2px solid #0f172a;
      font-weight: 800;
      font-size: 14px;
      color: #0f172a;
    }
    .totals-table tr.due-row td {
      font-weight: 800;
      color: #dc2626;
      font-size: 14px;
    }
    .terms {
      margin-top: 36px;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
      font-size: 10px;
      color: #94a3b8;
      display: flex;
      justify-content: space-between;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">
      <h1>🌿 A R GREEN GARDEN</h1>
      <p>Professional Landscape Architecture & Garden Management Studio</p>
      <p>42/A, Road 9/A, Dhanmondi, Dhaka • Hotline: 01883012641 • info@argreengarden.com</p>
    </div>
    <div class="invoice-badge">
      <h2>INVOICE</h2>
      <p>#${data.invoiceNumber}</p>
      <p>Date: ${data.date}</p>
    </div>
  </div>

  <div class="meta-grid">
    <div class="meta-box">
      <h4>Billed To (গ্রাহকের বিবরণ)</h4>
      <p><strong>${data.clientName}</strong></p>
      ${data.clientPhone ? `<p>Phone: ${data.clientPhone}</p>` : ""}
      ${data.clientAddress ? `<p>Site: ${data.clientAddress}</p>` : ""}
    </div>
    <div class="meta-box">
      <h4>Project Details (প্রজেক্ট বিবরণ)</h4>
      <p><strong>${data.projectName || "Custom Landscape Implementation"}</strong></p>
      <p>Status: Official Tax Invoice</p>
      <p>Payment Mode: bKash / Nagad / Bank / Card</p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th class="text-center" style="width: 40px;">#</th>
        <th>Item Description & Category</th>
        <th class="text-center" style="width: 80px;">Qty</th>
        <th class="text-right" style="width: 100px;">Rate (৳)</th>
        <th class="text-right" style="width: 120px;">Amount (৳)</th>
      </tr>
    </thead>
    <tbody>
      ${data.items
        .map(
          (it, idx) => `
        <tr>
          <td class="text-center font-mono">${idx + 1}</td>
          <td>
            <strong>${it.itemTitle}</strong>
            ${it.category ? `<br><small style="color: #64748b;">[${it.category}]</small>` : ""}
          </td>
          <td class="text-center font-mono">${it.quantity} ${it.unit || "unit"}</td>
          <td class="text-right font-mono">৳${it.unitPrice.toLocaleString()}</td>
          <td class="text-right font-mono"><strong>৳${it.amount.toLocaleString()}</strong></td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  </table>

  <div class="footer-grid">
    <!-- Bottom Left: Dynamic bKash / Nagad Merchant QR -->
    <div class="qr-card">
      ${qr.qrDataUrl ? `<img src="${qr.qrDataUrl}" alt="bKash Merchant Payment QR">` : ""}
      <div class="qr-info">
        <h5>📱 bKash / Nagad Scan & Pay</h5>
        <p>বিকাশ বা নগদ অ্যাপ ওপেন করে কিউআর কোড স্ক্যান করুন এবং সরাসরি বিল পরিশোধ করুন।</p>
        <p style="font-family: monospace; font-size: 11px; margin-top: 6px;">
          <strong>মার্চেন্ট নম্বর:</strong> 01883012641<br>
          <strong>রেফারেন্স:</strong> ${data.invoiceNumber}
        </p>
      </div>
    </div>

    <!-- Bottom Right: Calculation Summary -->
    <div>
      <table class="totals-table">
        <tr>
          <td>Subtotal:</td>
          <td class="text-right font-mono">৳${data.subtotal.toLocaleString()}</td>
        </tr>
        ${
          data.discount > 0
            ? `
        <tr style="color: #15803d;">
          <td>Discount Applied:</td>
          <td class="text-right font-mono">-৳${data.discount.toLocaleString()}</td>
        </tr>`
            : ""
        }
        <tr class="grand-total">
          <td>Grand Total:</td>
          <td class="text-right font-mono">৳${data.total.toLocaleString()}</td>
        </tr>
        <tr>
          <td>Paid / Advance:</td>
          <td class="text-right font-mono">৳${data.advance.toLocaleString()}</td>
        </tr>
        <tr class="due-row">
          <td>Balance Due:</td>
          <td class="text-right font-mono">৳${data.due.toLocaleString()}</td>
        </tr>
      </table>
    </div>
  </div>

  <div class="terms">
    <span>🌿 Thank you for partnering with A R Green Garden to cultivate your serene green oasis.</span>
    <span>Computer Generated Invoice • No Signature Required</span>
  </div>
</body>
</html>
  `;
}
