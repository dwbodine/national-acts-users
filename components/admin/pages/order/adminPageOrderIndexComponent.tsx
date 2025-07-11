import { ChangeEvent, useEffect, useState } from 'react';
import AdminListHomeButton from '../../adminListHomeButton';
import { SelectPicker, Table } from 'rsuite';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { setAllPages, setPageTypes, setReloadPages, setSelectedPageType } from '@/lib/adminSelectionSlice';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { GetPagesResponse, ModifyPageResponse } from '@/types/admin';
import { GetPageTypesResponse } from '@/types/event';
import { useGetPageTypes } from '@/hooks/common/useGetPageTypes';
import { ItemDataType } from 'rsuite/esm/internals/types';
import { useUpdatePageOrder } from '@/hooks/admin/useUpdatePageOrder';
import { useGetPagesByType } from '@/hooks/common/useGetPagesByType';
import { ARTIST_SELLER_TYPE } from '@/constants';
import moment from 'moment';
import { toast } from 'react-toastify';
import { Button, Col, Row } from 'react-bootstrap';
import { Page } from '@/types/public';

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
      if (currentAdminSelection.pageTypes == undefined) {
        setTableLoading(true);
        dispatch(setIsLoading(true));
        getPageTypes(true).then((response: GetPageTypesResponse) => {
          if (!response.pageTypeError && response.pageTypes) {
            dispatch(setPageTypes(response.pageTypes));
            const artistPageType = response.pageTypes.find(x => x.pageTypeId == ARTIST_SELLER_TYPE);
            if (artistPageType) {
              dispatch(setSelectedPageType(artistPageType));
            }
          }
        });
      } else if (currentAdminSelection.reloadPages && currentAdminSelection.selectedPageType != undefined) {
        dispatch(setReloadPages(false));
        setTableLoading(true);
        dispatch(setIsLoading(true));
        getPagesByType(currentAdminSelection.selectedPageType.pageTypeId).then((response: GetPagesResponse) => {
          if (!response.pageError && response.pages) {
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
    const pageType = currentAdminSelection?.pageTypes?.find(x => x.pageTypeId == pageTypeId);
    if (pageType) {
      dispatch(setSelectedPageType(pageType));
      dispatch(setReloadPages(true));
    }
  };

  const setPageOrder = (e: ChangeEvent<HTMLInputElement>, pageId: number, order: number) => {
    e.target.blur();
    if (!currentAdminSelection.allPages || currentAdminSelection.allPages.length == 0 || !pageId || !order || isNaN(pageId) || isNaN(order)) {
      return;
    }
    let pages = currentAdminSelection.allPages.slice();
    pages = pages.map(page => {
      const newPage = { ...page };
      if (newPage.pageId == pageId) {
        newPage.pageOrder = order;
        newPage.lastUpdate = moment().format('YYYY-MM-DD HH:mm:ss');
      }
      return newPage;
    });
    pages = getPagesSorted(pages);
    let prevOrder = 0;
    for (const page of pages) {
      if (page.pageOrder == prevOrder) {
        page.pageOrder += 1;
      }
      prevOrder = page.pageOrder ?? 0;
    }

    dispatch(setAllPages(pages));
  }

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
      } else if (response.pageError) {
        dispatch(setIsLoading(false));
        toast.error(response.pageError);
      } else {
        dispatch(setIsLoading(false));
        toast.error('Page order save failed');
      }
    });
  };

  const pageTypeName = currentAdminSelection?.selectedPageType?.pageTypeName;
  const pageTypeId = currentAdminSelection?.selectedPageType?.pageTypeId ?? 0;

  const pageTypeList: ItemDataType<number>[] = currentAdminSelection?.pageTypes ?
    currentAdminSelection.pageTypes.map((pageType) => {
      return {
        label: `${pageType.pageTypeName}`,
        value: pageType.pageTypeId
      }
    }) : [];

  const getPagesSorted = (pages: Page[]) => {
    return pages.sort((a, b) =>
      a.pageOrder == b.pageOrder ? (moment(a.lastUpdate ?? '').unix() - moment(b.lastUpdate ?? '').unix()) : ((a.pageOrder ?? 0) - (b.pageOrder ?? 0))
    );
  }

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
                  <input className='page-order-input' id={rowData.pageId} type="text" value={rowData.pageOrder} onChange={(e) => setPageOrder(e, parseInt(`${rowData.pageId}`), parseInt(e.currentTarget.value))} />
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