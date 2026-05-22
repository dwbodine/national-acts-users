'use client';

import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Button, Col, Input, Row, SelectPicker, Table } from 'rsuite';
import { ItemDataType } from 'rsuite/esm/internals/types';

import PageHeader from '@/components/common/PageHeaderComponent';
import { ARTIST_SELLER_TYPE } from '@/constants';
import { useUpdatePageOrder } from '@/hooks/admin/useUpdatePageOrder';
import { useGetPagesByType } from '@/hooks/common/useGetPagesByType';
import { useGetPageTypes } from '@/hooks/common/useGetPageTypes';
import { setAllPages, setPageOrders } from '@/lib/adminDataSelectionSlice';
import {
  setPageSellerTypes,
  setReloadSellerPages,
  setSelectedPageType,
} from '@/lib/adminSelectionSlice';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { RootState } from '@/lib/store';
import { Page } from '@/types/public';
import { GetPagesResponse, GetPageTypesResponse, ModifyPageResponse } from '@/types/responses';

export default function AdminPageOrderIndex() {
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const currentAdminDataSelection = useSelector((state: RootState) => state.adminDataSelection);
  const dispatch = useDispatch();
  const { getPagesByType } = useGetPagesByType();
  const { getPageTypes } = useGetPageTypes();
  const { updatePageOrder } = useUpdatePageOrder();
  const { Column, HeaderCell, Cell } = Table;
  const [tableLoading, setTableLoading] = useState(true);
  const [currentPageMap, setCurrentPageMap] = useState<Map<number, Page> | undefined>(undefined);

  const setPageOrder = (pageId: number, pageOrder: number | undefined) => {
    if (
      !currentAdminDataSelection.pageOrders ||
      currentAdminDataSelection.pageOrders.length === 0 ||
      !pageId ||
      isNaN(pageId)
    ) {
      return;
    }
    const newPageOrder: number | undefined = pageOrder && !isNaN(pageOrder) ? pageOrder : undefined;
    if (!currentPageMap || !newPageOrder) {
      return;
    }
    const updatedPageMap = new Map<number, Page>(currentPageMap);
    const page = updatedPageMap.get(pageId);
    const oldPageOrder = page?.pageOrder;
    if (page && oldPageOrder && oldPageOrder !== newPageOrder) {
      const lastUpdate =
        oldPageOrder < newPageOrder
          ? moment().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss')
          : moment().format('YYYY-MM-DD HH:mm:ss');
      const newPage = {
        ...page,
        pageOrder: newPageOrder,
        lastUpdate: lastUpdate,
      };
      updatedPageMap.set(pageId, newPage);
      reorderPages(updatedPageMap);
    }
  };

  const getPagesSorted = (pageMap: Map<number, Page>) => {
    const mapArray = [...pageMap];
    const newMap = new Map(
      mapArray.sort(([key1, page1], [key2, page2]) => {
        if ((page1.pageOrder ?? 0) > (page2.pageOrder ?? 0)) {
          return 1;
        }
        if ((page1.pageOrder ?? 0) < (page2.pageOrder ?? 0)) {
          return -1;
        }
        if (page1.lastUpdate && page2.lastUpdate) {
          const p1 = moment(page1.lastUpdate).unix();
          const p2 = moment(page2.lastUpdate).unix();
          if (p1 < p2) {
            return 1;
          }
          if (p1 > p2) {
            return -1;
          }
        }
        if (key1 > key2) {
          return 1;
        }
        if (key2 < key1) {
          return -1;
        }
        return 0;
      }),
    );
    return newMap;
  };

  const reorderPages = useCallback(
    (pageOrders: Map<number, Page> | undefined) => {
      if (!pageOrders || pageOrders.size === 0) {
        return;
      }
      let pageMap = new Map<number, Page>(pageOrders);
      pageMap = getPagesSorted(pageMap);

      // Reset lastUpdate and pageOrder on all after sort
      const lastUpdate = moment().format('YYYY-MM-DD HH:mm:ss');
      const pageMapKeys = [...pageMap.keys()];
      pageMapKeys.forEach((key, i) => {
        const page = pageMap.get(key);
        if (page) {
          const newPage = {
            ...page,
            pageOrder: i + 1,
            lastUpdate,
          };
          pageMap.set(key, newPage);
        }
      });
      setCurrentPageMap(pageMap);
      const updatedPageOrders = Array.from(pageMap.values());

      dispatch(setPageOrders(updatedPageOrders));
    },
    [dispatch],
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentAdminSelection.pageSellerTypes === undefined) {
        setTableLoading(true);
        dispatch(setIsLoading(true));
        void getPageTypes(true).then((response: GetPageTypesResponse) => {
          if (!response.error && response.pageTypes) {
            dispatch(setPageSellerTypes(response.pageTypes));
            const artistPageType = response.pageTypes.find(
              (x) => x.pageTypeId === ARTIST_SELLER_TYPE,
            );
            if (artistPageType) {
              dispatch(setSelectedPageType(artistPageType));
            }
          }
        });
      } else if (
        currentAdminSelection.reloadPageSellers &&
        currentAdminSelection.selectedPageType !== undefined
      ) {
        dispatch(setReloadSellerPages(false));
        setTableLoading(true);
        dispatch(setIsLoading(true));
        void getPagesByType(currentAdminSelection.selectedPageType.pageTypeId).then(
          (response: GetPagesResponse) => {
            if (!response.error && response.pages) {
              const pageMap = new Map<number, Page>();
              response.pages.forEach((page) => {
                pageMap.set(page.pageId, page);
              });
              setCurrentPageMap(pageMap);
              reorderPages(pageMap);
            }
            dispatch(setIsLoading(false));
            setTableLoading(false);
          },
        );
      } else if (tableLoading) {
        setTimeout(() => {
          setTableLoading(false);
        }, 300);
      }
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [
    dispatch,
    currentAdminSelection.selectedPageType,
    currentAdminSelection.pageSellerTypes,
    currentAdminSelection.reloadPageSellers,
    tableLoading,
    getPageTypes,
    getPagesByType,
    reorderPages,
  ]);

  const onPageTypeChange = (pageTypeId: number | null) => {
    const pageType = currentAdminSelection?.pageSellerTypes?.find(
      (x) => x.pageTypeId === pageTypeId,
    );
    if (pageType) {
      dispatch(setSelectedPageType(pageType));
      dispatch(setReloadSellerPages(true));
      dispatch(setAllPages(undefined));
    }
  };

  const moveUp = (pageId: number) => {
    if (!pageId || isNaN(pageId) || !currentAdminDataSelection.pageOrders || !currentPageMap) {
      return;
    }
    const page = currentPageMap.get(pageId);
    if (page && page.pageOrder) {
      const updatedPageMap = new Map<number, Page>(currentPageMap);
      const order = page.pageOrder;
      if (order > 1) {
        const newPage = {
          ...page,
          pageOrder: order - 1,
          lastUpdate: moment().format('YYYY-MM-DD HH:mm:ss'),
        };
        updatedPageMap.set(pageId, newPage);
        reorderPages(updatedPageMap);
      }
    }
  };

  const moveDown = (pageId: number) => {
    if (!pageId || isNaN(pageId) || !currentAdminDataSelection.pageOrders || !currentPageMap) {
      return;
    }
    const page = currentPageMap.get(pageId);
    if (page && page.pageOrder) {
      const updatedPageMap = new Map<number, Page>(currentPageMap);
      const order = page.pageOrder;
      if (order < updatedPageMap.size) {
        const newPage = {
          ...page,
          pageOrder: order + 1,
          lastUpdate: moment().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
        };
        updatedPageMap.set(pageId, newPage);
        reorderPages(updatedPageMap);
      }
    }
  };

  const onSubmit = () => {
    if (!currentAdminDataSelection.pageOrders) {
      return;
    }
    const pages = [...currentAdminDataSelection.pageOrders.values()];
    dispatch(setIsLoading(true));
    void updatePageOrder(pages).then((response: ModifyPageResponse) => {
      if (response.success) {
        dispatch(setReloadSellerPages(true));
        dispatch(setAllPages(undefined));
        toast.success('Page order save succeeded');
      } else if (response.error) {
        dispatch(setIsLoading(false));
        toast.error(response.error);
      } else {
        dispatch(setIsLoading(false));
        toast.error('Page order save failed');
      }
    });
  };

  const pageTypeName = currentAdminSelection?.selectedPageType?.pageTypeName;
  const pageTypeId = currentAdminSelection?.selectedPageType?.pageTypeId ?? 0;

  const pageTypeList: ItemDataType<number>[] = currentAdminSelection?.pageSellerTypes
    ? currentAdminSelection.pageSellerTypes.map((pageType) => ({
        label: `${pageType.pageTypeName}`,
        value: pageType.pageTypeId,
      }))
    : [];

  const pages = currentAdminDataSelection?.pageOrders
    ? [...currentAdminDataSelection.pageOrders.values()]
    : [];

  const pageHeader = `Manage ${pageTypeName} Order`;

  return (
    <>
      <PageHeader pageTitle={pageHeader} />
      <Col xs={24} className="admin-container">
        <Row>
          <Col>
            <span>Select page type:</span>
            <SelectPicker
              className="admin-seller-select-value"
              menuAutoWidth={true}
              value={pageTypeId}
              data={pageTypeList}
              size="lg"
              onChange={(ptId) => onPageTypeChange(ptId)}
              cleanable={false}
              searchable={false}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={24}>
            <Table autoHeight data={pages} bordered cellBordered loading={tableLoading}>
              <Column flexGrow={1}>
                <HeaderCell>Order</HeaderCell>
                <Cell className="page-order-cell">
                  {(rowData) => (
                    <Input
                      className="page-order-input"
                      id={`${rowData['pageId']}`}
                      value={`${rowData['pageOrder']}`}
                      onChange={(value) =>
                        setPageOrder(parseInt(`${rowData['pageId']}`), parseInt(value))
                      }
                      onBlur={() => reorderPages(currentPageMap)}
                    />
                  )}
                </Cell>
              </Column>
              <Column flexGrow={1}>
                <HeaderCell> </HeaderCell>
                <Cell>
                  {(rowData: Page) => (
                    <>
                      <span>
                        <FaArrowUp
                          className="admin-up-down-button"
                          onClick={() => moveUp(parseInt(`${rowData['pageId']}`))}
                          title="Move Up"
                        />
                      </span>
                      <span>
                        <FaArrowDown
                          className="admin-up-down-button"
                          onClick={() => moveDown(parseInt(`${rowData['pageId']}`))}
                          title="Move Down"
                        />
                      </span>
                    </>
                  )}
                </Cell>
              </Column>
              <Column flexGrow={11}>
                <HeaderCell>Page</HeaderCell>
                <Cell dataKey="title"></Cell>
              </Column>
            </Table>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button onClick={onSubmit}>Save</Button>
          </Col>
        </Row>
      </Col>
    </>
  );
}
