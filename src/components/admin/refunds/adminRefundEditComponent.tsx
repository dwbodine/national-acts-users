'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Button, Col, Row, SelectPicker } from 'rsuite';
import { ItemDataType } from 'rsuite/esm/internals/types';

import PageHeader from '@/components/common/PageHeaderComponent';
import Textarea from '@/components/common/Textarea';
import { useGetAllRefundCategories } from '@/hooks/admin/useGetAllRefundCategories';
import { useUpdateRefundPolicy } from '@/hooks/admin/useUpdateRefundPolicy';
import { setAllRefundCategories, setAllRefundPolicies } from '@/lib/adminDataSelectionSlice';
import {
  setMustSavePage,
  setReloadRefundPolicies,
  setSelectedRefundPolicy,
} from '@/lib/adminSelectionSlice';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { RootState } from '@/lib/store';
import { RefundPolicy } from '@/types/public';
import { GetRefundCategoriesResponse, ModifyRefundPolicyResponse } from '@/types/responses';

import ConfirmationDialog from '../../common/confirmationDialogComponent';

export default function AdminRefundPolicyEdit() {
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const currentAdminDataSelection = useSelector((state: RootState) => state.adminDataSelection);
  const dispatch = useDispatch();
  const { updateRefundPolicy } = useUpdateRefundPolicy();
  const { getAllRefundCategories } = useGetAllRefundCategories();
  const router = useRouter();

  const goBack = useCallback(() => {
    toast.dismiss();
    router.push('/admin/refunds');
  }, [router]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentAdminDataSelection.refundCategories === undefined) {
        dispatch(setIsLoading(true));
        void getAllRefundCategories().then((response: GetRefundCategoriesResponse) => {
          dispatch(setAllRefundCategories(response.categories));
        });
        dispatch(setIsLoading(false));
      } else if (
        currentAdminDataSelection.allRefundPolicies === undefined ||
        currentAdminSelection.selectedRefundPolicy === undefined
      ) {
        goBack();
      }
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentAdminSelection, dispatch, getAllRefundCategories, goBack]);

  const confirmGoBack = () => {
    if (!currentAdminSelection?.mustSavePage) {
      goBack();
      return;
    }

    const message: string =
      'You have made changes to this refund policy, are you sure you want to discard them and leave?';
    toast.warning(
      <ConfirmationDialog
        Message={message}
        ConfirmText="Yes"
        CancelText="No"
        OnConfirm={goBack}
        OnCancel={() => {
          toast.dismiss();
        }}
      />,
      {
        autoClose: false,
        closeOnClick: false,
        position: 'top-center',
      },
    );
  };

  const markDirty = () => {
    dispatch(setMustSavePage(true));
  };

  const setRefundCategory = (categoryId: number | null) => {
    if (!currentAdminSelection.selectedRefundPolicy?.category || !categoryId) {
      return;
    }
    const refundPolicyToUpdate: RefundPolicy = { ...currentAdminSelection.selectedRefundPolicy };
    if (refundPolicyToUpdate.category.refundCategoryId !== categoryId) {
      refundPolicyToUpdate.category = { refundCategoryId: categoryId };
      dispatch(setSelectedRefundPolicy(refundPolicyToUpdate));
      markDirty();
    }
  };

  const setPolicyText = (policyText: string) => {
    if (!currentAdminSelection.selectedRefundPolicy || !policyText) {
      return;
    }
    const refundPolicyToUpdate: RefundPolicy = { ...currentAdminSelection.selectedRefundPolicy };
    if (refundPolicyToUpdate.policyText !== policyText) {
      refundPolicyToUpdate.policyText = policyText;
      dispatch(setSelectedRefundPolicy(refundPolicyToUpdate));
      markDirty();
    }
  };

  const onSubmit = () => {
    if (!currentAdminSelection.selectedRefundPolicy) {
      return;
    }

    const refundPolicyToUpdate: RefundPolicy = {
      ...currentAdminSelection.selectedRefundPolicy,
    };

    if (!refundPolicyToUpdate.category || !refundPolicyToUpdate.category.refundCategoryId) {
      toast.error('Must select a category');
      return;
    }

    if (!refundPolicyToUpdate.policyText) {
      toast.error('Policy text cannot be blank');
      return;
    }

    dispatch(setIsLoading(true));

    void updateRefundPolicy(refundPolicyToUpdate).then((response: ModifyRefundPolicyResponse) => {
      if (response.success) {
        dispatch(setReloadRefundPolicies(true));
        dispatch(setAllRefundPolicies(undefined));
        toast.success('Save Refund Policy succeeded');
        router.push('/admin/refunds');
      } else {
        toast.error(response.error ?? 'Error occurred while saving Refund Policy');
      }
      dispatch(setIsLoading(false));
    });
  };

  const refundCategories: ItemDataType<number>[] = currentAdminDataSelection?.refundCategories
    ? currentAdminDataSelection.refundCategories.map((category) => ({
        label: `${category.categoryName ?? ''}`,
        value: category.refundCategoryId,
      }))
    : [];

  const pageHeader =
    (currentAdminSelection.selectedRefundPolicy?.refundPolicyId ?? 0) > 0
      ? 'Edit Refund Policy'
      : 'Add Refund Policy';

  const categoryId = currentAdminSelection.selectedRefundPolicy?.category?.refundCategoryId ?? 0;
  const policyText = currentAdminSelection.selectedRefundPolicy?.policyText;

  return (
    <>
      <PageHeader pageTitle={pageHeader} />
      <Row className="admin-container">
        <Col xs={24}>
          <Row>
            <Col xs={24} md={12}>
              <span>Category</span>
              <br />
              <SelectPicker
                block
                value={categoryId}
                data={refundCategories}
                size="lg"
                onChange={(cId) => setRefundCategory(cId)}
                cleanable={false}
                menuAutoWidth={true}
                searchable={false}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={24}>
              <span>HTML Text</span>
              <Textarea
                className="form-control-half"
                rows={15}
                id="policyText"
                onChange={setPolicyText}
                value={policyText ?? ''}
                placeholder="Free-form html text to be used as refund policy"
              />
            </Col>
          </Row>
          <Row>
            <Col xs={24}>
              <Button onClick={onSubmit}>Submit</Button>{' '}
              <Button onClick={confirmGoBack}>Back</Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}
