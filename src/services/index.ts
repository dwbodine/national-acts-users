import { AuthService } from "./auth.service";
import { EventService } from "./event.service";

const baseServiceUrl: string = `${process.env.NEXT_PUBLIC_SERVICE_URL}`;

export const authService = new AuthService(baseServiceUrl); 
export const eventService = new EventService(baseServiceUrl);