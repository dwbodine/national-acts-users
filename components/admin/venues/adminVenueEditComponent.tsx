import { RootState } from '@/lib/store';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import router from 'next/router';
import { Button } from 'react-bootstrap';
import { setAdminVenue, setReloadVenues } from '@/lib/adminSelectionSlice';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { toast } from 'react-toastify';
import { useUpdateVenue } from '@/hooks/admin/useUpdateVenue';
import { ExternalVenue, ModifyExternalVenueResponse } from '@/types/admin';

export default function AdminVenueEdit() {
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const dispatch = useDispatch();
  const { updateVenue } = useUpdateVenue();
  const [venueName, setVenueName] = useState<string | undefined>(undefined);
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [city, setCity] = useState<string | undefined>(undefined);
  const [state, setState] = useState<string | undefined>(undefined);
  const [zipCode, setZipCode] = useState<string | undefined>(undefined);
  const [country, setCountry] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (currentAdminSelection.selectedVenue == undefined) {
      goBack();
    } else if (
      venueName == undefined
    ) {
      dispatch(setIsLoading(true));
      setVenueName(currentAdminSelection.selectedVenue.venue);
      setAddress(currentAdminSelection.selectedVenue.address);
      setCity(currentAdminSelection.selectedVenue.city);
      setState(currentAdminSelection.selectedVenue.state);
      setZipCode(currentAdminSelection.selectedVenue.zipCode);
      setCountry(currentAdminSelection.selectedVenue.country);
      dispatch(setIsLoading(false));
    }
  }, [
    currentAdminSelection,
    venueName,
    dispatch,
  ]);

  const goBack = () => {
    router.push('/admin/venues/');
  };

  const onSubmit = () => {
    if (!currentAdminSelection.selectedVenue) {
      return false;
    }

    const isUpdate = (currentAdminSelection.selectedVenue.venueId > 0);

    if (!venueName) {
      toast.error("Venue name is required");
      return;
    }

    if (!address) {
      toast.error("Address is required");
      return;
    }

    if (!city) {
      toast.error("City is required");
      return;
    }

    if (!state && !zipCode && !country) {
      toast.error("Must provide at least one of state, zip or country");
      return;
    }

    dispatch(setIsLoading(true));

    let venueToUpdate: ExternalVenue = {
      ...currentAdminSelection.selectedVenue,
      venue: venueName,
      address: address,
      city: city,
      state: state,
      zipCode: zipCode,
      country: country,
    };

    updateVenue(venueToUpdate).then((response: ModifyExternalVenueResponse) => {
      if (response.success) {
        dispatch(setReloadVenues(true));
        dispatch(setAdminVenue(undefined))
        const message = isUpdate ? 'Venue updated successfully' : 'Venue added successfully';
        toast.success(message);
        router.push('/admin/venues/');
      } else {
        toast.error(response.venueError ?? 'Error occurred while saving venue');
        dispatch(setIsLoading(false));
      }
    });
  };

  return currentAdminSelection.selectedVenue ? (
    <div className="admin-container">
      <h1>Edit Venue</h1>
      <div className="form-group">
        <label className="mt-4">Venue name</label>
        <input
          value={venueName}
          onChange={(e) => setVenueName(e.target.value)}
          className="form-control"
          placeholder="venue name"
          type="text"
        />
      </div>
      <div className="form-group">
        <label className="mt-4">Address</label>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="form-control"
          placeholder="address"
          type="text"
        />
      </div>
      <div className="form-group">
        <label className="mt-4">City</label>
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="form-control"
          placeholder="city"
          type="text"
        />
      </div>
      <div className="form-group">
        <label className="mt-4">State</label>
        <input
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="form-control"
          placeholder="state"
          type="text"
        />
      </div>
      <div className="form-group">
        <label className="mt-4">Postal Code</label>
        <input
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          className="form-control"
          placeholder="postal code"
          type="text"
        />
      </div>
      <div className="form-group">
        <label className="mt-4">Country</label>
        <input
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="form-control"
          placeholder="country"
          type="text"
        />
      </div>
      <div className="admin-button-group">
        <Button onClick={onSubmit}>Submit</Button>{' '}<Button onClick={goBack}>Back</Button>
      </div>
    </div>
  ) : (
    ''
  );
}
