import { useEffect, useState } from 'react';
import AdminListHomeButton from '../adminListHomeButton';
import { Table } from 'rsuite';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { setAllPages, setAllSellers, setPageTypes, setReloadPages, setReloadSellers, setSelectedPage } from '@/lib/adminSelectionSlice';
import router from 'next/router';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { GetPagesResponse } from '@/types/admin';
import { Button } from 'react-bootstrap';
import { useGetAllPages } from '@/hooks/admin/useGetAllPages';
import { Page } from '@/types/public';
import { useGetAdminSellers } from '@/hooks/admin/useGetAdminSellers';
import { GetPageTypesResponse, GetSellersResponse } from '@/types/event';
import { useGetPageTypes } from '@/hooks/common/useGetPageTypes';

export default function AdminPagesIndex() {
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const dispatch = useDispatch();
  const { getAllPages } = useGetAllPages();
  const { getPageTypes } = useGetPageTypes();
  const { Column, HeaderCell, Cell } = Table;
  const [tableLoading, setTableLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { getAdminSellers } = useGetAdminSellers();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentAdminSelection.pageTypes == undefined) {
        setTableLoading(true);
        dispatch(setIsLoading(true));
        getPageTypes().then((response: GetPageTypesResponse) => {
          if (!response.pageTypeError && response.pageTypes) {
            dispatch(setPageTypes(response.pageTypes));
          }
          dispatch(setIsLoading(false));
          setTableLoading(false);
        });
      } else if (currentAdminSelection.reloadSellers) {
        dispatch(setReloadSellers(false));
        setTableLoading(true);
        dispatch(setIsLoading(true));
        getAdminSellers().then((response: GetSellersResponse) => {
          if (!response.sellersError && response.sellers) {
            dispatch(setAllSellers(response.sellers));
          }
          dispatch(setIsLoading(false));
          setTableLoading(false);
        });
      } else if (currentAdminSelection.reloadPages) {
        dispatch(setReloadPages(false));
        setTableLoading(true);
        dispatch(setIsLoading(true));
        getAllPages().then((response: GetPagesResponse) => {
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
  }, [getAllPages, dispatch, currentAdminSelection, tableLoading, getAdminSellers, getPageTypes]);

  const addPage = () => {
    const page: Page = {
      pageId: 0,
      route: '',
      title: '',
      pageType: {
        pageTypeId: 1,
        pageTypeName: '',
        pageTypeTemplate: ''
      },
      isActive: true,
    };
    dispatch(setSelectedPage(page));
    setTableLoading(true);
    router.push('/admin/pages/edit');    
  };

  const editPage = (pageId: number) => {
    if (!pageId || isNaN(pageId)) {
      return;
    }
    let page = currentAdminSelection.allPages?.find((x) => x.pageId == pageId);
    if (page) {
      dispatch(setSelectedPage(page));
      setTableLoading(true);
      router.push('/admin/pages/edit');
    }
  };

  const filterPages = (pages: Page[] | undefined) => {
        let filteredPages: Page[] | undefined = pages;
        if (searchTerm && searchTerm.length >= 2 && pages && pages.length > 0) {
          const srch = searchTerm.toLowerCase();
          filteredPages = pages.filter((page) => {
            return (
              page.title.toLowerCase().includes(srch)
            );
          });
        }
        return filteredPages;
      };
  
  const filteredPages = filterPages(currentAdminSelection.allPages);

  return (
    <div className="admin-container">
      <h3>Manage Pages</h3>
      <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control search-text-input no-print"
            placeholder="Search for pages by title..."
            hidden={currentAdminSelection.allPages == undefined}
          />
      <Button onClick={addPage}>Add Page</Button>
      <Table
        height={600}
        data={filteredPages}
        bordered
        cellBordered
        loading={tableLoading}
      >
        <Column width={300}>
          <HeaderCell>Page Title</HeaderCell>
          <Cell className="admin-click-cell">
            {(rowData) => (
              <div id={rowData.pageId} onClick={() => editPage(parseInt(`${rowData.pageId}`))}>
                {rowData.title}
              </div>
            )}
          </Cell>
        </Column>
      </Table>
      <AdminListHomeButton />
    </div>
  );
}
