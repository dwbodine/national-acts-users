import { RootState } from '@/lib/store';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import router from 'next/router';
import { Button, Col, FormCheck, Row } from 'react-bootstrap';
import { setAdminSeller, setReloadPages, setReloadSellers, setSelectedPage } from '@/lib/adminSelectionSlice';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { toast } from 'react-toastify';
import { Seller, SellerEventCategory, SellerType } from '@/types/event';
import { useUpdateSeller } from '@/hooks/admin/useUpdateSeller';
import { ModifyPageResponse, ModifySellerResponse } from '@/types/admin';
import { useUpdatePage } from '@/hooks/admin/useUpdatePage';
import { Page } from '@/types/public';
import { setReloadReportData } from '@/lib/adminReportsSelectionSlice';

export default function AdminPageEdit() {
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const dispatch = useDispatch();
  const { updatePage } = useUpdatePage();
  const pageSellerTypeIds: number[] = [7, 14, 15, 16, 17, 18, 19];

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentAdminSelection.allSellers == undefined || currentAdminSelection.selectedPage == undefined) {
        goBack();
      }
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentAdminSelection, dispatch]);

  const goBack = () => {
    router.push('/admin/pages/');
  };

  const setSellerName = (sellerName: string) => {
    if (!currentAdminSelection.selectedSeller || !sellerName) {
      return;
    }
    let sellerToUpdate: Seller = { ...currentAdminSelection.selectedSeller };
    if (sellerToUpdate.name != sellerName) {
      sellerToUpdate.name = sellerName;
      dispatch(setAdminSeller(sellerToUpdate));
    }    
  }

  const setHideInList = (hide: boolean) => {
    if (!currentAdminSelection.selectedSeller) {
      return;
    }
    let sellerToUpdate: Seller = { ...currentAdminSelection.selectedSeller };
    if (sellerToUpdate.hideInList != hide) {
      sellerToUpdate.hideInList = hide;
      dispatch(setAdminSeller(sellerToUpdate));
    }    
  }

  const setIsActive = (isActive: boolean) => {
    if (!currentAdminSelection.selectedSeller) {
      return;
    }
    let sellerToUpdate: Seller = { ...currentAdminSelection.selectedSeller };
    if (sellerToUpdate.isActive != isActive) {
      sellerToUpdate.isActive = isActive;
      dispatch(setAdminSeller(sellerToUpdate));
    }    
  }

  const updateSellerEventCategory = (ticketSocketId: number, eventCategoryId: number | undefined) => {
    if (!currentAdminSelection.selectedSeller || !ticketSocketId || isNaN(ticketSocketId)) {
      return;
    }
    
    let sellerToUpdate: Seller = { ...currentAdminSelection.selectedSeller };
    let currentCategories: SellerEventCategory[] = sellerToUpdate.sellerEventCategories
      ? [...sellerToUpdate.sellerEventCategories]
      : [];

    let changed = false;
    const existingCategory = currentCategories.find(x => x.ticketSocketId == ticketSocketId);
    if (!existingCategory) {
      if (eventCategoryId != undefined) {
        const newCategory: SellerEventCategory = {
          sellerId: sellerToUpdate.sellerId, 
          ticketSocketId: ticketSocketId,
          eventCategoryId: eventCategoryId,
          sellerEventCategoryId: 0
        };
        currentCategories.push(newCategory);
        changed = true;
      }
    } else {
      if (existingCategory.eventCategoryId != eventCategoryId) {
        currentCategories = currentCategories.map(
          (x) => {
            if (x.ticketSocketId == ticketSocketId) {
              let cat = {...x};
              cat.eventCategoryId = eventCategoryId;
              return cat;
            } else {
              return x;
            }
        });
        changed = true;
      }
    }
    
    if (changed) {
      sellerToUpdate.sellerEventCategories = currentCategories;
      dispatch(setAdminSeller(sellerToUpdate));
    }
  };

  const updateSellerType = (sellerTypeValue: number | undefined) => {
    if (!currentAdminSelection.selectedSeller || !sellerTypeValue || isNaN(sellerTypeValue)) {
      return;
    }

    let sellerToUpdate: Seller = { ...currentAdminSelection.selectedSeller };
    if (sellerToUpdate.sellerType != sellerTypeValue) {
      sellerToUpdate.sellerType = sellerTypeValue;
      dispatch(setAdminSeller(sellerToUpdate));
    }
  };

  const onSubmit = () => {
    if (!currentAdminSelection.selectedPage) {
      return false;
    }

    let pageToUpdate: Page = {
      ...currentAdminSelection.selectedPage
    };

    if (!pageToUpdate.route) {
      toast.error('Route cannot be blank');
      return;
    }

    if (!pageToUpdate.title) {
      toast.error('Title cannot be blank');
      return;
    }

    if (!pageToUpdate.pageType) {
      toast.error('Must select a page type');
      return;
    }

    if (pageSellerTypeIds.includes(pageToUpdate.pageType.pageTypeId)) {
      const pageSellers = pageToUpdate.sellers?.filter(x => x.sellerId ?? 0 > 0);

      if (!pageSellers || pageSellers.length == 0) {
        toast.error('Must select at least one seller for this page');
        return;
      }
    }    

    dispatch(setIsLoading(true));

    updatePage(pageToUpdate).then((response: ModifyPageResponse) => {
      if (response.success) {
        dispatch(setReloadPages(true));
        toast.success('Save page succeeded');
        router.push('/admin/pages/');
      } else {
        toast.error(response.pageError ?? 'Error occurred while saving page');
      }
      dispatch(setIsLoading(false));
    });
  };

  const allSellers = currentAdminSelection.allSellers;
  let pageSellerRows: any[] = [];
  if (allSellers && allSellers.length > 0 && currentAdminSelection.selectedPage) {
    allSellers.map((seller, index) => {
      const selectedSeller = currentAdminSelection.selectedPage?.sellers?.find(x => x.sellerId == seller.sellerId);
      let options: any[] = [];
      options.push(<option key={`a${index}_00`} value={0}>
        {' '}
        -- Select one --
      </option>)
      account.categories?.map((x, i) => {
        options.push(<option key={`a${index}_${i}`} value={x.eventCategoryId}>{x.name}</option>);
      });
      const key = `account${index}`;
      pageSellerRows.push(
        <Row className="form-group">
          <Col xs={2}><label className="mt-4">Category for {account.name}</label></Col>
          <Col>
            <select
              disabled={disabled}
              key={key}
              id={account.ticketSocketId.toString()}
              onChange={(e) => updateSellerEventCategory(parseInt(`${account.ticketSocketId}`), parseInt(e.currentTarget.value))}
              defaultValue={selectedCategory?.eventCategoryId}
            >
              {options}
            </select>
        </Col>
        </Row>
      );
    });
  }

  let sellerTypeOptions: any[] = [];
  const sellerTypeValues = Object.values(SellerType).filter((v) => !isNaN(Number(v)));
  sellerTypeOptions.push(<option key={`st_00`} value={0}>
    {' '}
    -- Select one --
  </option>)
  sellerTypeValues.map((x, i) => {
    sellerTypeOptions.push(<option key={`st_${i}`} value={x}>{SellerType[Number(x)]}</option>);
  })

  const pageHeader =
    (currentAdminSelection.selectedSeller?.sellerId ?? 0 > 0) ? 'Edit seller' : 'Add seller';

  const selectedSellerType = Number(currentAdminSelection.selectedSeller?.sellerType ?? 0);
  
  return (
    <Row
      className="admin-container"
      hidden={
        !((allAccounts?.length ?? 0) > 0 && currentAdminSelection.selectedSeller != undefined)
      }
    >
      <Col>
        <Row>
          <Col><h1>{pageHeader}</h1></Col>
        </Row>
        <Row className="form-group">
          <Col xs={2}><label className="mt-4">Seller Name</label></Col>
          <Col>
            <input
            value={currentAdminSelection.selectedSeller?.name}
            onChange={(e) => setSellerName(e.target.value)}
            className="form-control form-control-half"
            placeholder="seller name"
            type="text"
            />
          </Col>
        </Row>
        <Row className="form-group">
          <Col xs={2}>
            <label className="mt-4">Seller Type</label>
          </Col>
          <Col>
            <select
              onChange={(e) => updateSellerType(parseInt(e.currentTarget.value))}
              defaultValue={selectedSellerType}
            >
              {sellerTypeOptions}
            </select>
          </Col>
        </Row>
        {categoryRows}
        <Row className="form-group">
          <Col xs={2}></Col>
          <Col>
            <FormCheck
              checked={currentAdminSelection.selectedSeller?.hideInList ?? false}
              onChange={(e) => setHideInList(e.target.checked)}
              label={'Hide in order tickets screen'}
            />
          </Col>
        </Row>
        <Row className="form-group">
          <Col xs={2}></Col>
          <Col>
            <FormCheck
              checked={!(currentAdminSelection.selectedSeller?.isActive ?? false)}
              onChange={(e) => setIsActive(!e.target.checked)}
              label={'Set to inactive'}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Button onClick={onSubmit}>Submit</Button> <Button onClick={goBack}>Back</Button>
          </Col>
        </Row>      
      </Col>
    </Row>
  );
}
