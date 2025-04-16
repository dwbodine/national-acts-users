import { RootState } from '@/lib/store';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import router from 'next/router';
import { Button, Col, FormCheck, Row } from 'react-bootstrap';
import { setAdminSeller, setReloadSellers } from '@/lib/adminSelectionSlice';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { toast } from 'react-toastify';
import { Seller, SellerEventCategory, SellerType } from '@/types/event';
import { useUpdateSeller } from '@/hooks/admin/useUpdateSeller';
import { ModifySellerResponse } from '@/types/admin';
import { setEngine } from 'crypto';

export default function AdminSellerGlobalEdit() {
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const dispatch = useDispatch();
  const { updateSeller } = useUpdateSeller();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentAdminSelection.ticketSocketAccounts == undefined || currentAdminSelection.selectedSeller == undefined) {
        goBack();
      }
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentAdminSelection, dispatch]);

  const goBack = () => {
    router.push('/admin/sellers/');
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

  const setAddress = (address: string) => {
    if (!currentAdminSelection.selectedSeller) {
      return;
    }
    let sellerToUpdate: Seller = { ...currentAdminSelection.selectedSeller };
    if (sellerToUpdate.address != address) {
      sellerToUpdate.address = address;
      dispatch(setAdminSeller(sellerToUpdate));
    }    
  }

  const setCity = (city: string) => {
    if (!currentAdminSelection.selectedSeller) {
      return;
    }
    let sellerToUpdate: Seller = { ...currentAdminSelection.selectedSeller };
    if (sellerToUpdate.city != city) {
      sellerToUpdate.city = city;
      dispatch(setAdminSeller(sellerToUpdate));
    }    
  }

  const setState = (state: string) => {
    if (!currentAdminSelection.selectedSeller) {
      return;
    }
    let sellerToUpdate: Seller = { ...currentAdminSelection.selectedSeller };
    if (sellerToUpdate.state != state) {
      sellerToUpdate.state = state;
      dispatch(setAdminSeller(sellerToUpdate));
    }    
  }

  const setZip = (zip: string) => {
    if (!currentAdminSelection.selectedSeller) {
      return;
    }
    let sellerToUpdate: Seller = { ...currentAdminSelection.selectedSeller };
    if (sellerToUpdate.zip != zip) {
      sellerToUpdate.zip = zip;
      dispatch(setAdminSeller(sellerToUpdate));
    }    
  }

  const setCountry = (country: string) => {
    if (!currentAdminSelection.selectedSeller) {
      return;
    }
    let sellerToUpdate: Seller = { ...currentAdminSelection.selectedSeller };
    if (sellerToUpdate.country != country) {
      sellerToUpdate.country = country;
      dispatch(setAdminSeller(sellerToUpdate));
    }    
  }

  const setPhone = (phone: string) => {
    if (!currentAdminSelection.selectedSeller) {
      return;
    }
    let sellerToUpdate: Seller = { ...currentAdminSelection.selectedSeller };
    if (sellerToUpdate.phone != phone) {
      sellerToUpdate.phone = phone;
      dispatch(setAdminSeller(sellerToUpdate));
    }    
  }

  const setEmail = (email: string) => {
    if (!currentAdminSelection.selectedSeller) {
      return;
    }
    let sellerToUpdate: Seller = { ...currentAdminSelection.selectedSeller };
    if (sellerToUpdate.email != email) {
      sellerToUpdate.email = email;
      dispatch(setAdminSeller(sellerToUpdate));
    }    
  }

  const setTwitter = (twitter: string) => {
    if (!currentAdminSelection.selectedSeller) {
      return;
    }
    let sellerToUpdate: Seller = { ...currentAdminSelection.selectedSeller };
    if (sellerToUpdate.twitter != twitter) {
      sellerToUpdate.twitter = twitter;
      dispatch(setAdminSeller(sellerToUpdate));
    }    
  }

  const setFacebook = (facebook: string) => {
    if (!currentAdminSelection.selectedSeller) {
      return;
    }
    let sellerToUpdate: Seller = { ...currentAdminSelection.selectedSeller };
    if (sellerToUpdate.facebook != facebook) {
      sellerToUpdate.facebook = facebook;
      dispatch(setAdminSeller(sellerToUpdate));
    }    
  }

  const setInstagram = (instagram: string) => {
    if (!currentAdminSelection.selectedSeller) {
      return;
    }
    let sellerToUpdate: Seller = { ...currentAdminSelection.selectedSeller };
    if (sellerToUpdate.instagram != instagram) {
      sellerToUpdate.instagram = instagram;
      dispatch(setAdminSeller(sellerToUpdate));
    }    
  }

  const setYouTube = (youtube: string) => {
    if (!currentAdminSelection.selectedSeller) {
      return;
    }
    let sellerToUpdate: Seller = { ...currentAdminSelection.selectedSeller };
    if (sellerToUpdate.youtube != youtube) {
      sellerToUpdate.youtube = youtube;
      dispatch(setAdminSeller(sellerToUpdate));
    }    
  }

  const setSpotify = (spotify: string) => {
    if (!currentAdminSelection.selectedSeller) {
      return;
    }
    let sellerToUpdate: Seller = { ...currentAdminSelection.selectedSeller };
    if (sellerToUpdate.spotify != spotify) {
      sellerToUpdate.spotify = spotify;
      dispatch(setAdminSeller(sellerToUpdate));
    }    
  }

  const setWebsite = (website: string) => {
    if (!currentAdminSelection.selectedSeller) {
      return;
    }
    let sellerToUpdate: Seller = { ...currentAdminSelection.selectedSeller };
    if (sellerToUpdate.website != website) {
      sellerToUpdate.website = website;
      dispatch(setAdminSeller(sellerToUpdate));
    }    
  }

  const setWebsiteDisplayText = (websiteDisplayText: string) => {
    if (!currentAdminSelection.selectedSeller) {
      return;
    }
    let sellerToUpdate: Seller = { ...currentAdminSelection.selectedSeller };
    if (sellerToUpdate.websiteDisplayText != websiteDisplayText) {
      sellerToUpdate.websiteDisplayText = websiteDisplayText;
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
    if (!currentAdminSelection.selectedSeller) {
      return false;
    }

    let sellerToUpdate: Seller = {
      ...currentAdminSelection.selectedSeller
    };

    if (!sellerToUpdate.name) {
      toast.error('Seller name cannot be blank');
      return;
    }

    const sellerEventCategories = sellerToUpdate.sellerEventCategories?.filter(x => x.eventCategoryId ?? 0 > 0);

    if (!sellerEventCategories || sellerEventCategories.length == 0) {
      toast.error('Must select a category for at least one Ticket Socket account');
      return;
    }

    dispatch(setIsLoading(true));

    updateSeller(sellerToUpdate).then((response: ModifySellerResponse) => {
      if (response.success) {
        dispatch(setReloadSellers(true));
        toast.success('Save seller succeeded');
        dispatch(setAdminSeller(undefined));
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

  const selectedSellerType = Number(currentAdminSelection.selectedSeller?.sellerType ?? 1);

  const isArtist = selectedSellerType == SellerType.Artist;
  
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
            <h2>Set Default Values</h2>
          </Col>
        </Row>
        <Row className="form-group" hidden={isArtist}>
          <Col xs={2}><label className="mt-4">Address</label></Col>
          <Col>
            <input
            value={currentAdminSelection.selectedSeller?.address}
            onChange={(e) => setAddress(e.target.value)}
            className="form-control form-control-half"
            placeholder="address"
            type="text"
            />
          </Col>
        </Row>
        <Row className="form-group" hidden={isArtist}>
          <Col xs={2}><label className="mt-4">City</label></Col>
          <Col>
            <input
            value={currentAdminSelection.selectedSeller?.city}
            onChange={(e) => setCity(e.target.value)}
            className="form-control form-control-half"
            placeholder="city"
            type="text"
            />
          </Col>
        </Row>
        <Row className="form-group" hidden={isArtist}>
          <Col xs={2}><label className="mt-4">State</label></Col>
          <Col>
            <input
            value={currentAdminSelection.selectedSeller?.state}
            onChange={(e) => setState(e.target.value)}
            className="form-control form-control-half"
            placeholder="state"
            type="text"
            />
          </Col>
        </Row>
        <Row className="form-group" hidden={isArtist}>
          <Col xs={2}><label className="mt-4">Postal Code</label></Col>
          <Col>
            <input
            value={currentAdminSelection.selectedSeller?.zip}
            onChange={(e) => setZip(e.target.value)}
            className="form-control form-control-half"
            placeholder="postal code"
            type="text"
            />
          </Col>
        </Row>
        <Row className="form-group" hidden={isArtist}>
          <Col xs={2}><label className="mt-4">Country</label></Col>
          <Col>
            <input
            value={currentAdminSelection.selectedSeller?.country}
            onChange={(e) => setCountry(e.target.value)}
            className="form-control form-control-half"
            placeholder="country (leave blank for USA)"
            type="text"
            />
          </Col>
        </Row>
        <Row className="form-group">
          <Col xs={2}><label className="mt-4">Phone</label></Col>
          <Col>
            <input
            value={currentAdminSelection.selectedSeller?.phone}
            onChange={(e) => setPhone(e.target.value)}
            className="form-control form-control-half"
            placeholder="phone"
            type="text"
            />
          </Col>
        </Row>
        <Row className="form-group">
          <Col xs={2}><label className="mt-4">Email</label></Col>
          <Col>
            <input
            value={currentAdminSelection.selectedSeller?.email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control form-control-half"
            placeholder="email"
            type="email"
            />
          </Col>
        </Row>
        <Row className="form-group">
          <Col xs={2}><label className="mt-4">Twitter</label></Col>
          <Col>
            <input
            value={currentAdminSelection.selectedSeller?.twitter}
            onChange={(e) => setTwitter(e.target.value)}
            className="form-control form-control-half"
            placeholder="Twitter (X) url"
            type="text"
            />
          </Col>
        </Row>
        <Row className="form-group">
          <Col xs={2}><label className="mt-4">Facebook</label></Col>
          <Col>
            <input
            value={currentAdminSelection.selectedSeller?.facebook}
            onChange={(e) => setFacebook(e.target.value)}
            className="form-control form-control-half"
            placeholder="Facebook url"
            type="text"
            />
          </Col>
        </Row>
        <Row className="form-group">
          <Col xs={2}><label className="mt-4">Instagram</label></Col>
          <Col>
            <input
            value={currentAdminSelection.selectedSeller?.instagram}
            onChange={(e) => setInstagram(e.target.value)}
            className="form-control form-control-half"
            placeholder="Instagram url"
            type="text"
            />
          </Col>
        </Row>
        <Row className="form-group">
          <Col xs={2}><label className="mt-4">YouTube</label></Col>
          <Col>
            <input
            value={currentAdminSelection.selectedSeller?.youtube}
            onChange={(e) => setYouTube(e.target.value)}
            className="form-control form-control-half"
            placeholder="YouTube url"
            type="text"
            />
          </Col>
        </Row>
        <Row className="form-group">
          <Col xs={2}><label className="mt-4">Spotify</label></Col>
          <Col>
            <input
            value={currentAdminSelection.selectedSeller?.spotify}
            onChange={(e) => setSpotify(e.target.value)}
            className="form-control form-control-half"
            placeholder="Spotify url"
            type="text"
            />
          </Col>
        </Row>
        <Row className="form-group">
          <Col xs={2}><label className="mt-4">Website</label></Col>
          <Col>
            <input
            value={currentAdminSelection.selectedSeller?.website}
            onChange={(e) => setWebsite(e.target.value)}
            className="form-control form-control-half"
            placeholder="Website url"
            type="text"
            />
          </Col>
        </Row>
        <Row className="form-group">
          <Col xs={2}><label className="mt-4">Website Display Text</label></Col>
          <Col>
            <input
            value={currentAdminSelection.selectedSeller?.phone}
            onChange={(e) => setWebsiteDisplayText(e.target.value)}
            className="form-control form-control-half"
            placeholder="Website display text (shown instead of url)"
            type="text"
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
