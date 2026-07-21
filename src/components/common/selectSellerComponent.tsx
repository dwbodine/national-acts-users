'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row, SelectPicker } from 'rsuite';
import { ItemDataType } from 'rsuite/esm/internals/types';

import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import { setReloadFanMoments } from '@/lib/adminSelectionSlice';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { setSeller } from '@/lib/reportSelectionSlice';
import { Permission, User } from '@/types/user';

import type { RootState } from '../../lib/store';

export interface SelectSellerProps {
  filterByPermissions?: Permission[];
}

export default function SelectSeller(props: SelectSellerProps) {
  const dispatch = useDispatch();
  const { getUser } = useCurrentUser();
  const [user, setUser] = useState<User | undefined>(undefined);
  const currentReportSelection = useSelector((state: RootState) => state.reportSelection);
  const selectedSellerId = currentReportSelection.seller.sellerId;
  const filteredSellers = useMemo(() => {
    const sellers = user?.sellers ?? [];
    const permissionIds =
      props.filterByPermissions?.map((permission) => permission.permissionId) ?? [];

    if (permissionIds.length === 0 || user?.isAdmin) {
      return sellers;
    }

    return sellers.filter((seller) =>
      seller.permissions?.some((permissionId) => permissionIds.includes(permissionId)),
    );
  }, [props.filterByPermissions, user?.sellers]);

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
          hideSellerRate: false,
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

    if (selectedSellerId <= 0) {
      document.title = 'Client Portal - Sales Overview';
    }
  }, [selectedSellerId, user, getUser]);

  useEffect(() => {
    if (filteredSellers.length !== 1) {
      return;
    }

    const [seller] = filteredSellers;
    if (seller && seller.sellerId !== selectedSellerId) {
      dispatch(setSeller(seller));
    }
  }, [dispatch, filteredSellers, selectedSellerId]);

  const handleChange = (sellerId: number | null) => {
    const seller = sellerId ? getSelectedSeller(sellerId) : undefined;
    if (seller) {
      dispatch(setSeller(seller));
      dispatch(setIsLoading(true));
      dispatch(setReloadFanMoments(true));
    }
  };

  const userSellerList: ItemDataType<number>[] = filteredSellers.map((seller) => ({
    label: `${seller.sellerName}`,
    value: seller.sellerId,
  }));

  if (userSellerList.length > 0) {
    if (userSellerList.length > 1) {
      return (
        <Row className="no-print admin-seller-row">
          <Col xs={2} className="admin-seller-title">
            Seller:
          </Col>
          <Col sm={22} md={10}>
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
    } else {
      const [seller] = filteredSellers;
      return (
        <Row className="no-print admin-seller-row">
          <Col>{seller?.sellerName}</Col>
        </Row>
      );
    }
    return <></>;
  }
  return (
    <Row className="no-print admin-seller-row">
      <Col>No sellers returned</Col>
    </Row>
  );
}
