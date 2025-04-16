import { useEffect, useState } from 'react';
import AdminListHomeButton from '../adminListHomeButton';
import { Table } from 'rsuite';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { setAdminSeller, setAllSellers, setReloadSellers, setTicketSocketAccounts } from '@/lib/adminSelectionSlice';
import router from 'next/router';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { GetSellersResponse, Seller, SellerType } from '@/types/event';
import { useGetTicketSocketAccounts } from '@/hooks/admin/useGetTicketSocketAccounts';
import { GetTicketSocketAccountsResponse } from '@/types/admin';
import { useGetAdminSellers } from '@/hooks/admin/useGetAdminSellers';
import { useGetEventStatus } from '@/hooks/common/useGetEventStatus';
import { Button } from 'react-bootstrap';

export default function AdminPagesIndex() {
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const dispatch = useDispatch();
  const { getAdminSellers } = useGetAdminSellers();
  const { getTicketSocketAccounts } = useGetTicketSocketAccounts();
  const { Column, HeaderCell, Cell } = Table;
  const [tableLoading, setTableLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { getSellerStatusSlug } = useGetEventStatus();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!currentAdminSelection.ticketSocketAccounts) {
        setTableLoading(true);
        dispatch(setIsLoading(true));
        dispatch(setAllSellers(undefined));
        getTicketSocketAccounts().then((response: GetTicketSocketAccountsResponse) => {
          if (!response.accountError && response.accounts) {
            dispatch(setTicketSocketAccounts(response.accounts));
          }
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
      sellerId: 0,
      name: '',
      sellerType: SellerType.Artist,
      isActive: true,
    };
    dispatch(setAdminSeller(seller));
    setTableLoading(true);
    router.push('/admin/sellers/edit');    
  };

  const editSeller = (sellerId: number) => {
    if (!sellerId || isNaN(sellerId)) {
      return;
    }
    let seller = currentAdminSelection.allSellers?.find((x) => x.sellerId == sellerId);
    if (seller) {
      dispatch(setAdminSeller(seller));
      setTableLoading(true);
      router.push('/admin/sellers/edit');
    }
  };

  const filterSellers = (sellers: Seller[] | undefined) => {
        let filteredSellers: Seller[] | undefined = sellers;
        if (searchTerm && searchTerm.length >= 2 && sellers && sellers.length > 0) {
          const srch = searchTerm.toLowerCase();
          filteredSellers = sellers.filter((seller) => {
            return (
              seller.name.toLowerCase().includes(srch)
            );
          });
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
            hidden={currentAdminSelection.allSellers == undefined}
          />
      <Button onClick={addSeller}>Add Seller</Button>
      <Table
        height={600}
        data={filteredSellers}
        bordered
        cellBordered
        loading={tableLoading}
        rowClassName={(rowData: Seller) => {
          return getSellerStatusSlug(rowData);
        }}
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
