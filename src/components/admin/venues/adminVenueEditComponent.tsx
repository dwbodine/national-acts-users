'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Button, Input, SelectPicker } from 'rsuite';
import { ItemDataType } from 'rsuite/esm/internals/types';

import PageHeader from '@/components/common/PageHeaderComponent';
import { useGetAllCountries } from '@/hooks/admin/useGetAllCountries';
import { useUpdateVenue } from '@/hooks/admin/useUpdateVenue';
import { setVenues } from '@/lib/adminDataSelectionSlice';
import {
  setAdminVenue,
  setCountries,
  setReloadCountries,
  setReloadVenues,
} from '@/lib/adminSelectionSlice';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { RootState } from '@/lib/store';
import { ExternalVenue } from '@/types/admin';
import { GetCountriesResponse, ModifyExternalVenueResponse } from '@/types/responses';

export default function AdminVenueEdit() {
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const dispatch = useDispatch();
  const { updateVenue } = useUpdateVenue();
  const { getAllCountries } = useGetAllCountries();
  const [venueName, setVenueName] = useState<string | undefined>(undefined);
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [city, setCity] = useState<string | undefined>(undefined);
  const [state, setState] = useState<string | undefined>(undefined);
  const [zipCode, setZipCode] = useState<string | undefined>(undefined);
  const [countryId, setCountryId] = useState<number | undefined>(undefined);
  const [timezone, setTimezone] = useState<string | undefined>(undefined);
  const router = useRouter();

  const goBack = useCallback(() => {
    router.push('/admin/venues');
  }, [router]);

  useEffect(() => {
    if (currentAdminSelection.selectedVenue === undefined) {
      goBack();
    } else if (currentAdminSelection.reloadCountries) {
      dispatch(setReloadCountries(false));
      dispatch(setIsLoading(true));
      void getAllCountries().then((response: GetCountriesResponse) => {
        if (response.countries && !response.error) {
          dispatch(setCountries(response.countries));
        } else {
          toast.error(response.error);
          dispatch(setIsLoading(false));
        }
      });
    } else if (venueName === undefined) {
      dispatch(setIsLoading(true));
      setVenueName(currentAdminSelection.selectedVenue.venue);
      setAddress(currentAdminSelection.selectedVenue.address);
      setCity(currentAdminSelection.selectedVenue.city);
      setState(currentAdminSelection.selectedVenue.state);
      setZipCode(currentAdminSelection.selectedVenue.zipCode);
      setCountryId(currentAdminSelection.selectedVenue.country?.countryId);
      setTimezone(currentAdminSelection.selectedVenue.timezone?.timezone);
      dispatch(setIsLoading(false));
    }
  }, [currentAdminSelection, venueName, dispatch, countryId, goBack]);

  const onCountryChange = (cId: number | null) => {
    setCountryId(cId ?? undefined);
  };

  const onTimezoneChange = (tz: string | null) => {
    setTimezone(tz ?? undefined);
  };

  const onSubmit = () => {
    if (!currentAdminSelection.selectedVenue) {
      return;
    }

    const isUpdate = currentAdminSelection.selectedVenue.venueId > 0;

    if (!venueName) {
      toast.error('Venue name is required');
      return;
    }

    if (!address) {
      toast.error('Address is required');
      return;
    }

    if (!city) {
      toast.error('City is required');
      return;
    }

    if (!countryId) {
      toast.error('Country is required (even USA)');
      return;
    }

    if (!state && !zipCode) {
      toast.error('Must provide at least one of state or zip');
      return;
    }

    if (!timezone) {
      toast.error('Timezone is required');
      return;
    }

    dispatch(setIsLoading(true));

    const venueToUpdate: ExternalVenue = {
      ...currentAdminSelection.selectedVenue,
      address,
      city,
      country: { countryId },
      state,
      timezone: { timezone },
      venue: venueName,
      zipCode,
    };

    void updateVenue(venueToUpdate).then((response: ModifyExternalVenueResponse) => {
      if (response.success) {
        dispatch(setReloadVenues(true));
        dispatch(setVenues(undefined));
        dispatch(setAdminVenue(undefined));
        const message = isUpdate ? 'Venue updated successfully' : 'Venue added successfully';
        toast.success(message);
        router.push('/admin/venues');
      } else {
        toast.error(response.error ?? 'Error occurred while saving venue');
        dispatch(setIsLoading(false));
      }
    });
  };

  const countryList: ItemDataType<number>[] = currentAdminSelection.countries
    ? currentAdminSelection.countries.map((country) => ({
        label: `${country.countryName}`,
        value: country.countryId,
      }))
    : [];

  const selectedCountry = currentAdminSelection.countries?.find((x) => x.countryId === countryId);

  const timeZoneList: ItemDataType<string>[] = selectedCountry?.timezones
    ? selectedCountry.timezones.map((tz) => ({
        label: `${tz.displayName}`,
        value: tz.timezone,
      }))
    : [];

  return currentAdminSelection.selectedVenue ? (
    <>
      <PageHeader pageTitle="Edit Venue" />
      <div className="admin-container">
        <div>
          <span>Venue name</span>
          <Input
            value={venueName ?? ''}
            onChange={setVenueName}
            className="form-control"
            placeholder="venue name"
          />
        </div>
        <div>
          <span>Address</span>
          <Input
            value={address ?? ''}
            onChange={setAddress}
            className="form-control"
            placeholder="address"
          />
        </div>
        <div>
          <span>City</span>
          <Input
            value={city ?? ''}
            onChange={setCity}
            className="form-control"
            placeholder="city"
          />
        </div>
        <div>
          <span>State</span>
          <Input
            value={state ?? ''}
            onChange={setState}
            className="form-control"
            placeholder="state"
          />
        </div>
        <div>
          <span>Postal Code</span>
          <Input
            value={zipCode ?? ''}
            onChange={setZipCode}
            className="form-control"
            placeholder="postal code"
          />
        </div>
        <div>
          <span>Country</span>
          <SelectPicker
            className="admin-seller-select-value"
            menuAutoWidth={true}
            value={countryId}
            data={countryList}
            size="lg"
            onChange={(cId) => onCountryChange(cId)}
            cleanable={false}
          />
        </div>
        <div>
          <span>Timezone</span>
          <SelectPicker
            className="admin-seller-select-value"
            menuAutoWidth={true}
            value={timezone}
            data={timeZoneList}
            size="lg"
            onChange={(tz) => onTimezoneChange(tz)}
            cleanable={false}
          />
        </div>
        <div className="admin-button-group">
          <Button onClick={onSubmit}>Submit</Button> <Button onClick={goBack}>Back</Button>
        </div>
      </div>
    </>
  ) : (
    ''
  );
}
