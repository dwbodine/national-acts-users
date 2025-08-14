"use client";

import { GetSellersResponse, GetTicketSocketAccountsResponse } from '@/types/responses';
import { Seller, SellerType } from '@/types/event';
import { setAdminSeller, setAllSellers, setReloadSellers, setTicketSocketAccounts } from '@/lib/adminSelectionSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import AdminListHomeButton from '../adminListHomeButton';
import { Button } from 'react-bootstrap';
import { RootState } from '@/lib/store';
import { Table } from 'rsuite';
import { getSellerStatusSlug } from '@/utils/eventUtils';
import { redirect } from 'next/navigation';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { useGetAdminSellers } from '@/hooks/admin/useGetAdminSellers';
import { useGetTicketSocketAccounts } from '@/hooks/admin/useGetTicketSocketAccounts';

export default function AdminSellerGlobalIndex() {
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const dispatch = useDispatch();
  const { getAdminSellers } = useGetAdminSellers();
  const { getTicketSocketAccounts } = useGetTicketSocketAccounts();
  const { Column, HeaderCell, Cell } = Table;
  const [tableLoading, setTableLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!currentAdminSelection.ticketSocketAccounts) {
        setTableLoading(true);
        dispatch(setIsLoading(true));
        dispatch(setAllSellers(undefined));
        getTicketSocketAccounts().then((response: GetTicketSocketAccountsResponse) => {
          if (!response.error && response.accounts) {
            dispatch(setTicketSocketAccounts(response.accounts));
          }
        });
      } else if (currentAdminSelection.reloadSellers) {
        dispatch(setReloadSellers(false));
        setTableLoading(true);
        dispatch(setIsLoading(true));
        getAdminSellers().then((response: GetSellersResponse) => {
          if (!response.error && response.sellers) {
            dispatch(setAllSellers(response.sellers));
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
  }, [getAdminSellers, getTicketSocketAccounts, dispatch, currentAdminSelection, tableLoading]);

  const addSeller = () => {
    const seller: Seller = {
      hideInList: true,
      isActive: true,
      name: '',
      sellerId: 0,
      sellerType: SellerType.Artist,
    };
    dispatch(setAdminSeller(seller));
    setTableLoading(true);
    redirect('/admin/sellers/edit');
  };

  const editSeller = (sellerId: number) => {
    if (!sellerId || isNaN(sellerId)) {
      return;
    }
    const seller = currentAdminSelection.allSellers?.find((x) => x.sellerId === sellerId);
    if (seller) {
      dispatch(setAdminSeller(seller));
      setTableLoading(true);
      redirect('/admin/sellers/edit');
    }
  };

  const filterSellers = (sellers: Seller[] | undefined) => {
    let filteredSellers: Seller[] | undefined = sellers;
    if (searchTerm && searchTerm.length >= 2 && sellers && sellers.length > 0) {
      const srch = searchTerm.toLowerCase();
      filteredSellers = sellers.filter((seller) => seller.name.toLowerCase().includes(srch));
    }
    return filteredSellers;
  };

  const filteredSellers = filterSellers(currentAdminSelection.allSellers);

  return (
    <div className="admin-container">
      <h3>Manage Sellers</h3>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="form-control search-text-input no-print"
        placeholder="Search for sellers by name..."
        hidden={currentAdminSelection.allSellers === undefined}
      />
      <Button onClick={addSeller}>Add Seller</Button>
      <Table
        height={600}
        data={filteredSellers}
        bordered
        cellBordered
        loading={tableLoading}
        rowClassName={(rowData: Seller) => getSellerStatusSlug(rowData)}
      >
        <Column width={300}>
          <HeaderCell>Seller Name</HeaderCell>
          <Cell className="admin-click-cell">
            {(rowData) => (
              <div id={rowData.sellerId} onClick={() => editSeller(parseInt(`${rowData.sellerId}`))}>
                {rowData.name}
              </div>
            )}
          </Cell>
        </Column>
      </Table>
      <AdminListHomeButton />
    </div>
  );
}
