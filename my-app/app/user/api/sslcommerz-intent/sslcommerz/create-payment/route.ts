import { NextResponse } from "next/server";
import httpCall from "../../utils/httpCall";
import sslcommerzConfig from "../../config/sslcommerzConfig.json";
import paymentInitDataProcess from "../../utils/payment-init-data-process";

export async function POST(req: Request) {
  try {
    const { amount, tran_id } = await req.json();

    const data = {
      store_id: sslcommerzConfig.store_id,
      store_passwd: sslcommerzConfig.store_passwd,
      total_amount: amount,
      currency: "BDT",
      tran_id: tran_id || `TRAN_${Date.now()}`,
      success_url: `${sslcommerzConfig.base_url}/success`,
      fail_url: `${sslcommerzConfig.base_url}/fail`,
      cancel_url: `${sslcommerzConfig.base_url}/cancel`,
      cus_name: "Customer Name",
      cus_email: "customer@example.com",
      cus_add1: "Dhaka",
      cus_city: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: "01711111111",
      product_name: "Test Product",
      product_category: "General",
      product_profile: "general",
      shipping_method:"NO"
    };

    // Convert data to FormData
    const processedData = paymentInitDataProcess(data);

    // Send request to SSLCommerz
    const response = await httpCall({
      url: `${sslcommerzConfig.base_url}/gwprocess/v4/api.php`,
      method: "POST",
      data: processedData,
    });

    console.log("Response from SSLCommerz API:", response);

    if (response?.GatewayPageURL) {
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
