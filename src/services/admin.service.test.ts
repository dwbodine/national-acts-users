import { beforeEach, describe, expect, it, vi } from 'vitest';

import getAuthorizationHeader from '@/utils/getAuthorizationHeader';

const adminServiceMocks = vi.hoisted(() => ({
  create: vi.fn(),
  get: vi.fn(),
  post: vi.fn(),
}));

vi.mock('axios', () => ({
  default: {
    create: adminServiceMocks.create,
  },
}));

vi.mock('@/utils/getAuthorizationHeader', () => ({
  default: vi.fn(),
}));

import { AdminService } from './admin.service';

const createService = () => new AdminService('https://admin.example.com');

describe('AdminService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    adminServiceMocks.create.mockReturnValue({
      get: adminServiceMocks.get,
      post: adminServiceMocks.post,
    });
    process.env['NEXT_PUBLIC_API_KEY'] = 'public-api-key';
    vi.mocked(getAuthorizationHeader).mockReturnValue({
      Authorization: 'Bearer admin-token',
      'Content-Type': 'application/json',
    } as never);
  });

  it('handles admin service success paths and search-term URLs', async () => {
    adminServiceMocks.get
      .mockResolvedValueOnce({ data: [{ faqId: 1 }], status: 200 })
      .mockResolvedValueOnce({ data: undefined, status: 200 })
      .mockResolvedValueOnce({ data: [{ pageId: 3 }], status: 200 })
      .mockResolvedValueOnce({ data: [{ venueId: 4 }], status: 200 })
      .mockResolvedValueOnce({ data: undefined, status: 200 })
      .mockResolvedValueOnce({ data: [{ countryId: 5 }], status: 200 })
      .mockResolvedValueOnce({ data: [{ accountId: 6 }], status: 200 })
      .mockResolvedValueOnce({ data: [{ sellerId: 7 }], status: 200 });
    adminServiceMocks.post
      .mockResolvedValueOnce({ status: 200 })
      .mockResolvedValueOnce({ status: 200 })
      .mockResolvedValueOnce({ status: 200 })
      .mockResolvedValueOnce({ status: 200 })
      .mockResolvedValueOnce({ data: { pageId: 1 }, status: 200 })
      .mockResolvedValueOnce({ data: undefined, status: 201 })
      .mockResolvedValueOnce({ data: { ok: true }, status: 200 })
      .mockResolvedValueOnce({ data: { venueId: 10 }, status: 200 })
      .mockResolvedValueOnce({ status: 200 })
      .mockResolvedValueOnce({ data: { sellerId: 11 }, status: 200 });

    const service = createService();

    await expect(service.getAllFaqs()).resolves.toEqual({
      faqs: [{ faqId: 1 }],
      statusCode: 200,
    });
    await expect(service.getAllFaqCategories()).resolves.toEqual({
      categories: undefined,
      statusCode: 200,
    });
    await expect(service.updateFaq({ faqId: 1 } as never)).resolves.toEqual({
      statusCode: 200,
      success: true,
    });
    await expect(service.deleteFaq(1)).resolves.toEqual({
      statusCode: 200,
      success: true,
    });
    await expect(service.moveFaqUp(1)).resolves.toEqual({
      statusCode: 200,
      success: true,
    });
    await expect(service.moveFaqDown(1)).resolves.toEqual({
      statusCode: 200,
      success: true,
    });
    await expect(service.getAllPages()).resolves.toEqual({
      pages: [{ pageId: 3 }],
      statusCode: 200,
    });
    await expect(service.updatePage({ pageId: 4 } as never)).resolves.toEqual({
      statusCode: 200,
      success: true,
      updatedPage: { pageId: 1 },
    });
    await expect(service.updatePageOrder([{ pageId: 5 }] as never)).resolves.toEqual({
      statusCode: 201,
      success: false,
      updatedPage: undefined,
    });
    await expect(service.updateSiteSettings([{ key: 'site' }] as never)).resolves.toEqual({
      statusCode: 200,
      success: true,
    });
    await expect(service.getAllVenues('VIP room')).resolves.toEqual({
      statusCode: 200,
      venues: [{ venueId: 4 }],
    });
    await expect(service.getAllVenues()).resolves.toEqual({
      statusCode: 200,
      venues: undefined,
    });
    await expect(service.getAllCountries()).resolves.toEqual({
      countries: [{ countryId: 5 }],
      statusCode: 200,
    });
    await expect(service.updateVenue({ venueId: 7 } as never)).resolves.toEqual({
      statusCode: 200,
      success: true,
      updatedVenue: { venueId: 10 },
    });
    await expect(service.deleteVenue(7)).resolves.toEqual({
      statusCode: 200,
      success: true,
    });
    await expect(service.getTicketSocketAccounts()).resolves.toEqual({
      accounts: [{ accountId: 6 }],
      statusCode: 200,
    });
    await expect(service.getSellers()).resolves.toEqual({
      sellers: [{ sellerId: 7 }],
      statusCode: 200,
    });
    await expect(service.updateSeller({ sellerId: 8 } as never)).resolves.toEqual({
      statusCode: 200,
      success: true,
      updatedSeller: { sellerId: 11 },
    });

    expect(adminServiceMocks.get).toHaveBeenNthCalledWith(4, '/admin/venues?search=VIP%20room', {
      headers: {
        Authorization: 'Bearer admin-token',
        'Content-Type': 'application/json',
      },
    });
    expect(adminServiceMocks.get).toHaveBeenNthCalledWith(5, '/admin/venues', {
      headers: {
        Authorization: 'Bearer admin-token',
        'Content-Type': 'application/json',
      },
    });
  });

  it('returns admin service errors and falsey update responses', async () => {
    adminServiceMocks.get
      .mockRejectedValueOnce({ response: { status: 500 } })
      .mockRejectedValueOnce({ message: 'categories failed', response: { status: 503 } })
      .mockRejectedValueOnce({ response: { status: 401 } })
      .mockRejectedValueOnce({ message: 'venues failed', response: { status: 404 } })
      .mockRejectedValueOnce({ response: { status: 422 } })
      .mockRejectedValueOnce({ message: 'accounts failed', response: { status: 423 } })
      .mockRejectedValueOnce({ response: { status: 424 } })
      .mockRejectedValueOnce({ message: 'sellers failed', response: { status: 425 } });
    adminServiceMocks.post
      .mockRejectedValueOnce({ response: { status: 500 } })
      .mockRejectedValueOnce({ message: 'delete failed', response: { status: 501 } })
      .mockRejectedValueOnce({ response: { status: 502 } })
      .mockRejectedValueOnce({ message: 'down failed', response: { status: 503 } })
      .mockRejectedValueOnce({ response: { status: 504 } })
      .mockRejectedValueOnce({ message: 'page order failed', response: { status: 505 } })
      .mockResolvedValueOnce({ data: undefined, status: 200 })
      .mockRejectedValueOnce({ response: { status: 409 } })
      .mockRejectedValueOnce({ response: { status: 506 } })
      .mockRejectedValueOnce({ message: 'venue delete failed', response: { status: 507 } })
      .mockRejectedValueOnce({ response: { status: 508 } });

    const service = createService();

    await expect(service.getAllFaqs()).resolves.toEqual({
      error: 'Unknown error while fetching faqs - please contact your administrator',
      statusCode: 500,
    });
    await expect(service.getAllFaqCategories()).resolves.toEqual({
      error: 'categories failed',
      statusCode: 503,
    });
    await expect(service.updateFaq({ faqId: 1 } as never)).resolves.toEqual({
      error: 'Unknown error while updating FAQ - please contact your administrator',
      statusCode: 500,
    });
    await expect(service.deleteFaq(1)).resolves.toEqual({
      error: 'delete failed',
      statusCode: 501,
    });
    await expect(service.moveFaqUp(1)).resolves.toEqual({
      error: 'Unknown error while moving up FAQ - please contact your administrator',
      statusCode: 502,
    });
    await expect(service.moveFaqDown(1)).resolves.toEqual({
      error: 'down failed',
      statusCode: 503,
    });
    await expect(service.getAllPages()).resolves.toEqual({
      error: 'Unknown error while fetching pages - please contact your administrator',
      statusCode: 401,
    });
    await expect(service.updatePage({ pageId: 4 } as never)).resolves.toEqual({
      error: 'Unknown error while updating page - please contact your administrator',
      statusCode: 504,
    });
    await expect(service.updatePageOrder([{ pageId: 5 }] as never)).resolves.toEqual({
      error: 'page order failed',
      statusCode: 505,
    });
    await expect(service.updateSiteSettings([{ key: 'site' }] as never)).resolves.toEqual({
      statusCode: 200,
      success: false,
    });
    await expect(service.updateSiteSettings([{ key: 'site-2' }] as never)).resolves.toEqual({
      error: 'Unknown error while updating site setting - please contact your administrator',
      statusCode: 409,
    });
    await expect(service.getAllVenues('VIP room')).resolves.toEqual({
      error: 'venues failed',
      statusCode: 404,
    });
    await expect(service.getAllCountries()).resolves.toEqual({
      error: 'Unknown error while fetching countries - please contact your administrator',
      statusCode: 422,
    });
    await expect(service.updateVenue({ venueId: 7 } as never)).resolves.toEqual({
      error: 'Unknown error while updating venue - please contact your administrator',
      statusCode: 506,
    });
    await expect(service.deleteVenue(7)).resolves.toEqual({
      error: 'venue delete failed',
      statusCode: 507,
    });
    await expect(service.getTicketSocketAccounts()).resolves.toEqual({
      error: 'accounts failed',
      statusCode: 423,
    });
    await expect(service.getSellers()).resolves.toEqual({
      error: 'Unknown error while fetching sellers - please contact your administrator',
      statusCode: 424,
    });
    await expect(service.updateSeller({ sellerId: 8 } as never)).resolves.toEqual({
      error: 'Unknown error while updating seller - please contact your administrator',
      statusCode: 508,
    });
  });
});
