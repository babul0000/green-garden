export interface SSLCommerzInitParams {
  totalAmount: number;
  tranId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress?: string;
  productName: string;
  productCategory?: string;
}

export interface SSLCommerzSessionResult {
  status: "SUCCESS" | "FAILED";
  gatewayPageURL?: string;
  failedReason?: string;
  sessionKey?: string;
}

export async function initSSLCommerzPayment(
  params: SSLCommerzInitParams
): Promise<SSLCommerzSessionResult> {
  const storeId = process.env.SSLCOMMERZ_STORE_ID || "babul6a924dc43dcb0";
  const storePass = process.env.SSLCOMMERZ_STORE_PASSWORD || "babul6a924dc43dcb0@ssl";
  const isSandbox = process.env.SSLCOMMERZ_IS_SANDBOX !== "false";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const gatewayUrl = isSandbox
    ? "https://sandbox.sslcommerz.com/gwprocess/v4/api.php"
    : "https://securepay.sslcommerz.com/gwprocess/v4/api.php";

  const payload = new URLSearchParams({
    store_id: storeId,
    store_passwd: storePass,
    total_amount: params.totalAmount.toFixed(2),
    currency: "BDT",
    tran_id: params.tranId,
    success_url: `${appUrl}/api/payments/sslcommerz/callback?status=success&tran_id=${params.tranId}`,
    fail_url: `${appUrl}/api/payments/sslcommerz/callback?status=fail&tran_id=${params.tranId}`,
    cancel_url: `${appUrl}/api/payments/sslcommerz/callback?status=cancel&tran_id=${params.tranId}`,
    ipn_url: `${appUrl}/api/payments/sslcommerz/ipn`,
    shipping_method: "NO",
    product_name: params.productName || "AR Green Garden Service",
    product_category: params.productCategory || "Landscape Architecture",
    product_profile: "general",
    cus_name: params.customerName || "Valued Client",
    cus_email: params.customerEmail || "client@argreengarden.com",
    cus_add1: params.customerAddress || "Dhaka, Bangladesh",
    cus_city: "Dhaka",
    cus_country: "Bangladesh",
    cus_phone: params.customerPhone || "01883012641",
  });

  try {
    const res = await fetch(gatewayUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: payload.toString(),
    });

    const data = await res.json();

    if (data.status === "SUCCESS" && data.GatewayPageURL) {
      return {
        status: "SUCCESS",
        gatewayPageURL: data.GatewayPageURL,
        sessionKey: data.sessionkey,
      };
    } else {
      return {
        status: "FAILED",
        failedReason: data.failedreason || "Gateway session initialization failed",
      };
    }
  } catch (error: any) {
    console.error("SSLCommerz Init Error:", error);
    return {
      status: "FAILED",
      failedReason: error?.message || "SSLCommerz server connection error",
    };
  }
}
