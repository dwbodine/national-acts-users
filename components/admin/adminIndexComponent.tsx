import { Col, Container, Row } from 'react-bootstrap';
import AdminIndexBar from './adminIndexBarComponent';
import AdminList from './adminListComponent';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetAdmin, setCountries, setReloadCountries } from '@/lib/adminSelectionSlice';
import { RootState } from '@/lib/store';
import { useGetAllCountries } from '@/hooks/admin/useGetAllCountries';
import { GetCountriesResponse } from '@/types/admin';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { toast } from 'react-toastify';

export default function AdminIndex() {
  const dispatch = useDispatch();
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const { getAllCountries } = useGetAllCountries();

  useEffect(() => {
      const timeoutId = setTimeout(() => {
        dispatch(resetAdmin());
        if (currentAdminSelection.reloadCountries) {
          dispatch(setReloadCountries(false));
          dispatch(setIsLoading(true));
          getAllCountries().then((response: GetCountriesResponse) => {
            if (response.countries && !response.countryError) {
              dispatch(setCountries(response.countries));
            } else {
              toast.error(response.countryError);
            }
            dispatch(setIsLoading(false));
          });
        }
      }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [dispatch, currentAdminSelection, getAllCountries]);
  return (
    <>
      <AdminIndexBar />
      <Container fluid>
        <Row>
          <Col>
            <AdminList />
          </Col>
        </Row>
      </Container>
    </>
  );
}
