'use client';

import { Col, Row } from 'rsuite';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ItemDataType } from 'rsuite/esm/internals/types';
import type { RootState } from '../../../lib/store';
import { SelectPicker } from 'rsuite';
import { User } from '@/types/user';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { setSeller } from '@/lib/reportSelectionSlice';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';

export default function SelectSeller() {
  const dispatch = useDispatch();
  const { getUser } = useCurrentUser();
  const [user, setUser] = useState<User | undefined>(undefined);
  const currentReportSelection = useSelector((state: RootState) => state.reportSelection);
  const selectedSellerId = currentReportSelection.seller.sellerId;

  const getSelectedSeller = useCallback(
    (sellerId: number) => {
      const currentUser = getUser();
      const seller = currentUser?.sellers?.find((x) => x.sellerId === sellerId);
      if (seller) {
        document.title = `Client Portal - ${seller.sellerName}`;
      } else {
        document.title = 'Client Portal - Sales Overview';
      }
      return (
        seller || {
          sellerId: 0,
          sellerName: '',
          sellerType: 1,
          userSellerId: 0,
        }
      );
    },
    [getUser],
  );

  useEffect(() => {
    if (!user) {
      const currentUser = getUser();
      setUser(currentUser);
    }

    if (
      selectedSellerId <= 0 &&
      user &&
      user.selectedSellerId &&
      user.selectedSellerId > 0
    ) {
      const seller = getSelectedSeller(user.selectedSellerId);
      dispatch(setSeller(seller));
    }
  }, [selectedSellerId, dispatch, user, getSelectedSeller, getUser]);

  const handleChange = (sellerId: number | null) => {
    const seller = sellerId ? getSelectedSeller(sellerId) : undefined;
    if (seller) {
      dispatch(setSeller(seller));
      dispatch(setIsLoading(true));
    }
  };

  const userSellerList: ItemDataType<number>[] = user?.sellers
    ? user.sellers.map((seller) => ({
        label: `${seller.sellerName}`,
        value: seller.sellerId,
      }))
    : [];

  if (userSellerList.length > 0) {
    if (userSellerList.length > 1) {
      return (
        <Row className="no-print admin-seller-row">
          <Col xs={1}>Seller:</Col>
          <Col sm={11} md={5}>
            <SelectPicker
              value={selectedSellerId}
              data={userSellerList}
              size="lg"
              onChange={(tId) => handleChange(tId)}
              cleanable={false}
              menuAutoWidth={true}
              className="admin-seller-select-value"
            />
          </Col>
        </Row>
      );
    } else if (user && user.sellers) {
      const [seller] = user.sellers;
      if (seller && seller.sellerId !== selectedSellerId) {
        dispatch(setSeller(seller));
      }
      return (
        <Row className="no-print admin-seller-row">
          <Col>{seller?.sellerName}</Col>
        </Row>
      );
    } else {
      return <></>;
    }
  } else {
    return (
      <Row className="no-print admin-seller-row">
        <Col>No sellers returned</Col>
      </Row>
    );
  }
}
