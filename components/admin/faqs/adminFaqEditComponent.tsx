import { RootState } from '@/lib/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import router from 'next/router';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { setAllFaqCategories, setMustSavePage, setReloadFaqs, setSelectedFaq } from '@/lib/adminSelectionSlice';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { toast } from 'react-toastify';
import { GetFaqCategoriesResponse, ModifyFaqResponse } from '@/types/admin';
import { Faq } from '@/types/public';
import ConfirmationDialog from '../../common/confirmationDialogComponent';
import { ItemDataType } from 'rsuite/esm/internals/types';
import { SelectPicker } from 'rsuite';
import { useUpdateFaq } from '@/hooks/admin/useUpdateFaq';
import { useGetAllFaqCategories } from '@/hooks/admin/useGetAllFaqCategories';

export default function AdminFaqEdit() {
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const dispatch = useDispatch();
  const { updateFaq } = useUpdateFaq();
  const { getAllFaqCategories } = useGetAllFaqCategories();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentAdminSelection.faqCategories == undefined) {
        dispatch(setIsLoading(true));
        getAllFaqCategories().then((response: GetFaqCategoriesResponse) => {
            dispatch(setAllFaqCategories(response.categories));
          });
        dispatch(setIsLoading(false));
      } else if (currentAdminSelection.allFaqs == undefined || currentAdminSelection.selectedFaq == undefined) {
        goBack();
      }
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentAdminSelection, dispatch, getAllFaqCategories]);

  const goBack = () => {
    toast.dismiss();
    router.push('/admin/faqs/');
  };

  const confirmGoBack = () => {
    if (!currentAdminSelection?.mustSavePage) {
      goBack();
      return;
    }

    const message: string =
      'You have made changes to this faq, are you sure you want to discard them and leave?';
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
        position: 'top-center',
        autoClose: false,
        closeOnClick: false,
      },
    );
  };

  const markDirty = () => {
    dispatch(setMustSavePage(true));
  };

  const setFaqCategory = (categoryId: number | null) => {
    if (!currentAdminSelection.selectedFaq?.category || !categoryId) {
      return;
    }
    const faqToUpdate: Faq = { ...currentAdminSelection.selectedFaq };
    if (faqToUpdate.category.categoryId != categoryId) {
      faqToUpdate.category = { categoryId: categoryId };
      dispatch(setSelectedFaq(faqToUpdate));
      markDirty();
    }
  }

  const setQuestion = (question: string) => {
    if (!currentAdminSelection.selectedFaq || !question) {
      return;
    }
    const faqToUpdate: Faq = { ...currentAdminSelection.selectedFaq };
    if (faqToUpdate.question != question) {
      faqToUpdate.question = question;
      dispatch(setSelectedFaq(faqToUpdate));
      markDirty();
    }
  }

  const setAnswer = (answer: string) => {
    if (!currentAdminSelection.selectedFaq || !answer) {
      return;
    }
    const faqToUpdate: Faq = { ...currentAdminSelection.selectedFaq };
    if (faqToUpdate.answer != answer) {
      faqToUpdate.answer = answer;
      dispatch(setSelectedFaq(faqToUpdate));
      markDirty();
    }
  }

  const onSubmit = () => {
    if (!currentAdminSelection.selectedFaq) {
      return false;
    }

    const faqToUpdate: Faq = {
      ...currentAdminSelection.selectedFaq
    };

    if (!faqToUpdate.category || !faqToUpdate.category.categoryId) {
      toast.error('Must select a category');
      return;
    }

    if (!faqToUpdate.question) {
      toast.error('Question cannot be blank');
      return;
    }

    if (!faqToUpdate.answer) {
      toast.error('Answer cannot be blank');
      return;
    }

    dispatch(setIsLoading(true));

    updateFaq(faqToUpdate).then((response: ModifyFaqResponse) => {
      if (response.success) {
        dispatch(setReloadFaqs(true));
        toast.success('Save FAQ succeeded');
        router.push('/admin/faqs/');
      } else {
        toast.error(response.faqError ?? 'Error occurred while saving FAQ');
      }
      dispatch(setIsLoading(false));
    });
  };

  const faqCategories: ItemDataType<number>[] = currentAdminSelection?.faqCategories ?
          currentAdminSelection.faqCategories.map((category) => {
            return {
              label: `${category.categoryName ?? ''}`,
              value: category.categoryId
            }
        }) : [];

  const pageHeader =
    (currentAdminSelection.selectedFaq?.faqId ?? 0 > 0) ? 'Edit FAQ' : 'Add FAQ';

  const categoryId = currentAdminSelection.selectedFaq?.category?.categoryId ?? 0;
  const question = currentAdminSelection.selectedFaq?.question;
  const answer = currentAdminSelection.selectedFaq?.answer;  

  return (
    <Row
      className="admin-container"
    >
      <Col>
        <Row>
          <Col><h1>{pageHeader}</h1></Col>
        </Row>
        <Row className="form-group">
          <Col>
            <label className="mt-4">Category</label>
            <SelectPicker
                value={categoryId}
                data={faqCategories}
                size="lg"        
                onChange={(cId) => setFaqCategory(cId)}
                cleanable={false}
                menuAutoWidth={true}
                className="admin-seller-select-value"
                searchable={false}
              />
          </Col>
        </Row>
        <Row className="form-group">
          <Col>
            <label className="mt-4">Question</label>
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="form-control form-control-half"
              placeholder="FAQ question"
              type="text"
            />
          </Col>
        </Row>
        <Row className="form-group">
          <Col>
            <label className="mt-4">HTML Text</label>
            <Form.Control as="textarea"
              rows={3}
              id="answer"
              onChange={(e) => setAnswer(e.currentTarget.value)}
              value={answer}
              placeholder='Free-form html text to be used as answer'
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Button onClick={onSubmit}>Submit</Button> <Button onClick={confirmGoBack}>Back</Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
