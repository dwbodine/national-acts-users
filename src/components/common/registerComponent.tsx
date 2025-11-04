'use client';

import { Button, Col, Row } from 'rsuite';
import { ChangeEvent, useEffect, useState } from 'react';
import { GetSellersResponse, UserResponse } from '@/types/responses';
import Container from 'rsuite/Container';
import { Seller } from '@/types/event';
import { useGetSellers } from '@/hooks/common/useGetSellers';
import { useRegister } from '@/hooks/user/useRegister';
import { useRouter } from 'next/navigation';

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
            <input
              type="text"
              autoComplete="off"
              value={username ?? ''}
              onChange={(e) => setUsername(e.target.value)}
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
            <input
              type="text"
              autoComplete="off"
              value={firstName ?? ''}
              onChange={(e) => setFirstName(e.target.value)}
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
            <input
              type="text"
              autoComplete="off"
              value={lastName ?? ''}
              onChange={(e) => setLastName(e.target.value)}
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
            <select
              value={sellerId}
              onChange={handleSellerChange}
              className="form-control"
            >
              <option value="0"> -- Select One --</option>
              {sellers?.map((seller) => (
                <option key={seller.sellerId} value={seller.sellerId}>
                  {seller.name}
                </option>
              ))}
            </select>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              placeholder="Password"
              autoComplete="off"
              className="form-control"
              value={password ?? ''}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="form-group">
            <label>Confirm Password:</label>
            <input
              type="password"
              placeholder="Confirm Password"
              autoComplete="off"
              className="form-control"
              value={confirmPassword ?? ''}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="form-group">
            <label>Notes for the admin (optional):</label>
            <textarea
              value={notes ?? ''}
              autoComplete="off"
              onChange={(e) => setNotes(e.target.value)}
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
