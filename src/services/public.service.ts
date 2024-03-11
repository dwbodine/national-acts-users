import axios, { AxiosInstance } from "axios";
import { GetSellersResponse, Seller } from "../types/event";

export class PublicService {
  protected readonly instance: AxiosInstance;
  
  public constructor(url: string) {
    this.instance = axios.create({
      baseURL: url,
      timeout: 30000,
      timeoutErrorMessage: "Time out!",
    });
  }

  getSellers = async (): Promise<GetSellersResponse> => {
    let url = `/public/sellers`;

    let sellersResponse: GetSellersResponse = {
      sellers: undefined,
      sellersError: undefined
    };

    const headers = {
        'Content-Type': 'application/json',
        'x-api-key': `${process.env.NEXT_PUBLIC_API_KEY}`
    };

    return this.instance
      .get(url, {
        headers: headers
      })
      .then((res) => {
        const sellers = res.data;
        sellersResponse.sellers = sellers.length ? sellers as Seller[] : [];
        return sellersResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = "";
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage = "Unknown error while fetching sellers - please contact your administrator";
        }
        sellersResponse.sellersError = errorMessage;
        return sellersResponse;
      });
  };


}