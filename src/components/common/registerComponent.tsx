'use client';

import { Button, Col, Input, Row, SelectPicker } from 'rsuite';
import { ChangeEvent, useEffect, useState } from 'react';
import { GetSellersResponse, UserResponse } from '@/types/responses';
import Container from 'rsuite/Container';
import { Seller } from '@/types/event';
import { useGetSellers } from '@/hooks/common/useGetSellers';
import { useRegister } from '@/hooks/user/useRegister';
import { useRouter } from 'next/navigation';
import Textarea from './Textarea';

export default function RegisterComponent() {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [sellerId, setSellerId] = useState(0);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notes, setNotes] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [sellers, setSellers] = useState<Seller[]>();
  const [dummyVal, setDummyVal] = useState(false);
  const router = useRouter();
  const { getSellers } = useGetSellers();
  const { register } = useRegister();

  useEffect(() => {
    document.title = 'Client Portal - Register';
    if (!dummyVal) {
      setDummyVal(true);
      getSellers()
        .then((response: GetSellersResponse) => {
          if (response.error) {
            setRegisterError(response.error);
          } else {
            setSellers(response.sellers);
          }
        })
        .catch(() => {
          setRegisterError('Unknown error occurred while fetching sellers');
        });
    }
  }, [dummyVal, getSellers]);

  const handleSellerChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedSellerId = parseInt(event.currentTarget.value);
    setSellerId(selectedSellerId);
  };

  const onSubmit = () => {
    setRegisterError('');
    setRegisterSuccess('');
    if (!username) {
      setRegisterError('Username cannot be blank');
      return;
    }
    if (!firstName) {
      setRegisterError('First name cannot be blank');
      return;
    }
    if (!lastName) {
      setRegisterError('Last name cannot be blank');
      return;
    }
    if (!sellerId || sellerId <= 0) {
      setRegisterError('Must select an associated artist/venue');
      return;
    }
    if (!password) {
      setRegisterError('Password cannot be blank');
      return;
    }
    if (!confirmPassword) {
      setRegisterError('Confirm password cannot be blank');
      return;
    }
    if (password !== confirmPassword) {
      setRegisterError('Passwords do not match');
      return;
    }

    register(username, firstName, lastName, sellerId, password, confirmPassword, notes)
      .then((response: UserResponse) => {
        if (response.error) {
          setRegisterError(response.error);
        } else {
          setRegisterSuccess(
            'User registration succeeded, please wait for response from the administrator',
          );
        }
      })
      .catch(() => {
        setRegisterError('Unknown error occurred during user registration');
      });
  };

  const onBack = () => {
    router.push('/login');
  };

  return (
    <Container className="wrapper">
      <Row>
        <Col>
          <h2>Sign Up</h2>
          <p>Please fill this form to create an account.</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="form-group">
            <label>Email:</label>
            <Input
              autoComplete="off"
              value={username ?? ''}
              onChange={setUsername}
              className="form-control"
              placeholder="Enter email address"
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="form-group">
            <label>First Name:</label>
            <Input
              autoComplete="off"
              value={firstName ?? ''}
              onChange={setFirstName}
              className="form-control"
              placeholder="First name"
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="form-group">
            <label>Last Name:</label>
            <Input
              autoComplete="off"
              value={lastName ?? ''}
              onChange={setLastName}
              className="form-control"
              placeholder="Last name"
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="form-group">
            <label>Associated Artist:</label>
            <SelectPicker
              data={[
                { label: '-- Select One --', value: '0' },
                ...(sellers ?? []).map((seller) => ({
                  label: seller.name,
                  value: seller.sellerId.toString(),
                })),
              ]}
              value={sellerId?.toString() ?? '0'}
              onChange={handleSellerChange}
              searchable={false}
              cleanable={false}
              className="form-control"
              placeholder="-- Select One --"
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="form-group">
            <label>Password:</label>
            <Input
              type="password"
              placeholder="Password"
              autoComplete="off"
              className="form-control"
              value={password ?? ''}
              onChange={setPassword}
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="form-group">
            <label>Confirm Password:</label>
            <Input
              type="password"
              placeholder="Confirm Password"
              autoComplete="off"
              className="form-control"
              value={confirmPassword ?? ''}
              onChange={setConfirmPassword}
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="form-group">
            <label>Notes for the admin (optional):</label>
            <Textarea
              value={notes ?? ''}
              autoComplete="off"
              onChange={setNotes}
              className="form-control"
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="form-group">
            <Button onClick={onSubmit}>Submit</Button>
            <Button onClick={onBack}>Back</Button>
            {registerError ? (
              <div className="h-fit flex flex-row gap-2 items-center justify-center danger">
                {registerError}
              </div>
            ) : (
              ''
            )}
            {registerSuccess ? (
              <div className="h-fit flex flex-row gap-2 items-center justify-center success">
                {registerSuccess}
              </div>
            ) : (
              ''
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
