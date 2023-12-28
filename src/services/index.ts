import { AuthService } from "./auth.service";

const authServiceUrl: string = `${process.env.NEXT_PUBLIC_SERVICE_URL}`;

export const authService = new AuthService(authServiceUrl); 