import FormData from "form-data";

const paymentInitDataProcess = (data: Record<string, any>) => {
  const formData = new FormData();
  
  for (const key in data) {
    if (data[key] !== undefined && data[key] !== null) {
      formData.append(key, data[key]);
    }
  }
  
  return formData;
};

export default paymentInitDataProcess;
