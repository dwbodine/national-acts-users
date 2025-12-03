'use client';

import { Button, Input, SelectPicker } from 'rsuite';
import {
  setAdminVenue,
  setCountries,
  setReloadCountries,
  setReloadVenues,
} from '@/lib/adminSelectionSlice';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ExternalVenue } from '@/types/admin';
import { ItemDataType } from 'rsuite/esm/internals/types';
import { GetCountriesResponse, ModifyExternalVenueResponse } from '@/types/responses';
import { RootState } from '@/lib/store';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useUpdateVenue } from '@/hooks/admin/useUpdateVenue';
import { useGetAllCountries } from '@/hooks/admin/useGetAllCountries';

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
    <div className="admin-container">
      <h1>Edit Venue</h1>
      <div className="form-group">
        <label className="mt-4">Venue name</label>
        <Input
          value={venueName ?? ''}
          onChange={setVenueName}
          className="form-control"
          placeholder="venue name"
        />
      </div>
      <div className="form-group">
        <label className="mt-4">Address</label>
        <Input
          value={address ?? ''}
          onChange={setAddress}
          className="form-control"
          placeholder="address"
        />
      </div>
      <div className="form-group">
        <label className="mt-4">City</label>
        <Input value={city ?? ''} onChange={setCity} className="form-control" placeholder="city" />
      </div>
      <div className="form-group">
        <label className="mt-4">State</label>
        <Input
          value={state ?? ''}
          onChange={setState}
          className="form-control"
          placeholder="state"
        />
      </div>
      <div className="form-group">
        <label className="mt-4">Postal Code</label>
        <Input
          value={zipCode ?? ''}
          onChange={setZipCode}
          className="form-control"
          placeholder="postal code"
        />
      </div>
      <div className="form-group">
        <label className="mt-4">Country</label>
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
      <div className="form-group">
        <label className="mt-4">Timezone</label>
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
  ) : (
    ''
  );
}
