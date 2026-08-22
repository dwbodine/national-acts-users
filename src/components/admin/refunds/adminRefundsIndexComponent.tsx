'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Table } from 'rsuite';

import PageHeader from '@/components/common/PageHeaderComponent';
import { useGetAllRefundPolicies } from '@/hooks/admin/useGetAllRefundPolicies';
import { setAllRefundPolicies } from '@/lib/adminDataSelectionSlice';
import { setReloadRefundPolicies, setSelectedRefundPolicy } from '@/lib/adminSelectionSlice';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { RootState } from '@/lib/store';
import { RefundPolicy } from '@/types/public';
import { GetRefundPoliciesResponse } from '@/types/responses';

export default function AdminRefundPoliciesIndex() {
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const currentAdminDataSelection = useSelector((state: RootState) => state.adminDataSelection);
  const dispatch = useDispatch();
  const { getAllRefundPolicies } = useGetAllRefundPolicies();
  const { Column, HeaderCell, Cell } = Table;
  const [tableLoading, setTableLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentAdminSelection.reloadRefundPolicies) {
        dispatch(setReloadRefundPolicies(false));
        setTableLoading(true);
        dispatch(setIsLoading(true));
        void getAllRefundPolicies().then((response: GetRefundPoliciesResponse) => {
          if (!response.error && response.refundPolicies) {
            dispatch(setAllRefundPolicies(response.refundPolicies));
          }
          dispatch(setIsLoading(false));
          setTableLoading(false);
        });
      } else if (tableLoading) {
        setTimeout(() => {
          dispatch(setIsLoading(false));
          setTableLoading(false);
        }, 300);
      }
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [getAllRefundPolicies, dispatch, currentAdminSelection, tableLoading]);

  const editRefundPolicy = (refundPolicyId: number) => {
    if (!refundPolicyId || isNaN(refundPolicyId)) {
      return;
    }
    const refundPolicy = currentAdminDataSelection.allRefundPolicies?.find(
      (x) => x.refundPolicyId === refundPolicyId,
    );
    if (refundPolicy) {
      dispatch(setSelectedRefundPolicy(refundPolicy));
      setTableLoading(true);
      router.push('/admin/refunds/edit');
    }
  };

  return (
    <>
      <PageHeader pageTitle="Manage Refund Policies" />
      <div className="admin-container">
        <Table
          autoHeight
          rowHeight={56}
          data={currentAdminDataSelection.allRefundPolicies}
          bordered
          cellBordered
          loading={tableLoading}
        >
          <Column flexGrow={1}>
            <HeaderCell>Category</HeaderCell>
            <Cell>
              {(rowData: RefundPolicy) => (
                <span>{rowData.category ? rowData.category.categoryName : ''}</span>
              )}
            </Cell>
          </Column>
          <Column flexGrow={7}>
            <HeaderCell> </HeaderCell>
            <Cell>
              {(rowData: RefundPolicy) => (
                <span>
                  <Button onClick={() => editRefundPolicy(rowData.refundPolicyId)}>Edit</Button>
                </span>
              )}
            </Cell>
          </Column>
        </Table>
      </div>
    </>
  );
}
