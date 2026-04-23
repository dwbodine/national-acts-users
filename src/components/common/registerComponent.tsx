'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button, Col, Input, Row, SelectPicker } from 'rsuite';
import Container from 'rsuite/Container';

import { useGetSellers } from '@/hooks/common/useGetSellers';
import { useRegister } from '@/hooks/user/useRegister';
import { Seller } from '@/types/event';
import { GetSellersResponse, UserResponse } from '@/types/responses';

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

  const handleSellerChange = (selectedSellerId: number | null) => {
    setSellerId(selectedSellerId ?? 0);
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
        if (response.errorMessage) {
          setRegisterError(response.errorMessage);
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
        <Col className="auth-logo-container">
          <Image
            className="auth-logo"
            src="/images/logo-new.png"
            alt="National Acts Client Portal"
            title="National Acts Client Portal"
            width={300}
            height={231}
            priority
          />
        </Col>
      </Row>
      <Row>
        <Col className="auth-title-container">
          <h2>Sign Up</h2>
          <p>Please fill this form to create an account.</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="auth-control-container">
            <span>Email:</span>
            <Input
              autoComplete="off"
              value={username ?? ''}
              onChange={setUsername}
              placeholder="Enter email address"
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="auth-control-container">
            <span>First Name:</span>
            <Input
              autoComplete="off"
              value={firstName ?? ''}
              onChange={setFirstName}
              placeholder="First name"
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="auth-control-container">
            <span>Last Name:</span>
            <Input
              autoComplete="off"
              value={lastName ?? ''}
              onChange={setLastName}
              placeholder="Last name"
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="auth-control-container">
            <span>Associated Artist:</span>
            <SelectPicker
              data={[
                { label: '-- Select One --', value: undefined },
                ...(sellers ?? []).map((seller) => ({
                  label: seller.name,
                  value: seller.sellerId,
                })),
              ]}
              value={sellerId ?? '0'}
              onChange={handleSellerChange}
              searchable={false}
              cleanable={false}
              placeholder="-- Select One --"
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="auth-control-container">
            <span>Password:</span>
            <Input
              type="password"
              placeholder="Password"
              autoComplete="off"
              value={password ?? ''}
              onChange={setPassword}
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="auth-control-container">
            <span>Confirm Password:</span>
            <Input
              type="password"
              placeholder="Confirm Password"
              autoComplete="off"
              value={confirmPassword ?? ''}
              onChange={setConfirmPassword}
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="auth-control-container">
            <span>Notes for the admin (optional):</span>
            <Textarea value={notes ?? ''} autoComplete="off" onChange={setNotes} />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="auth-button-container">
            <Button onClick={onSubmit}>Submit</Button>
            <Button onClick={onBack}>Back</Button>
          </div>
          <div className="auth-control-container">
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
