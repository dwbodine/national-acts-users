import { beforeEach, describe, expect, it, vi } from 'vitest';

const publicServiceMocks = vi.hoisted(() => ({
  create: vi.fn(),
  get: vi.fn(),
  post: vi.fn(),
}));

vi.mock('axios', () => ({
  default: {
    create: publicServiceMocks.create,
  },
}));

import { ImageType, MINIMUM_UNIX_TIMESTAMP } from '@/constants';

import { PublicService } from './public.service';

const createService = () => new PublicService('https://public.example.com');

describe('PublicService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    publicServiceMocks.create.mockReturnValue({
      get: publicServiceMocks.get,
      post: publicServiceMocks.post,
    });
    process.env['NEXT_PUBLIC_API_KEY'] = 'public-api-key';
  });

  it('builds public event URLs and maps array responses', async () => {
    publicServiceMocks.get
      .mockResolvedValueOnce({ data: [{ eventId: 1 }], status: 200 })
      .mockResolvedValueOnce({ data: undefined, status: 200 })
      .mockResolvedValueOnce({ data: [], status: 200 })
      .mockResolvedValueOnce({ data: [], status: 200 })
      .mockResolvedValueOnce({ data: ['seller'], status: 200 })
      .mockResolvedValueOnce({ data: undefined, status: 200 })
      .mockResolvedValueOnce({ data: ['page-type'], status: 200 })
      .mockResolvedValueOnce({ data: [], status: 200 })
      .mockResolvedValueOnce({ data: ['page'], status: 200 })
      .mockResolvedValueOnce({ data: [], status: 200 })
      .mockResolvedValueOnce({ data: ['setting'], status: 200 })
      .mockResolvedValueOnce({ data: [], status: 200 });

    const service = createService();

    await expect(service.getEvents()).resolves.toEqual({
      events: [{ eventId: 1 }],
      statusCode: 200,
    });
    await expect(
      service.getEvents(MINIMUM_UNIX_TIMESTAMP - 5, MINIMUM_UNIX_TIMESTAMP - 10, 3),
    ).resolves.toEqual({
      events: [],
      statusCode: 200,
    });
    await expect(service.getEvents(0, MINIMUM_UNIX_TIMESTAMP + 100, 0)).resolves.toEqual({
      events: [],
      statusCode: 200,
    });
    await expect(service.getEvents(0, 0, 4)).resolves.toEqual({
      events: [],
      statusCode: 200,
    });
    await expect(service.getSellers()).resolves.toEqual({
      sellers: ['seller'],
      statusCode: 200,
    });
    await expect(service.getSellers()).resolves.toEqual({
      sellers: [],
      statusCode: 200,
    });
    await expect(service.getPageTypes()).resolves.toEqual({
      pageTypes: ['page-type'],
      statusCode: 200,
    });
    await expect(service.getPageTypes(true)).resolves.toEqual({
      pageTypes: [],
      statusCode: 200,
    });
    await expect(service.getPagesByType(4)).resolves.toEqual({
      pages: ['page'],
      statusCode: 200,
    });
    await expect(service.getPagesByType(5)).resolves.toEqual({
      pages: [],
      statusCode: 200,
    });
    await expect(service.getSiteSettings()).resolves.toEqual({
      settings: ['setting'],
      statusCode: 200,
    });
    await expect(service.getSiteSettings()).resolves.toEqual({
      settings: [],
      statusCode: 200,
    });

    expect(publicServiceMocks.get).toHaveBeenNthCalledWith(1, '/public/events', {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'public-api-key',
      },
    });
    expect(publicServiceMocks.get).toHaveBeenNthCalledWith(
      2,
      `/public/events?start=${MINIMUM_UNIX_TIMESTAMP}&end=${
        MINIMUM_UNIX_TIMESTAMP + 7 * 24 * 60 * 60
      }&sellerId=3`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'public-api-key',
        },
      },
    );
    expect(publicServiceMocks.get).toHaveBeenNthCalledWith(
      3,
      `/public/events?end=${MINIMUM_UNIX_TIMESTAMP + 100}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'public-api-key',
        },
      },
    );
    expect(publicServiceMocks.get).toHaveBeenNthCalledWith(4, '/public/events?sellerId=4', {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'public-api-key',
      },
    });
    expect(publicServiceMocks.get).toHaveBeenNthCalledWith(7, '/public/page_types', {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'public-api-key',
      },
    });
    expect(publicServiceMocks.get).toHaveBeenNthCalledWith(8, '/public/page_seller_types', {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'public-api-key',
      },
    });
  });

  it('returns public-service errors with fallback messages', async () => {
    publicServiceMocks.get
      .mockRejectedValueOnce({ response: { status: 500 } })
      .mockRejectedValueOnce({ message: 'seller lookup failed', response: { status: 502 } })
      .mockRejectedValueOnce({ response: { status: 503 } })
      .mockRejectedValueOnce({ message: 'pages failed', response: { status: 504 } })
      .mockRejectedValueOnce({ response: { status: 401 } });

    const service = createService();

    await expect(service.getEvents(1, 2, 0)).resolves.toEqual({
      error: 'Unknown error while fetching events - please contact your administrator',
      statusCode: 500,
    });
    await expect(service.getSellers()).resolves.toEqual({
      error: 'seller lookup failed',
      statusCode: 502,
    });
    await expect(service.getPageTypes()).resolves.toEqual({
      error: 'Unknown error while fetching page types - please contact your administrator',
      statusCode: 503,
    });
    await expect(service.getPagesByType(3)).resolves.toEqual({
      error: 'pages failed',
      statusCode: 504,
    });
    await expect(service.getSiteSettings()).resolves.toEqual({
      error: 'Unknown error while fetching settings - please contact your administrator',
      statusCode: 401,
    });
  });

  it('uploads image files and handles invalid or failed uploads', async () => {
    const append = vi.fn();
    const formData = {
      append,
    };
    vi.stubGlobal(
      'FormData',
      vi.fn(function (this: unknown) {
        return formData;
      }),
    );

    const file = {
      name: 'poster.png',
    } as File;

    publicServiceMocks.post
      .mockResolvedValueOnce({ data: 'uploaded.png' })
      .mockRejectedValueOnce(new Error('upload failed'));

    const service = createService();

    await expect(service.uploadImageFile(file, ImageType.THUMBNAILS)).resolves.toBe('uploaded.png');
    await expect(service.uploadImageFile(file, ImageType.THUMBNAILS)).resolves.toBeUndefined();
    await expect(
      service.uploadImageFile(undefined as never, ImageType.THUMBNAILS),
    ).resolves.toBeUndefined();
    await expect(
      service.uploadImageFile({ name: '' } as File, ImageType.THUMBNAILS),
    ).resolves.toBeUndefined();
    await expect(service.uploadImageFile(file, undefined as never)).resolves.toBeUndefined();

    expect(append).toHaveBeenCalledWith('tempFile', file);
    expect(publicServiceMocks.post).toHaveBeenCalledWith(
      `/public/uploadImage/${ImageType.THUMBNAILS.valueOf()}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-api-key': 'public-api-key',
        },
      },
    );
  });
});
