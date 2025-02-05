import { AdminService } from './admin.service';
import { AuthService } from './auth.service';
import { EventService } from './event.service';
import { PublicService } from './public.service';
import { UserService } from './user.service';

const baseServiceUrl: string = `${process.env.NEXT_PUBLIC_SERVICE_URL}`;

export const authService = new AuthService(baseServiceUrl);
export const eventService = new EventService(baseServiceUrl);
export const publicService = new PublicService(baseServiceUrl);
export const userService = new UserService(baseServiceUrl);
export const adminService = new AdminService(baseServiceUrl);
