'use client';

import { Col, Container, Row } from 'rsuite';
import { resetAdmin, setCountries, setReloadCountries } from '@/lib/adminSelectionSlice';
import { useDispatch, useSelector } from 'react-redux';
import AdminIndexBar from './adminIndexBarComponent';
import AdminList from './adminListComponent';
import { GetCountriesResponse } from '@/types/responses';
import { RootState } from '@/lib/store';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { useGetAllCountries } from '@/hooks/admin/useGetAllCountries';

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
        void getAllCountries().then((response: GetCountriesResponse) => {
          if (response.countries && !response.error) {
            dispatch(setCountries(response.countries));
          } else {
            toast.error(response.error);
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
      <Container className="fluid">
        <Row>
          <Col>
            <AdminList />
          </Col>
        </Row>
      </Container>
    </>
  );
}
