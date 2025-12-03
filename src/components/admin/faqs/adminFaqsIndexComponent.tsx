'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Table } from 'rsuite';

import { useDeleteFaq } from '@/hooks/admin/useDeleteFaq';
import { useGetAllFaqs } from '@/hooks/admin/useGetAllFaqs';
import { useMoveFaqDown } from '@/hooks/admin/useMoveFaqDown';
import { useMoveFaqUp } from '@/hooks/admin/useMoveFaqUp';
import { setAllFaqs, setReloadFaqs, setSelectedFaq } from '@/lib/adminSelectionSlice';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { RootState } from '@/lib/store';
import { Faq } from '@/types/public';
import { GetFaqsResponse } from '@/types/responses';

export default function AdminFaqsIndex() {
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const dispatch = useDispatch();
  const { getAllFaqs } = useGetAllFaqs();
  const { moveFaqUp } = useMoveFaqUp();
  const { moveFaqDown } = useMoveFaqDown();
  const { deleteFaq } = useDeleteFaq();
  const { Column, HeaderCell, Cell } = Table;
  const [tableLoading, setTableLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentAdminSelection.reloadFaqs) {
        dispatch(setReloadFaqs(false));
        setTableLoading(true);
        dispatch(setIsLoading(true));
        void getAllFaqs().then((response: GetFaqsResponse) => {
          if (!response.error && response.faqs) {
            dispatch(setAllFaqs(response.faqs));
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
  }, [getAllFaqs, dispatch, currentAdminSelection, tableLoading]);

  const addFaq = () => {
    const faq: Faq = {
      answer: '',
      category: {
        categoryId: 0,
        categoryName: '',
      },
      faqId: 0,
      order: 0,
      question: '',
    };
    dispatch(setSelectedFaq(faq));
    setTableLoading(true);
    router.push('/admin/faqs/edit');
  };

  const editFaq = (faqId: number) => {
    if (!faqId || isNaN(faqId)) {
      return;
    }
    const faq = currentAdminSelection.allFaqs?.find((x) => x.faqId === faqId);
    if (faq) {
      dispatch(setSelectedFaq(faq));
      setTableLoading(true);
      router.push('/admin/faqs/edit');
    }
  };

  const moveUp = (faqId: number) => {
    if (!faqId || isNaN(faqId)) {
      return;
    }
    void moveFaqUp(faqId).then(() => {
      dispatch(setReloadFaqs(true));
      dispatch(setIsLoading(true));
    });
  };

  const moveDown = (faqId: number) => {
    if (!faqId || isNaN(faqId)) {
      return;
    }
    void moveFaqDown(faqId).then(() => {
      dispatch(setReloadFaqs(true));
      dispatch(setIsLoading(true));
    });
  };

  const deleteOneFaq = (faqId: number) => {
    if (!faqId || isNaN(faqId)) {
      return;
    }
    void deleteFaq(faqId).then(() => {
      dispatch(setReloadFaqs(true));
      dispatch(setIsLoading(true));
    });
  };

  return (
    <div className="admin-container">
      <h3>Manage FAQs</h3>
      <Button onClick={addFaq}>Add FAQ</Button>
      <Table
        autoHeight
        data={currentAdminSelection.allFaqs}
        bordered
        cellBordered
        loading={tableLoading}
      >
        <Column flexGrow={1}>
          <HeaderCell>Category</HeaderCell>
          <Cell>
            {(rowData: Faq) => <span>{rowData.category ? rowData.category.categoryName : ''}</span>}
          </Cell>
        </Column>
        <Column flexGrow={1}>
          <HeaderCell>Order</HeaderCell>
          <Cell dataKey="order" />
        </Column>
        <Column flexGrow={3}>
          <HeaderCell>Question</HeaderCell>
          <Cell dataKey="question" />
        </Column>
        <Column flexGrow={7}>
          <HeaderCell> </HeaderCell>
          <Cell>
            {(rowData: Faq) => (
              <span>
                <FaArrowUp
                  className="admin-up-down-button"
                  onClick={() => moveUp(rowData.faqId)}
                  title="Move Up"
                />
                <FaArrowDown
                  className="admin-up-down-button"
                  onClick={() => moveDown(rowData.faqId)}
                  title="Move Down"
                />
                <Button onClick={() => editFaq(rowData.faqId)}>Edit</Button>
                <Button onClick={() => deleteOneFaq(rowData.faqId)}>Delete</Button>
              </span>
            )}
          </Cell>
        </Column>
      </Table>
    </div>
  );
}
