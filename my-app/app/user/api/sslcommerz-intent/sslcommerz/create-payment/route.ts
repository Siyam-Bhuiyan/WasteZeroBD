import { NextResponse } from "next/server";
import httpCall from "../../utils/httpCall";
import sslcommerzConfig from "../../config/sslcommerzConfig.json";
import paymentInitDataProcess from "../../utils/payment-init-data-process";
import { db } from "@/utils/db/dbConfig";
import { Payment } from "@/utils/db/schema";

export async function POST(req: Request) {
  try {
    const { amount, tran_id, userEmail, userName, type } = await req.json();
    const transactionId = tran_id || `TRAN_${Date.now()}`;
    const base_url = sslcommerzConfig.base_url || "http://localhost:3000";

    const data = {
      store_id: sslcommerzConfig.store_id,
      store_passwd: sslcommerzConfig.store_passwd,
      total_amount: amount,
      currency: "BDT",
      tran_id: transactionId,
      success_url: `http://localhost:3000/user/certificate/status?success=true`,
      fail_url: `${base_url}/fail`,
      cancel_url: `${base_url}/cancel`,
      cus_name: userName,
      cus_email: userEmail,
      shipping_method:"NO",
      cus_add1: "Dhaka",
      cus_city: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: "01711111111",
      product_name: "Certificate",
      product_category: "General",
      product_profile: "general",
    };

    const processedData = paymentInitDataProcess(data);

    const response = await httpCall({
      url: `${sslcommerzConfig.base_url}/gwprocess/v4/api.php`,
      method: "POST",
      data: processedData,
    });

    if (response?.GatewayPageURL) {
      await db.insert(Payment).values({
        transactionId,
        userEmail,
        userName,
        type: type || "certificate",
        amount,
        date: new Date(),
      });

      return NextResponse.json({ success: true, url: response.GatewayPageURL });
    } else {
      throw new Error(response.failedreason || "Unknown error from SSLCommerz");
    }
  } catch (error: any) {
    console.error("Create Payment Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
