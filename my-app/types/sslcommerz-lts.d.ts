declare module "sslcommerz-lts" {
    interface InitResponse {
      GatewayPageURL: string;
      status: string;
    }
  
    interface ValidateResponse {
      status: string;
      tran_id: string;
      val_id: string;
      amount: number;
      currency: string;
      bank_tran_id: string;
      // Add more fields as needed
    }
  
    interface RefundResponse {
      status: string;
      refund_ref_id: string;
      refund_status: string;
      // Add more fields as needed
    }
  
    class SSLCommerzPayment {
      constructor(store_id: string, store_passwd: string, live?: boolean);
  
      init(data: Record<string, any>): Promise<InitResponse>;
      validate(data: { val_id: string }): Promise<ValidateResponse>;
      initiateRefund(data: Record<string, any>): Promise<RefundResponse>;
      refundQuery(data: { refund_ref_id: string }): Promise<RefundResponse>;
      transactionQueryByTransactionId(data: { tran_id: string }): Promise<ValidateResponse>;
      transactionQueryBySessionId(data: { sessionkey: string }): Promise<ValidateResponse>;
    }
  
    export = SSLCommerzPayment;
  }
  