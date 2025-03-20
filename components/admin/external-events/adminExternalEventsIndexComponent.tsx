import { useEffect, useMemo, useState } from 'react';
import AdminListHomeButton from '../adminListHomeButton';
import { Table } from 'rsuite';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import {
  setAdminSellerId,
  setAllSellers,
  setReloadEvents,
} from '@/lib/adminSelectionSlice';
import { Col, Row } from 'react-bootstrap';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { GetSellersResponse, Seller, SellerType } from '@/types/event';
import { useGetSellers } from '@/hooks/common/useGetSellers';
import router from 'next/router';
import debouce from 'lodash.debounce';

export default function AdminExternalEventsIndex() {
  const { Column, HeaderCell, Cell } = Table;
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const { getSellers } = useGetSellers();
  const dispatch = useDispatch();
  const [tableLoading, setTableLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedResults = useMemo(() => {
    return debouce(setSearchTerm, 250);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentAdminSelection.allSellers == undefined) {
        setTableLoading(true);
        dispatch(setIsLoading(true));
        dispatch(setReloadEvents(true));
        getSellers().then((response: GetSellersResponse) => {
          dispatch(setAllSellers(response.sellers));
          dispatch(setIsLoading(false));
          setTableLoading(false);
        });
      } else if (currentAdminSelection.allSellers != undefined && tableLoading) {
        setTimeout(() => {
          setTableLoading(false);
        }, 300);
      }
    }, 500);
    return () => {
      clearTimeout(timeoutId);
      debouncedResults.cancel();
    };
  }, [dispatch, getSellers, currentAdminSelection, tableLoading, debouncedResults]);

  const manageSellerEvents = (sellerId: number) => {
    if (
      !sellerId ||
      isNaN(sellerId) ||
      !currentAdminSelection.allSellers ||
      currentAdminSelection.allSellers.length == 0
    ) {
      return;
    }
    const seller = currentAdminSelection.allSellers.find(
      (x) => x.sellerId == sellerId,
    );
    if (!seller) {
      return;
    }
    dispatch(setAdminSellerId(sellerId));
    setTableLoading(true);
    router.push('/admin/external-events/seller/');
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
      <Row className="refresh-results-header">
        <Col>
          <AdminListHomeButton />
        </Col>
      </Row>
      <Row className="refresh-results-header">
        <Col>
          <h3>Manage External Events by Seller</h3>
        </Col>
      </Row>
      <Row>
        <Col>
        <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control search-text-input no-print"
            placeholder="Search for sellers by name..."
            hidden={currentAdminSelection.allSellers == undefined}
          />
          <Table
            autoHeight={true}
            data={filteredSellers}
            bordered
            cellBordered
            loading={tableLoading}
          >
            <Column flexGrow={2} minWidth={100}>
              <HeaderCell>Seller</HeaderCell>
              <Cell>
                {(rowData: Seller) => rowData.name}
              </Cell>
            </Column>
            <Column flexGrow={1}>
              <HeaderCell>Type</HeaderCell>
              <Cell>{(rowData: Seller) => SellerType[rowData.sellerType]}</Cell>
            </Column>
            <Column flexGrow={1}>
              <HeaderCell>Current External Events</HeaderCell>
              <Cell>{(rowData: Seller) => rowData.numExternalEvents ? rowData.numExternalEvents : 0}</Cell>
            </Column>
            <Column flexGrow={1}>
              <HeaderCell>&nbsp;</HeaderCell>
              <Cell>
                {(rowData: Seller) =>
                  rowData.sellerId ? (
                    <a
                      href="#"
                      id={`${rowData.sellerId}_seller`}
                      onClick={() => manageSellerEvents(parseInt(`${rowData.sellerId}`))}
                    >
                      Manage
                    </a>
                  ) : (
                    ''
                  )
                }
              </Cell>
            </Column>
          </Table>
        </Col>
      </Row>
    </div>
  );
}
