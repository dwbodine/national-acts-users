import { eventService } from "../../services";
import { ModifyOrderResponse, Order } from "@/types/event";

export const useUpdateOrder = () => {
  const updateOrder = async (orderToUpdate: Order): Promise<ModifyOrderResponse> => {
    let response: ModifyOrderResponse = {
        success: false,
        orderError: undefined
    };
    response = await eventService.updateOrder(orderToUpdate);
    return response;    
  };

  return { updateOrder };
};