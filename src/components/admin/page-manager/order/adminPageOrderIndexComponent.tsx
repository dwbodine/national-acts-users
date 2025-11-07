'use client';

import { Button, Col, Row } from 'rsuite';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import {
  GetPageTypesResponse,
  GetPagesResponse,
  ModifyPageResponse,
} from '@/types/responses';
import { SelectPicker, Table } from 'rsuite';
import {
  setPageOrders,
  setPageTypes,
  setReloadPages,
  setSelectedPageType,
} from '@/lib/adminSelectionSlice';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ARTIST_SELLER_TYPE } from '@/constants';
import AdminListHomeButton from '../../adminListHomeButton';
import { ItemDataType } from 'rsuite/esm/internals/types';
import { Page } from '@/types/public';
import { RootState } from '@/lib/store';
import moment from 'moment';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { toast } from 'react-toastify';
import { useGetPageTypes } from '@/hooks/common/useGetPageTypes';
import { useGetPagesByType } from '@/hooks/common/useGetPagesByType';
import { useUpdatePageOrder } from '@/hooks/admin/useUpdatePageOrder';

export default function AdminPageOrderIndex() {
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const dispatch = useDispatch();
  const { getPagesByType } = useGetPagesByType();
  const { getPageTypes } = useGetPageTypes();
  const { updatePageOrder } = useUpdatePageOrder();
  const { Column, HeaderCell, Cell } = Table;
  const [tableLoading, setTableLoading] = useState(true);

  const setPageOrder = (pageId: number, pageOrder: number | undefined) => {
    if (
      !currentAdminSelection.pageOrders ||
      currentAdminSelection.pageOrders.size === 0 ||
      !pageId ||
      isNaN(pageId)
    ) {
      return;
    }
    const newPageOrder: number | undefined =
      pageOrder && !isNaN(pageOrder) ? pageOrder : undefined;
    const pageMap = new Map<number, Page>(currentAdminSelection.pageOrders);
    const page = pageMap.get(pageId);
    if (page && page.pageOrder !== newPageOrder) {
      page.pageOrder = newPageOrder;
      pageMap.set(pageId, page);
      dispatch(setPageOrders(pageMap));
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
          page.pageOrder = i + 1;
          page.lastUpdate = lastUpdate;
          pageMap.set(key, page);
        }
      });

      dispatch(setPageOrders(pageMap));
    },
    [dispatch],
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentAdminSelection.pageTypes === undefined) {
        setTableLoading(true);
        dispatch(setIsLoading(true));
        void getPageTypes(true).then((response: GetPageTypesResponse) => {
          if (!response.error && response.pageTypes) {
            dispatch(setPageTypes(response.pageTypes));
            const artistPageType = response.pageTypes.find(
              (x) => x.pageTypeId === ARTIST_SELLER_TYPE,
            );
            if (artistPageType) {
              dispatch(setSelectedPageType(artistPageType));
            }
          }
        });
      } else if (
        currentAdminSelection.reloadPages &&
        currentAdminSelection.selectedPageType !== undefined
      ) {
        dispatch(setReloadPages(false));
        setTableLoading(true);
        dispatch(setIsLoading(true));
        void getPagesByType(currentAdminSelection.selectedPageType.pageTypeId).then(
          (response: GetPagesResponse) => {
            if (!response.error && response.pages) {
              const pageMap = new Map<number, Page>();
              response.pages.forEach((page) => {
                pageMap.set(page.pageId, page);
              });
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
    currentAdminSelection.reloadPages,
    currentAdminSelection.selectedPageType,
    currentAdminSelection.pageTypes,
    tableLoading,
    getPageTypes,
    getPagesByType,
    reorderPages,
  ]);

  const onPageTypeChange = (pageTypeId: number | null) => {
    const pageType = currentAdminSelection?.pageTypes?.find(
      (x) => x.pageTypeId === pageTypeId,
    );
    if (pageType) {
      dispatch(setSelectedPageType(pageType));
      dispatch(setReloadPages(true));
    }
  };

  const moveUp = (pageId: number) => {
    if (!pageId || isNaN(pageId) || !currentAdminSelection.pageOrders) {
      return;
    }
    const pageMap = new Map<number, Page>(currentAdminSelection.pageOrders);
    const page = pageMap.get(pageId);
    if (page && page.pageOrder) {
      const order = page.pageOrder;
      if (order > 1) {
        page.pageOrder = order - 1;
        pageMap.set(pageId, page);
        reorderPages(pageMap);
      }
    }
  };

  const moveDown = (pageId: number) => {
    if (!pageId || isNaN(pageId) || !currentAdminSelection.pageOrders) {
      return;
    }
    const pageMap = new Map<number, Page>(currentAdminSelection.pageOrders);
    const page = pageMap.get(pageId);
    if (page && page.pageOrder) {
      const order = page.pageOrder;
      if (order < pageMap.size) {
        page.pageOrder = order + 1;
        pageMap.set(pageId, page);
        reorderPages(pageMap);
      }
    }
  };

  const onSubmit = () => {
    if (!currentAdminSelection.pageOrders) {
      return;
    }
    const pages = [...currentAdminSelection.pageOrders.values()];
    dispatch(setIsLoading(true));
    void updatePageOrder(pages).then((response: ModifyPageResponse) => {
      if (response.success) {
        dispatch(setReloadPages(true));
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

  const pageTypeList: ItemDataType<number>[] = currentAdminSelection?.pageTypes
    ? currentAdminSelection.pageTypes.map((pageType) => ({
        label: `${pageType.pageTypeName}`,
        value: pageType.pageTypeId,
      }))
    : [];

  const pages = currentAdminSelection?.pageOrders
    ? [...currentAdminSelection.pageOrders.values()]
    : [];

  return (
    <Col className="admin-container">
      <Row>
        <Col>
          <AdminListHomeButton />
        </Col>
      </Row>
      <Row>
        <Col>
          <h3>Manage {pageTypeName} Order</h3>
        </Col>
      </Row>
      <Row>
        <Col>
          <label className="mt-4">Select page type:</label>
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
        <Col>
          <Table autoHeight data={pages} bordered cellBordered loading={tableLoading}>
            <Column flexGrow={1}>
              <HeaderCell>Order</HeaderCell>
              <Cell className="page-order-cell">
                {(rowData) => (
                  <input
                    className="page-order-input"
                    id={`${rowData['pageId']}`}
                    type="text"
                    value={`${rowData['pageOrder']}`}
                    onChange={(e) =>
                      setPageOrder(
                        parseInt(`${rowData['pageId']}`),
                        parseInt(e.currentTarget.value),
                      )
                    }
                    onBlur={() => reorderPages(currentAdminSelection.pageOrders)}
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
                        onClick={() => moveUp(parseInt(`${rowData.pageId}`))}
                        title="Move Up"
                      />
                    </span>
                    <span>
                      <FaArrowDown
                        className="admin-up-down-button"
                        onClick={() => moveDown(parseInt(`${rowData.pageId}`))}
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
          <Button onClick={onSubmit}>Save</Button> <AdminListHomeButton />
        </Col>
      </Row>
    </Col>
  );
}
