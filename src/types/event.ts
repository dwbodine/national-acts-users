export interface Seller {
    sellerId: number;
    name: string;
    hideInList?: boolean;
    isActive?: boolean;
}

export interface ShirtSales {
    size: string;
    total?: number;
}

export interface Ticket {
    orderId?: number;
    ticketId?: number;
    isActive?: boolean;
}

export interface Order {
    eventId: number;
    orderId: number;
    isActive: boolean;
    isDeleted: boolean;
    isRefunded: boolean;
    totalShirts?: number;
    revenueUsd: number;
    exchangeRate: number;
    currencySymbol: string;
    currencyAbbrev: string;
    tickets?: Ticket[]
}

export interface Venue {
    name: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    timezone?: string;
}

export interface VipEvent {
    eventId: number;
    title: string;
    venue?: Venue;
    eventDate: string;
    thumbnail?: string;
    ticketSocketUrl?: string;
    totalRevenue: number;
    totalTickets: number;
    shirtSales?: ShirtSales[];
    isActive: boolean;
    orders?: Order[];
    externalEventId?: number;
    externalSellerId?: number;
    externalThumbnail?: string;
    externalUrl?: string;
    externalVenue?: Venue;
    disableLinkButton?: boolean;
    disableLinkReason?: boolean;
    isVip: boolean;
    isDeleted: boolean;
    isExternal: boolean;
    hasShirtData: boolean;
    hasPhoneData: boolean;
    hasNonUSAOrders: boolean;    
}

export interface GetEventsResponse {
    events?: VipEvent[];
    eventError?: string;
}