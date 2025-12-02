'use client';

import { Button, Checkbox, Col, Input, Row, SelectPicker } from 'rsuite';
import { ReactElement, useCallback, useEffect } from 'react';
import { Seller, SellerEventCategory, SellerType } from '@/types/event';
import { setAdminSeller, setReloadSellers } from '@/lib/adminSelectionSlice';
import { useDispatch, useSelector } from 'react-redux';
import { ItemDataType } from 'rsuite/esm/internals/types';
import { ModifySellerResponse } from '@/types/responses';
import { RootState } from '@/lib/store';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useUpdateSeller } from '@/hooks/admin/useUpdateSeller';

export default function AdminSellerGlobalEdit() {
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const dispatch = useDispatch();
  const { updateSeller } = useUpdateSeller();
  const router = useRouter();
  const currentSeller = currentAdminSelection.selectedSeller;
  const selectedSellerType = Number(currentSeller?.sellerType ?? 1);
  const isArtist = selectedSellerType === Number(SellerType.Artist);

  const goBack = useCallback(() => {
    router.push('/admin/sellers');
  }, [router]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (
        currentAdminSelection.ticketSocketAccounts === undefined ||
        currentAdminSelection.selectedSeller === undefined
      ) {
        goBack();
      }
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentAdminSelection, dispatch, goBack]);

  const setSellerName = (sellerName: string) => {
    if (!currentAdminSelection.selectedSeller || !sellerName) {
      return;
    }
    const sellerToUpdate: Seller = { ...currentAdminSelection.selectedSeller };
    if (sellerToUpdate.name !== sellerName) {
      sellerToUpdate.name = sellerName;
      dispatch(setAdminSeller(sellerToUpdate));
    }
  };

  const setAddress = (address: string) => {
    if (!currentAdminSelection.selectedSeller) {
      return;
    }
    const sellerToUpdate: Seller = { ...currentAdminSelection.selectedSeller };
    if (sellerToUpdate.address !== address) {
      sellerToUpdate.address = address;
      dispatch(setAdminSeller(sellerToUpdate));
    }
  };

  const setCity = (city: string) => {
    if (!currentAdminSelection.selectedSeller) {
      return;
    }
    const sellerToUpdate: Seller = { ...currentAdminSelection.selectedSeller };
    if (sellerToUpdate.city !== city) {
      sellerToUpdate.city = city;
      dispatch(setAdminSeller(sellerToUpdate));
    }
  };

  const setState = (state: string) => {
    if (!currentAdminSelection.selectedSeller) {
      return;
    }
    const sellerToUpdate: Seller = { ...currentAdminSelection.selectedSeller };
    if (sellerToUpdate.state !== state) {
      sellerToUpdate.state = state;
      dispatch(setAdminSeller(sellerToUpdate));
    }
  };

  const setZip = (zip: string) => {
    if (!currentAdminSelection.selectedSeller) {
      return;
    }
    const sellerToUpdate: Seller = { ...currentAdminSelection.selectedSeller };
    if (sellerToUpdate.zip !== zip) {
      sellerToUpdate.zip = zip;
      dispatch(setAdminSeller(sellerToUpdate));
    }
  };

  const onCountryChange = (countryId: number | null) => {
    if (!currentAdminSelection.selectedSeller) {
      return;
    }
    const sellerToUpdate: Seller = { ...currentAdminSelection.selectedSeller };
    if (!countryId) {
      sellerToUpdate.country = undefined;
      dispatch(setAdminSeller(sellerToUpdate));
    } else if (!sellerToUpdate.country || sellerToUpdate.country.countryId !== countryId) {
      sellerToUpdate.country = { countryId };
      dispatch(setAdminSeller(sellerToUpdate));
    }
  };

  const setPhone = (phone: string) => {
    if (!currentAdminSelection.selectedSeller) {
      return;
    }
    const sellerToUpdate: Seller = { ...currentAdminSelection.selectedSeller };
    if (sellerToUpdate.phone !== phone) {
      sellerToUpdate.phone = phone;
      dispatch(setAdminSeller(sellerToUpdate));
    }
  };

  const setEmail = (email: string) => {
    if (!currentAdminSelection.selectedSeller) {
      return;
    }
    const sellerToUpdate: Seller = { ...currentAdminSelection.selectedSeller };
    if (sellerToUpdate.email !== email) {
      sellerToUpdate.email = email;
      dispatch(setAdminSeller(sellerToUpdate));
    }
  };

  const setTwitter = (twitter: string) => {
    if (!currentAdminSelection.selectedSeller) {
      return;
    }
    const sellerToUpdate: Seller = { ...currentAdminSelection.selectedSeller };
    if (sellerToUpdate.twitter !== twitter) {
      sellerToUpdate.twitter = twitter;
      dispatch(setAdminSeller(sellerToUpdate));
    }
  };

  const setFacebook = (facebook: string) => {
    if (!currentAdminSelection.selectedSeller) {
      return;
    }
    const sellerToUpdate: Seller = { ...currentAdminSelection.selectedSeller };
    if (sellerToUpdate.facebook !== facebook) {
      sellerToUpdate.facebook = facebook;
      dispatch(setAdminSeller(sellerToUpdate));
    }
  };

  const setInstagram = (instagram: string) => {
    if (!currentAdminSelection.selectedSeller) {
      return;
    }
    const sellerToUpdate: Seller = { ...currentAdminSelection.selectedSeller };
    if (sellerToUpdate.instagram !== instagram) {
      sellerToUpdate.instagram = instagram;
      dispatch(setAdminSeller(sellerToUpdate));
    }
  };

  const setYouTube = (youtube: string) => {
    if (!currentAdminSelection.selectedSeller) {
      return;
    }
    const sellerToUpdate: Seller = { ...currentAdminSelection.selectedSeller };
    if (sellerToUpdate.youtube !== youtube) {
      sellerToUpdate.youtube = youtube;
      dispatch(setAdminSeller(sellerToUpdate));
    }
  };

  const setSpotify = (spotify: string) => {
    if (!currentAdminSelection.selectedSeller) {
      return;
    }
    const sellerToUpdate: Seller = { ...currentAdminSelection.selectedSeller };
    if (sellerToUpdate.spotify !== spotify) {
      sellerToUpdate.spotify = spotify;
      dispatch(setAdminSeller(sellerToUpdate));
    }
  };

  const setWebsite = (website: string) => {
    if (!currentAdminSelection.selectedSeller) {
      return;
    }
    const sellerToUpdate: Seller = { ...currentAdminSelection.selectedSeller };
    if (sellerToUpdate.website !== website) {
      sellerToUpdate.website = website;
      dispatch(setAdminSeller(sellerToUpdate));
    }
  };

  const setWebsiteDisplayText = (websiteDisplayText: string) => {
    if (!currentAdminSelection.selectedSeller) {
      return;
    }
    const sellerToUpdate: Seller = { ...currentAdminSelection.selectedSeller };
    if (sellerToUpdate.websiteDisplayText !== websiteDisplayText) {
      sellerToUpdate.websiteDisplayText = websiteDisplayText;
      dispatch(setAdminSeller(sellerToUpdate));
    }
  };

  const setHideInList = (hide: boolean) => {
    if (!currentAdminSelection.selectedSeller) {
      return;
    }
    const sellerToUpdate: Seller = { ...currentAdminSelection.selectedSeller };
    if (sellerToUpdate.hideInList !== hide) {
      sellerToUpdate.hideInList = hide;
      dispatch(setAdminSeller(sellerToUpdate));
    }
  };

  const setIsActive = (isActive: boolean) => {
    if (!currentAdminSelection.selectedSeller) {
      return;
    }
    const sellerToUpdate: Seller = { ...currentAdminSelection.selectedSeller };
    if (sellerToUpdate.isActive !== isActive) {
      sellerToUpdate.isActive = isActive;
      dispatch(setAdminSeller(sellerToUpdate));
    }
  };

  const updateSellerEventCategory = (
    ticketSocketId: number,
    eventCategoryId: number | undefined,
  ) => {
    if (!currentAdminSelection.selectedSeller || !ticketSocketId || isNaN(ticketSocketId)) {
      return;
    }

    const sellerToUpdate: Seller = { ...currentAdminSelection.selectedSeller };
    let currentCategories: SellerEventCategory[] = sellerToUpdate.sellerEventCategories
      ? [...sellerToUpdate.sellerEventCategories]
      : [];

    let changed = false;
    const existingCategory = currentCategories.find((x) => x.ticketSocketId === ticketSocketId);
    if (existingCategory) {
      if (existingCategory.eventCategoryId !== eventCategoryId) {
        currentCategories = currentCategories.map((x) => {
          if (x.ticketSocketId === ticketSocketId) {
            const cat = { ...x };
            cat.eventCategoryId = eventCategoryId;
            cat.isVisibleOnSite = eventCategoryId !== undefined && eventCategoryId > 0;
            cat.isVisibleOnPortal = eventCategoryId !== undefined && eventCategoryId > 0;
            return cat;
          }
          return x;
        });
        changed = true;
      }
    } else if (eventCategoryId !== undefined) {
      const newCategory: SellerEventCategory = {
        eventCategoryId,
        isVisibleOnPortal: true,
        isVisibleOnSite: true,
        sellerEventCategoryId: 0,
        sellerId: sellerToUpdate.sellerId,
        ticketSocketId,
      };
      currentCategories.push(newCategory);
      changed = true;
    }

    if (changed) {
      sellerToUpdate.sellerEventCategories = currentCategories;
      dispatch(setAdminSeller(sellerToUpdate));
    }
  };

  const updateSellerEventCategorySiteVisible = (
    ticketSocketId: number,
    eventCategoryId: number,
    isVisibleOnSite: boolean,
  ) => {
    if (
      !currentAdminSelection.selectedSeller ||
      !ticketSocketId ||
      isNaN(ticketSocketId) ||
      !eventCategoryId ||
      isNaN(eventCategoryId)
    ) {
      return;
    }

    const sellerToUpdate: Seller = { ...currentAdminSelection.selectedSeller };
    let currentCategories: SellerEventCategory[] = sellerToUpdate.sellerEventCategories
      ? [...sellerToUpdate.sellerEventCategories]
      : [];

    const existingCategory = currentCategories.find((x) => x.ticketSocketId === ticketSocketId);
    if (!existingCategory) {
      return;
    }

    currentCategories = currentCategories.map((x) => {
      if (x.ticketSocketId === ticketSocketId && x.eventCategoryId === eventCategoryId) {
        const cat = { ...x };
        cat.isVisibleOnSite = isVisibleOnSite;
        return cat;
      }
      return x;
    });

    sellerToUpdate.sellerEventCategories = currentCategories;
    dispatch(setAdminSeller(sellerToUpdate));
  };

  const updateSellerEventCategoryPortalVisible = (
    ticketSocketId: number,
    eventCategoryId: number | undefined,
    isVisibleOnPortal: boolean,
  ) => {
    if (
      !currentAdminSelection.selectedSeller ||
      !ticketSocketId ||
      isNaN(ticketSocketId) ||
      !eventCategoryId ||
      isNaN(eventCategoryId)
    ) {
      return;
    }

    const sellerToUpdate: Seller = { ...currentAdminSelection.selectedSeller };
    let currentCategories: SellerEventCategory[] = sellerToUpdate.sellerEventCategories
      ? [...sellerToUpdate.sellerEventCategories]
      : [];

    const existingCategory = currentCategories.find((x) => x.ticketSocketId === ticketSocketId);
    if (!existingCategory) {
      return;
    }

    currentCategories = currentCategories.map((x) => {
      if (x.ticketSocketId === ticketSocketId && x.eventCategoryId === eventCategoryId) {
        const cat = { ...x };
        cat.isVisibleOnPortal = isVisibleOnPortal;
        return cat;
      }
      return x;
    });

    sellerToUpdate.sellerEventCategories = currentCategories;
    dispatch(setAdminSeller(sellerToUpdate));
  };

  const updateSellerType = (sellerTypeValue: number | undefined) => {
    if (!currentAdminSelection.selectedSeller || !sellerTypeValue || isNaN(sellerTypeValue)) {
      return;
    }

    const sellerToUpdate: Seller = { ...currentAdminSelection.selectedSeller };
    if (Number(sellerToUpdate.sellerType) !== sellerTypeValue) {
      sellerToUpdate.sellerType = sellerTypeValue;
      dispatch(setAdminSeller(sellerToUpdate));
    }
  };

  const checkAddress = () => {
    if (isArtist) {
      return true;
    }
    const address = currentAdminSelection.selectedSeller?.address;
    const city = currentAdminSelection.selectedSeller?.city;
    const state = currentAdminSelection.selectedSeller?.state;
    const zip = currentAdminSelection.selectedSeller?.zip;
    const countryId = currentAdminSelection.selectedSeller?.country?.countryId;

    if (address) {
      if (!city) {
        toast.error('City is required if entering an address');
        return false;
      }
      if (!countryId) {
        toast.error('Country is required if entering an address');
        return false;
      }
      if (!state && !zip) {
        toast.error('One of either state or zip is required if entering an address');
        return false;
      }
    } else if (city) {
      if (!address) {
        toast.error('Street address is required if entering an address');
        return false;
      }
      if (!countryId) {
        toast.error('Country is required if entering an address');
        return false;
      }
      if (!state && !zip) {
        toast.error('One of either state or zip is required if entering an address');
        return false;
      }
    } else if (countryId) {
      if (!address) {
        toast.error('Street address is required if entering an address');
        return false;
      }
      if (!city) {
        toast.error('City is required if entering an address');
        return false;
      }
      if (!state && !zip) {
        toast.error('One of either state or zip is required if entering an address');
        return false;
      }
    } else if (state || zip) {
      if (!address) {
        toast.error('Street address is required if entering an address');
        return false;
      }
      if (!city) {
        toast.error('City is required if entering an address');
        return false;
      }
      if (!countryId) {
        toast.error('Country is required if entering an address');
        return false;
      }
    }
    return true;
  };

  const onSubmit = () => {
    if (!currentAdminSelection.selectedSeller) {
      return;
    }

    const sellerToUpdate: Seller = {
      ...currentAdminSelection.selectedSeller,
    };

    if (!sellerToUpdate.name) {
      toast.error('Seller name cannot be blank');
      return;
    }

    const sellerEventCategories = sellerToUpdate.sellerEventCategories?.filter(
      (x) => (x.eventCategoryId ?? 0) > 0,
    );

    if (!sellerEventCategories || sellerEventCategories.length === 0) {
      toast.error('Must select a category for at least one Ticket Socket account');
      return;
    }

    if (!checkAddress()) {
      return;
    }

    dispatch(setIsLoading(true));

    void updateSeller(sellerToUpdate).then((response: ModifySellerResponse) => {
      if (response.success) {
        dispatch(setReloadSellers(true));
        toast.success('Save seller succeeded');
        dispatch(setAdminSeller(undefined));
        router.push('/admin/sellers');
      } else {
        toast.error(response.error ?? 'Error occurred while saving seller');
      }
      dispatch(setIsLoading(false));
    });
  };

  const allAccounts = currentAdminSelection.ticketSocketAccounts;
  const categoryRows: ReactElement[] = [];
  if (allAccounts && allAccounts.length > 0 && currentAdminSelection.selectedSeller) {
    allAccounts.forEach((account, index) => {
      const selectedCategory = currentAdminSelection.selectedSeller?.sellerEventCategories?.find(
        (x) => x.ticketSocketId === account.ticketSocketId,
      );
      const disabled = selectedCategory && selectedCategory.hasEvents;
      const options: ReactElement[] = [];
      options.push(
        <option key={`a${index}_00`} value={0}>
          {' '}
          -- Select one --
        </option>,
      );
      account.categories?.forEach((x, i) => {
        options.push(
          <option key={`a${index}_${i}`} value={x.eventCategoryId}>
            {x.name}
          </option>,
        );
      });
      const rowKey = `accoutnRow${index}`;
      const key = `account${index}`;
      categoryRows.push(
        <Row key={rowKey} className="form-group">
          <Col xs={2}>
            <label className="mt-4">Category for {account.name}</label>
          </Col>
          <Col xs={2}>
            <SelectPicker
              data={options}
              disabled={disabled}
              key={key}
              id={account.ticketSocketId.toString()}
              onChange={(value) =>
                updateSellerEventCategory(parseInt(`${account.ticketSocketId}`), value ?? undefined)
              }
              defaultValue={selectedCategory?.eventCategoryId}
            />
          </Col>
          <Col xs={1}>
            <Checkbox
              disabled={!selectedCategory}
              checked={selectedCategory?.isVisibleOnSite ?? false}
              onChange={(_, checked) =>
                updateSellerEventCategorySiteVisible(
                  parseInt(`${account.ticketSocketId}`),
                  parseInt(`${selectedCategory?.eventCategoryId}`),
                  checked,
                )
              }
            >
              Visible on site?
            </Checkbox>
          </Col>
          <Col xs={1}>
            <Checkbox
              disabled={!selectedCategory}
              checked={selectedCategory?.isVisibleOnPortal ?? false}
              onChange={(_, checked) =>
                updateSellerEventCategoryPortalVisible(
                  parseInt(`${account.ticketSocketId}`),
                  parseInt(`${selectedCategory?.eventCategoryId}`),
                  checked,
                )
              }
            >
              Visible on portal?
            </Checkbox>
          </Col>
        </Row>,
      );
    });
  }

  const sellerTypeOptions: ReactElement[] = [];
  const sellerTypeValues = Object.values(SellerType).filter((v) => !isNaN(Number(v)));
  sellerTypeOptions.push(
    <option key={`st_00`} value={0}>
      {' '}
      -- Select one --
    </option>,
  );
  sellerTypeValues.forEach((x, i) => {
    sellerTypeOptions.push(
      <option key={`st_${i}`} value={x}>
        {SellerType[Number(x)]}
      </option>,
    );
  });

  const pageHeader = (currentSeller?.sellerId ?? 0) > 0 ? 'Edit seller' : 'Add seller';

  const countryList: ItemDataType<number>[] = currentAdminSelection.countries
    ? currentAdminSelection.countries.map((country) => ({
        label: `${country.countryName}`,
        value: country.countryId,
      }))
    : [];

  return (
    <Row
      className="admin-container"
      hidden={!((allAccounts?.length ?? 0) > 0 && currentSeller !== undefined)}
    >
      <Col>
        <Row>
          <Col>
            <h1>{pageHeader}</h1>
          </Col>
        </Row>
        <Row className="form-group">
          <Col xs={2}>
            <label className="mt-4">Seller Name</label>
          </Col>
          <Col>
            <Input
              value={currentSeller?.name ?? ''}
              onChange={setSellerName}
              className="form-control form-control-half"
              placeholder="seller name"
            />
          </Col>
        </Row>
        <Row className="form-group">
          <Col xs={2}>
            <label className="mt-4">Seller Type</label>
          </Col>
          <Col>
            <SelectPicker
              onChange={(value) => updateSellerType(value ?? undefined)}
              defaultValue={selectedSellerType}
              data={sellerTypeOptions}
            />
          </Col>
        </Row>
        {categoryRows}
        <Row className="form-group">
          <Col xs={2}></Col>
          <Col>
            <Checkbox
              checked={currentSeller?.hideInList ?? false}
              onChange={(_, checked) => setHideInList(checked)}
            >
              Hide in order tickets screen
            </Checkbox>
          </Col>
        </Row>
        <Row className="form-group">
          <Col xs={2}></Col>
          <Col>
            <Checkbox
              checked={!(currentSeller?.isActive ?? false)}
              onChange={(_, checked) => setIsActive(!checked)}
            >
              Set to inactive
            </Checkbox>
          </Col>
        </Row>
        <Row>
          <Col>
            <h2>Set Default Values</h2>
          </Col>
        </Row>
        <Row className="form-group" hidden={isArtist}>
          <Col xs={2}>
            <label className="mt-4">Address</label>
          </Col>
          <Col>
            <Input
              value={currentSeller?.address ?? ''}
              onChange={setAddress}
              className="form-control form-control-half"
              placeholder="address"
            />
          </Col>
        </Row>
        <Row className="form-group" hidden={isArtist}>
          <Col xs={2}>
            <label className="mt-4">City</label>
          </Col>
          <Col>
            <Input
              value={currentSeller?.city ?? ''}
              onChange={setCity}
              className="form-control form-control-half"
              placeholder="city"
            />
          </Col>
        </Row>
        <Row className="form-group" hidden={isArtist}>
          <Col xs={2}>
            <label className="mt-4">State</label>
          </Col>
          <Col>
            <Input
              value={currentSeller?.state ?? ''}
              onChange={setState}
              className="form-control form-control-half"
              placeholder="state"
            />
          </Col>
        </Row>
        <Row className="form-group" hidden={isArtist}>
          <Col xs={2}>
            <label className="mt-4">Postal Code</label>
          </Col>
          <Col>
            <Input
              value={currentSeller?.zip ?? ''}
              onChange={setZip}
              className="form-control form-control-half"
              placeholder="postal code"
            />
          </Col>
        </Row>
        <Row className="form-group" hidden={isArtist}>
          <Col xs={2}>
            <label className="mt-4">Country</label>
          </Col>
          <Col>
            <SelectPicker
              className="admin-seller-select-value"
              menuAutoWidth={true}
              value={currentSeller?.country?.countryId}
              data={countryList}
              size="lg"
              onChange={(cId) => onCountryChange(cId)}
              cleanable={false}
            />
          </Col>
        </Row>
        <Row className="form-group" hidden={isArtist}>
          <Col xs={2}>
            <label className="mt-4">Phone</label>
          </Col>
          <Col>
            <Input
              value={currentSeller?.phone ?? ''}
              onChange={setPhone}
              className="form-control form-control-half"
              placeholder="phone"
            />
          </Col>
        </Row>
        <Row className="form-group" hidden={isArtist}>
          <Col xs={2}>
            <label className="mt-4">Email</label>
          </Col>
          <Col>
            <Input
              value={currentSeller?.email ?? ''}
              onChange={setEmail}
              className="form-control form-control-half"
              placeholder="email"
              type="email"
            />
          </Col>
        </Row>
        <Row className="form-group">
          <Col xs={2}>
            <label className="mt-4">Twitter</label>
          </Col>
          <Col>
            <Input
              value={currentSeller?.twitter ?? ''}
              onChange={setTwitter}
              className="form-control form-control-half"
              placeholder="Twitter (X) url"
            />
          </Col>
        </Row>
        <Row className="form-group">
          <Col xs={2}>
            <label className="mt-4">Facebook</label>
          </Col>
          <Col>
            <Input
              value={currentSeller?.facebook ?? ''}
              onChange={setFacebook}
              className="form-control form-control-half"
              placeholder="Facebook url"
            />
          </Col>
        </Row>
        <Row className="form-group">
          <Col xs={2}>
            <label className="mt-4">Instagram</label>
          </Col>
          <Col>
            <Input
              value={currentSeller?.instagram ?? ''}
              onChange={setInstagram}
              className="form-control form-control-half"
              placeholder="Instagram url"
            />
          </Col>
        </Row>
        <Row className="form-group">
          <Col xs={2}>
            <label className="mt-4">YouTube</label>
          </Col>
          <Col>
            <Input
              value={currentSeller?.youtube ?? ''}
              onChange={setYouTube}
              className="form-control form-control-half"
              placeholder="YouTube url"
            />
          </Col>
        </Row>
        <Row className="form-group">
          <Col xs={2}>
            <label className="mt-4">Spotify</label>
          </Col>
          <Col>
            <Input
              value={currentSeller?.spotify ?? ''}
              onChange={setSpotify}
              className="form-control form-control-half"
              placeholder="Spotify url"
            />
          </Col>
        </Row>
        <Row className="form-group">
          <Col xs={2}>
            <label className="mt-4">Website</label>
          </Col>
          <Col>
            <Input
              value={currentSeller?.website ?? ''}
              onChange={setWebsite}
              className="form-control form-control-half"
              placeholder="Website url"
            />
          </Col>
        </Row>
        <Row className="form-group">
          <Col xs={2}>
            <label className="mt-4">Website Display Text</label>
          </Col>
          <Col>
            <Input
              value={currentSeller?.websiteDisplayText ?? ''}
              onChange={setWebsiteDisplayText}
              className="form-control form-control-half"
              placeholder="Website display text (shown instead of url)"
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
