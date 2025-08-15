"use client";

import { Button, Col, Row } from 'react-bootstrap';
import { ChangeEvent, useEffect, useState } from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { GetPageTypesResponse, GetPagesResponse, ModifyPageResponse } from '@/types/responses';
import { SelectPicker, Table } from 'rsuite';
import { setAllPages, setPageTypes, setReloadPages, setSelectedPageType } from '@/lib/adminSelectionSlice';
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

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentAdminSelection.pageTypes === undefined) {
        setTableLoading(true);
        dispatch(setIsLoading(true));
        getPageTypes(true).then((response: GetPageTypesResponse) => {
          if (!response.error && response.pageTypes) {
            dispatch(setPageTypes(response.pageTypes));
            const artistPageType = response.pageTypes.find(x => x.pageTypeId === ARTIST_SELLER_TYPE);
            if (artistPageType) {
              dispatch(setSelectedPageType(artistPageType));
            }
          }
        });
      } else if (currentAdminSelection.reloadPages && currentAdminSelection.selectedPageType !== undefined) {
        dispatch(setReloadPages(false));
        setTableLoading(true);
        dispatch(setIsLoading(true));
        getPagesByType(currentAdminSelection.selectedPageType.pageTypeId).then((response: GetPagesResponse) => {
          if (!response.error && response.pages) {
            dispatch(setAllPages(response.pages));
          }
          dispatch(setIsLoading(false));
          setTableLoading(false);
        });
      } else if (tableLoading) {
        setTimeout(() => {
          setTableLoading(false);
        }, 300);
      }
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [dispatch, currentAdminSelection, tableLoading, getPageTypes, getPagesByType]);

  const onPageTypeChange = (pageTypeId: number | null) => {
    const pageType = currentAdminSelection?.pageTypes?.find(x => x.pageTypeId === pageTypeId);
    if (pageType) {
      dispatch(setSelectedPageType(pageType));
      dispatch(setReloadPages(true));
    }
  };

  const getPagesSorted = (pages: Page[]) =>
    pages.sort((a, b) =>
      a.pageOrder === b.pageOrder ? (moment(b.lastUpdate ?? '').unix() - moment(a.lastUpdate ?? '').unix()) : ((a.pageOrder ?? 0) - (b.pageOrder ?? 0))
    );

  const setPageOrder = (pageId: number, oldOrder: number, newOrder: number) => {
    if (!currentAdminSelection.allPages || currentAdminSelection.allPages.length === 0 || !pageId || !oldOrder || isNaN(pageId) || isNaN(oldOrder) || !newOrder || isNaN(newOrder)) {
      return;
    }
    let pages = currentAdminSelection.allPages.slice();
    pages = pages.map(page => {
      const newPage = { ...page };
      if (newPage.pageId === pageId) {
        newPage.pageOrder = newOrder;
        newPage.lastUpdate = moment().format('YYYY-MM-DD HH:mm:ss');
      } else if (newPage.pageOrder === newOrder) {
        newPage.pageOrder = oldOrder < newPage.pageOrder ? oldOrder : newPage.pageOrder + 1;
        newPage.lastUpdate = moment().format('YYYY-MM-DD HH:mm:ss');
      }
      return newPage;
    });
    pages = getPagesSorted(pages);
    let prevOrder = 0;
    // Reset lastUpdate on all after sort
    const lastUpdate = moment().format('YYYY-MM-DD HH:mm:ss');
    for (const page of pages) {
      if (page.pageOrder === prevOrder) {
        page.pageOrder += 1;
      }
      prevOrder = (page.pageOrder ?? 0);
      page.lastUpdate = lastUpdate;
    }

    dispatch(setAllPages(pages));
  };

  const onPageOrderChange = (e: ChangeEvent<HTMLInputElement>, pageId: number, oldOrder: number, newOrder: number) => {
    e.target.blur();
    setPageOrder(pageId, oldOrder, newOrder);
  };

  const moveUp = (pageId: number) => {
    if (!pageId || isNaN(pageId) || !currentAdminSelection.allPages) {
      return;
    }
    const page = currentAdminSelection.allPages.find(x => x.pageId === pageId);
    if (page && page.pageOrder) {
      const order = page.pageOrder;
      if (order > 1) {
        const newOrder = order - 1;
        setPageOrder(pageId, order, newOrder);
      }
    }
  };

  const moveDown = (pageId: number) => {
    if (!pageId || isNaN(pageId) || !currentAdminSelection.allPages) {
      return;
    }
    const page = currentAdminSelection.allPages.find(x => x.pageId === pageId);
    if (page && page.pageOrder) {
      const order = page.pageOrder;
      if (order < currentAdminSelection.allPages.length) {
        const newOrder = order + 1;
        setPageOrder(pageId, order, newOrder);
      }
    }
  };

  const onSubmit = () => {
    if (!currentAdminSelection.allPages) {
      return;
    }
    const pages = currentAdminSelection.allPages.slice();
    dispatch(setIsLoading(true));
    updatePageOrder(pages).then((response: ModifyPageResponse) => {
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
  const pageTypeId = (currentAdminSelection?.selectedPageType?.pageTypeId ?? 0);

  const pageTypeList: ItemDataType<number>[] = currentAdminSelection?.pageTypes ?
    currentAdminSelection.pageTypes.map((pageType) => (
      {
        label: `${pageType.pageTypeName}`,
        value: pageType.pageTypeId
      }
    )) : [];

  const pages = currentAdminSelection?.allPages ? currentAdminSelection.allPages.slice() : undefined;
  const pagesSorted = pages ? getPagesSorted(pages) : [];

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
          <Table
            autoHeight
            data={pagesSorted}
            bordered
            cellBordered
            loading={tableLoading}
          >
            <Column flexGrow={1}>
              <HeaderCell>Order</HeaderCell>
              <Cell className='page-order-cell'>
                {(rowData) => (
                  <input className='page-order-input' id={rowData.pageId} type="text" value={rowData.pageOrder ?? ''} onChange={(e) => onPageOrderChange(e, parseInt(`${rowData.pageId}`), parseInt(`${rowData.pageOrder}`), parseInt(e.currentTarget.value))} />
                )}
              </Cell>
            </Column>
            <Column flexGrow={1}>
              <HeaderCell> </HeaderCell>
              <Cell>
                {(rowData: Page) => (
                  <>
                    <span>
                      <FaArrowUp className="admin-up-down-button" onClick={() => moveUp(parseInt(`${rowData.pageId}`))} title="Move Up" />
                    </span>
                    <span>
                      <FaArrowDown className="admin-up-down-button" onClick={() => moveDown(parseInt(`${rowData.pageId}`))} title="Move Down" />
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