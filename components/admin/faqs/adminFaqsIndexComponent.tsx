import { useEffect, useState } from 'react';
import AdminListHomeButton from '../adminListHomeButton';
import { Table } from 'rsuite';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { setAllFaqs, setReloadFaqs, setSelectedFaq } from '@/lib/adminSelectionSlice';
import router from 'next/router';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { GetFaqsResponse, ModifyFaqResponse } from '@/types/admin';
import { Button } from 'react-bootstrap';
import { Faq } from '@/types/public';
import { useGetAllFaqs } from '@/hooks/admin/useGetAllFaqs';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa6';
import { useMoveFaqUp } from '@/hooks/admin/useMoveFaqUp';
import { useMoveFaqDown } from '@/hooks/admin/useMoveFaqDown';
import { useDeleteFaq } from '@/hooks/admin/useDeleteFaq';

export default function AdminFaqsIndex() {
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const dispatch = useDispatch();
  const { getAllFaqs } = useGetAllFaqs();
  const { moveFaqUp } = useMoveFaqUp();
  const { moveFaqDown } = useMoveFaqDown();
  const { deleteFaq } = useDeleteFaq();
  const { Column, HeaderCell, Cell } = Table;
  const [tableLoading, setTableLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentAdminSelection.reloadFaqs) {
        dispatch(setReloadFaqs(false));
        setTableLoading(true);
        dispatch(setIsLoading(true));
        getAllFaqs().then((response: GetFaqsResponse) => {
          if (!response.faqError && response.faqs) {
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
      faqId: 0,
      question: '',
      answer: '',
      order: 0,
      category: {
        categoryId: 0,
        categoryName: ''
      },
    };
    dispatch(setSelectedFaq(faq));
    setTableLoading(true);
    router.push('/admin/faqs/edit');    
  };

  const editFaq = (faqId: number) => {
    if (!faqId || isNaN(faqId)) {
      return;
    }
    let faq = currentAdminSelection.allFaqs?.find((x) => x.faqId == faqId);
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
    moveFaqUp(faqId).then ((response: ModifyFaqResponse) => {
      dispatch(setReloadFaqs(true));
      dispatch(setIsLoading(true));
    });
  };

  const moveDown = (faqId: number) => {
    if (!faqId || isNaN(faqId)) {
      return;
    }
    moveFaqDown(faqId).then ((response: ModifyFaqResponse) => {
      dispatch(setReloadFaqs(true));
      dispatch(setIsLoading(true));
    });
  };

  const deleteOneFaq = (faqId: number) => {
    if (!faqId || isNaN(faqId)) {
      return;
    }
    deleteFaq(faqId).then ((response: ModifyFaqResponse) => {
      dispatch(setReloadFaqs(true));
      dispatch(setIsLoading(true));
    });
  };

  return (
    <div className="admin-container">
      <h3>Manage FAQs</h3>
      <Button onClick={addFaq}>Add FAQ</Button><AdminListHomeButton />
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
            {(rowData) => (
                <span>{rowData.category?.categoryName}</span>
            )}
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
            {(rowData) => (
                <span>
                  <FaArrowUp className="admin-up-down-button" onClick={() => moveUp(parseInt(`${rowData.faqId}`))} title="Move Up" />
                  <FaArrowDown className="admin-up-down-button" onClick={() => moveDown(parseInt(`${rowData.faqId}`))} title="Move Down" />
                  <Button onClick={() => editFaq(parseInt(`${rowData.faqId}`))}>Edit</Button>
                  <Button onClick={() => deleteOneFaq(parseInt(`${rowData.faqId}`))}>Delete</Button>
                </span>
            )}
          </Cell>
        </Column>
      </Table>
      <AdminListHomeButton />
    </div>
  );
}
