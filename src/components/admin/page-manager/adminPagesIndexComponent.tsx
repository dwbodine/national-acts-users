'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input, Table } from 'rsuite';

import { useGetAdminSellers } from '@/hooks/admin/useGetAdminSellers';
import { useGetAllPages } from '@/hooks/admin/useGetAllPages';
import { useGetPageTypes } from '@/hooks/common/useGetPageTypes';
import {
  setAllPages,
  setAllSellers,
  setPageTypes,
  setReloadPages,
  setReloadSellers,
  setSelectedPage,
} from '@/lib/adminSelectionSlice';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { RootState } from '@/lib/store';
import { Page } from '@/types/public';
import { GetPagesResponse, GetPageTypesResponse, GetSellersResponse } from '@/types/responses';

export default function AdminPagesIndex() {
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const dispatch = useDispatch();
  const { getAllPages } = useGetAllPages();
  const { getPageTypes } = useGetPageTypes();
  const { Column, HeaderCell, Cell } = Table;
  const [tableLoading, setTableLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { getAdminSellers } = useGetAdminSellers();
  const router = useRouter();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentAdminSelection.pageTypes === undefined) {
        setTableLoading(true);
        dispatch(setIsLoading(true));
        void getPageTypes().then((response: GetPageTypesResponse) => {
          if (!response.error && response.pageTypes) {
            dispatch(setPageTypes(response.pageTypes));
          }
          dispatch(setIsLoading(false));
          setTableLoading(false);
        });
      } else if (currentAdminSelection.reloadSellers) {
        dispatch(setReloadSellers(false));
        setTableLoading(true);
        dispatch(setIsLoading(true));
        void getAdminSellers().then((response: GetSellersResponse) => {
          if (!response.error && response.sellers) {
            dispatch(setAllSellers(response.sellers));
          }
          dispatch(setIsLoading(false));
          setTableLoading(false);
        });
      } else if (currentAdminSelection.reloadPages) {
        dispatch(setReloadPages(false));
        setTableLoading(true);
        dispatch(setIsLoading(true));
        void getAllPages().then((response: GetPagesResponse) => {
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
  }, [getAllPages, dispatch, currentAdminSelection, tableLoading, getAdminSellers, getPageTypes]);

  const addPage = () => {
    const page: Page = {
      isActive: true,
      pageId: 0,
      pageType: {
        pageTypeId: 1,
        pageTypeName: '',
        pageTypeTemplate: '',
      },
      route: '',
      title: '',
    };
    dispatch(setSelectedPage(page));
    setTableLoading(true);
    router.push('/admin/pages/edit/');
  };

  const editPage = (pageId: number) => {
    if (!pageId || isNaN(pageId)) {
      return;
    }
    const page = currentAdminSelection.allPages?.find((x) => x.pageId === pageId);
    if (page) {
      dispatch(setSelectedPage(page));
      setTableLoading(true);
      router.push('/admin/pages/edit/');
    }
  };

  const filterPages = (pages: Page[] | undefined) => {
    let filteredPages: Page[] | undefined = pages;
    if (searchTerm && searchTerm.length >= 2 && pages && pages.length > 0) {
      const srch = searchTerm.toLowerCase();
      filteredPages = pages.filter((page) => page.title.toLowerCase().includes(srch));
    }
    return filteredPages;
  };

  const filteredPages = filterPages(currentAdminSelection.allPages);

  return (
    <div className="admin-container">
      <h3>Manage Pages</h3>
      <Input
        value={searchTerm}
        onChange={setSearchTerm}
        className="form-control search-text-input no-print"
        placeholder="Search for pages by title..."
        hidden={currentAdminSelection.allPages === undefined}
      />
      <Button onClick={addPage}>Add Page</Button>
      <Table height={600} data={filteredPages} bordered cellBordered loading={tableLoading}>
        <Column width={300}>
          <HeaderCell>Page Title</HeaderCell>
          <Cell className="admin-click-cell">
            {(rowData) => (
              <div
                id={`${rowData['pageId']}`}
                onClick={() => editPage(parseInt(`${rowData['pageId']}`))}
              >
                {rowData['title']}
              </div>
            )}
          </Cell>
        </Column>
      </Table>
    </div>
  );
}
