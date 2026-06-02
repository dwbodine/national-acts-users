'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { KeyboardEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Col, Input, Row } from 'rsuite';
import Container from 'rsuite/Container';

import { useGetAllCountries } from '@/hooks/admin/useGetAllCountries';
import { useResetStores } from '@/hooks/common/useResetStores';
import { useLogin } from '@/hooks/user/useLogin';
import { setCountries } from '@/lib/adminSelectionSlice';
import { setForAdmin } from '@/lib/reportSelectionSlice';
import { GetCountriesResponse, UserLoginResponse } from '@/types/responses';

import {
  getLoginErrorMessage,
  getLoginRedirectPath,
  shouldShowLoginWelcome,
  validateLoginCredentials,
} from './loginComponent.helpers';

export default function LoginComponent() {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [loginError, setLoginError] = useState('');
  const [password, setPassword] = useState('');
  const [showWelcome, setShowWelcome] = useState(false);
  const { login } = useLogin();
  const { resetStores } = useResetStores();
  const router = useRouter();
  const { getAllCountries } = useGetAllCountries();

  useEffect(() => {
    if (shouldShowLoginWelcome()) {
      setShowWelcome(true);
    }
    document.title = 'Client Portal - Login';
  }, [name, password, loginError, login]);

  const forgotPassword = () => {
    router.push('/forgot-password');
  };

  const onSubmit = () => {
    resetStores();

    const validationError = validateLoginCredentials(name, password);
    if (validationError) {
      setLoginError(validationError);
      return;
    }

    void login(name, password).then((response: UserLoginResponse) => {
      if (response?.user?.isAuthenticated) {
        dispatch(setForAdmin(response.user.isAdmin));
        const searchParams = new URLSearchParams(window.location.search);
        const returnPath = searchParams.get('returnPath');
        void getAllCountries().then((countryResponse: GetCountriesResponse) => {
          if (countryResponse.countries && !countryResponse.error) {
            dispatch(setCountries(countryResponse.countries));
          }

          router.push(getLoginRedirectPath(returnPath, response.user?.isAdmin ?? false));
        });

        return;
      }

      setLoginError(getLoginErrorMessage(response) ?? '');
    });
  };

  const submitOnEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <>
      <Container className="wrapper">
        <Row hidden={!showWelcome}>
          <Col className="message">
            Welcome to the new Client Portal for nationalactsvip.com!
            <br />
            Among the many other enhancements, we have upgraded our security algorithm.
            <br />
            For that reason, all users will have to reset their password - if you have not done so,
            please click on the link next to &quot;Forgot Password&quot; below to start the process.
            <br />
            If you have any issues, please contact us as{' '}
            <a href="mailto:info@nationalactsvip.com">info@nationalactsvip.com</a>
          </Col>
        </Row>
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
            <h2>CLIENT PORTAL</h2>
            <div>Please fill in your credentials to log in.</div>
          </Col>
        </Row>
        <Row>
          <Col className="auth-control-container">
            <h3>USERNAME</h3>
            <Input
              value={name}
              onChange={setName}
              onKeyDown={submitOnEnter}
              placeholder="username"
            />
          </Col>
        </Row>
        <Row>
          <Col className="auth-control-container">
            <h3>PASSWORD</h3>
            <Input
              value={password ?? ''}
              onChange={setPassword}
              onKeyUp={submitOnEnter}
              placeholder="password"
              type="password"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="auth-button-container">
              <Button onClick={onSubmit}>Login</Button>
            </div>
            <div className="auth-control-container">
              {loginError ? <div className="danger">{loginError}</div> : ''}
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="auth-control-container">
            <span>
              Forgot Password?{' '}
              <a onClick={forgotPassword} title="Forgot Password?">
                Click here.
              </a>
            </span>
          </Col>
        </Row>
      </Container>
    </>
  );
}
