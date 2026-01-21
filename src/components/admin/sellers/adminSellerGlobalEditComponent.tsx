'use client';

import { useRouter } from 'next/navigation';
import { ReactElement, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Button, Checkbox, Col, Input, Row, SelectPicker } from 'rsuite';
import { ItemDataType } from 'rsuite/esm/internals/types';

import PageHeader from '@/components/common/PageHeaderComponent';
import { useGetAllCountries } from '@/hooks/admin/useGetAllCountries';
import { useUpdateSeller } from '@/hooks/admin/useUpdateSeller';
import {
  setAdminSeller,
  setCountries,
  setReloadCountries,
  setReloadSellers,
} from '@/lib/adminSelectionSlice';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { RootState } from '@/lib/store';
import { Seller, SellerEventCategory, SellerType } from '@/types/event';
import { GetCountriesResponse, ModifySellerResponse } from '@/types/responses';

export default function AdminSellerGlobalEdit() {
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const dispatch = useDispatch();
  const { updateSeller } = useUpdateSeller();
  const { getAllCountries } = useGetAllCountries();
  const router = useRouter();
  const currentSeller = currentAdminSelection.selectedSeller;
  const selectedSellerType = Number(currentSeller?.sellerType ?? 1);
  const isArtist = selectedSellerType === Number(SellerType.Artist);

  const goBack = useCallback(() => {
    router.push('/admin/sellers');
  }, [router]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentAdminSelection.reloadCountries) {
        dispatch(setReloadCountries(false));
        dispatch(setIsLoading(true));
        void getAllCountries().then((response: GetCountriesResponse) => {
          if (response.countries && !response.error) {
            dispatch(setCountries(response.countries));
          } else {
            toast.error(response.error);
          }
          dispatch(setIsLoading(false));
        });
      } else if (
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
            cat.eventCategoryId = eventCategoryId ?? 0;
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
      const categoryId: number | null = selectedCategory?.eventCategoryId
        ? Number(selectedCategory.eventCategoryId)
        : null;
      const options: ItemDataType<number>[] = [];
      account.categories?.forEach((x) => {
        options.push({
          label: x.name,
          value: Number(x.eventCategoryId),
        });
      });
      const rowKey = `accoutnRow${index}`;
      categoryRows.push(
        <Row key={rowKey}>
          <Col xs={4}>
            <span>Category for {account.name}</span>
          </Col>
          <Col xs={12} md={8}>
            <SelectPicker
              block
              data={options}
              disabled={disabled}
              id={account.ticketSocketId.toString()}
              value={categoryId}
              size="lg"
              onChange={(value) =>
                updateSellerEventCategory(account.ticketSocketId, value ?? undefined)
              }
            />
          </Col>
          <Col xs={4}>
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
          <Col xs={4}>
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

  const sellerTypeOptions: ItemDataType<number>[] = [];
  const sellerTypeValues = Object.values(SellerType).filter((v) => !isNaN(Number(v)));
  sellerTypeOptions.push({
    label: '-- Select One --',
    value: 0,
  });
  sellerTypeValues.forEach((x) => {
    sellerTypeOptions.push({
      label: SellerType[Number(x)],
      value: Number(x),
    });
  });

  const pageHeaderTitle = (currentSeller?.sellerId ?? 0) > 0 ? 'Edit seller' : 'Add seller';

  const countryList: ItemDataType<number>[] = currentAdminSelection.countries
    ? currentAdminSelection.countries.map((country) => ({
        label: `${country.countryName}`,
        value: country.countryId,
      }))
    : [];

  return (
    <>
      <PageHeader pageTitle={pageHeaderTitle} />
      <Row
        className="admin-container"
        hidden={!((allAccounts?.length ?? 0) > 0 && currentSeller !== undefined)}
      >
        <Col xs={24}>
          <Row>
            <Col xs={4}>
              <span>Seller Name</span>
            </Col>
            <Col xs={20} md={12}>
              <Input
                value={currentSeller?.name ?? ''}
                onChange={setSellerName}
                placeholder="seller name"
              />
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <span>Seller Type</span>
            </Col>
            <Col xs={20} md={8}>
              <SelectPicker
                block
                size="lg"
                onChange={(value) => updateSellerType(value ?? undefined)}
                value={selectedSellerType || 0}
                data={sellerTypeOptions}
              />
            </Col>
          </Row>
          {categoryRows}
          <Row>
            <Col xs={4}></Col>
            <Col xs={20} md={12}>
              <Checkbox
                checked={currentSeller?.hideInList ?? false}
                onChange={(_, checked) => setHideInList(checked)}
              >
                Hide in order tickets screen
              </Checkbox>
            </Col>
          </Row>
          <Row>
            <Col xs={4}></Col>
            <Col xs={20} md={12}>
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
          <Row hidden={isArtist}>
            <Col xs={4}>
              <span>Address</span>
            </Col>
            <Col xs={20} md={12}>
              <Input
                value={currentSeller?.address ?? ''}
                onChange={setAddress}
                placeholder="address"
              />
            </Col>
          </Row>
          <Row hidden={isArtist}>
            <Col xs={4}>
              <span>City</span>
            </Col>
            <Col xs={20} md={12}>
              <Input value={currentSeller?.city ?? ''} onChange={setCity} placeholder="city" />
            </Col>
          </Row>
          <Row hidden={isArtist}>
            <Col xs={4}>
              <span>State</span>
            </Col>
            <Col xs={20} md={12}>
              <Input value={currentSeller?.state ?? ''} onChange={setState} placeholder="state" />
            </Col>
          </Row>
          <Row hidden={isArtist}>
            <Col xs={4}>
              <span>Postal Code</span>
            </Col>
            <Col xs={20} md={12}>
              <Input value={currentSeller?.zip ?? ''} onChange={setZip} placeholder="postal code" />
            </Col>
          </Row>
          <Row hidden={isArtist}>
            <Col xs={4}>
              <span>Country</span>
            </Col>
            <Col xs={20} md={12}>
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
          <Row hidden={isArtist}>
            <Col xs={4}>
              <span>Phone</span>
            </Col>
            <Col xs={20} md={12}>
              <Input value={currentSeller?.phone ?? ''} onChange={setPhone} placeholder="phone" />
            </Col>
          </Row>
          <Row hidden={isArtist}>
            <Col xs={4}>
              <span>Email</span>
            </Col>
            <Col xs={20} md={12}>
              <Input
                value={currentSeller?.email ?? ''}
                onChange={setEmail}
                placeholder="email"
                type="email"
              />
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <span>Twitter</span>
            </Col>
            <Col xs={20} md={12}>
              <Input
                value={currentSeller?.twitter ?? ''}
                onChange={setTwitter}
                placeholder="Twitter (X) url"
              />
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <span>Facebook</span>
            </Col>
            <Col xs={20} md={12}>
              <Input
                value={currentSeller?.facebook ?? ''}
                onChange={setFacebook}
                placeholder="Facebook url"
              />
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <span>Instagram</span>
            </Col>
            <Col xs={20} md={12}>
              <Input
                value={currentSeller?.instagram ?? ''}
                onChange={setInstagram}
                placeholder="Instagram url"
              />
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <span>YouTube</span>
            </Col>
            <Col xs={20} md={12}>
              <Input
                value={currentSeller?.youtube ?? ''}
                onChange={setYouTube}
                placeholder="YouTube url"
              />
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <span>Spotify</span>
            </Col>
            <Col xs={20} md={12}>
              <Input
                value={currentSeller?.spotify ?? ''}
                onChange={setSpotify}
                placeholder="Spotify url"
              />
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <span>Website</span>
            </Col>
            <Col xs={20} md={12}>
              <Input
                value={currentSeller?.website ?? ''}
                onChange={setWebsite}
                placeholder="Website url"
              />
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <span>Website Display Text</span>
            </Col>
            <Col xs={20} md={12}>
              <Input
                value={currentSeller?.websiteDisplayText ?? ''}
                onChange={setWebsiteDisplayText}
                placeholder="Website display text (shown instead of url)"
              />
            </Col>
          </Row>
          <Row>
            <Col xs={24}>
              <Button onClick={onSubmit}>Submit</Button> <Button onClick={goBack}>Back</Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}
