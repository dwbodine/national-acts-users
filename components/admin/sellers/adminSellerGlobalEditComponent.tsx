import { RootState } from '@/lib/store';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import router from 'next/router';
import {
  GetPermissionsResponse,
  Permission,
  Role,
  UpdateRoleResponse,
} from '@/types/user';
import { Button, Col, FormCheck, Row } from 'react-bootstrap';
import { setAdminSeller, setReloadRoles, setReloadSellers, setSelectedRole } from '@/lib/adminSelectionSlice';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { toast } from 'react-toastify';
import { Seller, SellerEventCategory } from '@/types/event';
import { useUpdateSeller } from '@/hooks/admin/useUpdateSeller';
import { ModifySellerResponse } from '@/types/admin';

export default function AdminSellerGlobalEdit() {
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const dispatch = useDispatch();
  const { updateSeller } = useUpdateSeller();
  const [sellerName, setSellerName] = useState('');
  const [hideInList, setHideInList] = useState(false);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentAdminSelection.ticketSocketAccounts == undefined || currentAdminSelection.selectedSeller == undefined) {
        goBack();
      } else {
        setSellerName(currentAdminSelection.selectedSeller.name);
        setHideInList(currentAdminSelection.selectedSeller.hideInList ?? false);
        setIsActive(currentAdminSelection.selectedSeller.isActive ?? false);
      }
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentAdminSelection, dispatch]);

  const goBack = () => {
    router.push('/admin/sellers/');
  };

  const updateSellerEventCategory = (ticketSocketId: number, eventCategoryId: number | undefined) => {
    if (!currentAdminSelection.selectedSeller || !ticketSocketId || isNaN(ticketSocketId)) {
      return;
    }
    
    let sellerToUpdate: Seller = { ...currentAdminSelection.selectedSeller };
    let currentCategories: SellerEventCategory[] = sellerToUpdate.sellerEventCategories
      ? [...sellerToUpdate.sellerEventCategories]
      : [];

    let changed = false;
    const existingPermission = currentCategories.find(x => x.ticketSocketId == ticketSocketId);
    if (!existingPermission) {
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
    } else if (existingPermission.eventCategoryId != eventCategoryId) {
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
    if (changed) {
      sellerToUpdate.sellerEventCategories = currentCategories;
      dispatch(setAdminSeller(sellerToUpdate));
    }
  };

  const onSubmit = () => {
    if (!currentAdminSelection.selectedSeller) {
      return false;
    }
    dispatch(setIsLoading(true));
    
    if (!sellerName) {
      toast.error('Seller name cannot be blank');
      return;
    }

    let sellerToUpdate: Seller = {
      ...currentAdminSelection.selectedSeller,
      name: sellerName,
      hideInList: hideInList,
      isActive: isActive,
    };

    if (!sellerToUpdate.sellerEventCategories || sellerToUpdate.sellerEventCategories.length == 0) {
      toast.error('Must select at least one category for a Ticket Socket account');
      return;
    }

    updateSeller(sellerToUpdate).then((response: ModifySellerResponse) => {
      if (response.success) {
        dispatch(setReloadSellers(true));
        toast.success('Save seller succeeded');
        router.push('/admin/sellers/');
      } else {
        toast.error(response.sellerError ?? 'Error occurred while saving seller');
      }
      dispatch(setIsLoading(false));
    });
  };

  const allAccounts = currentAdminSelection.ticketSocketAccounts;
  let categoryRows: any[] = [];
  if (allAccounts && allAccounts.length > 0 && currentAdminSelection.selectedSeller) {
    allAccounts.map((account, index) => {
      const selectedCategory = currentAdminSelection.selectedSeller?.sellerEventCategories?.find(x => x.ticketSocketId == account.ticketSocketId);
      const disabled = selectedCategory && selectedCategory.hasEvents;
      let options: any[] = [];
      options.push(<option key={`a${index}_00`} value={0}>
        {' '}
        -- Select one --
      </option>)
      account.categories?.map((x, i) => {
        options.push(<option key={`a${index}_${i}`} value={x.eventCategoryId}>{x.name}</option>);
      });
      const key = `account${index}`;
      categoryRows.push(
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

  const pageHeader =
    (currentAdminSelection.selectedSeller?.sellerId ?? 0 > 0) ? 'Edit seller' : 'Add seller';

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
            value={sellerName}
            onChange={(e) => setSellerName(e.target.value)}
            className="form-control form-control-half"
            placeholder="seller name"
            type="text"
            />
          </Col>
        </Row>
        {categoryRows}
        <Row className="form-group">
          <Col xs={2}></Col>
          <Col>
            <FormCheck
              checked={hideInList}
              onChange={(e) => setHideInList(e.target.checked)}
              label={'Hide in order tickets screen'}
            />
          </Col>
        </Row>
        <Row className="form-group">
          <Col xs={2}></Col>
          <Col>
            <FormCheck
              checked={!isActive}
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
