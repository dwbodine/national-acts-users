'use client';

import { Button, Col, Input, Row } from 'rsuite';
import { KeyboardEvent, useEffect, useState } from 'react';
import Container from 'rsuite/Container';
import Image from 'next/image';
import { UserLoginResponse } from '@/types/responses';
import { setForAdmin } from '@/lib/reportSelectionSlice';
import { useDispatch } from 'react-redux';
import { useLogin } from '@/hooks/user/useLogin';
import { useResetStores } from '@/hooks/common/useResetStores';
import { useRouter } from 'next/navigation';

export default function LoginComponent() {
  const [name, setName] = useState('');
  const [loginError, setLoginError] = useState('');
  const [password, setPassword] = useState('');
  const [showWelcome, setShowWelcome] = useState(false);
  const { login } = useLogin();
  const { resetStores } = useResetStores();
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const curDate = new Date().getTime();
    const begin = new Date('2024-08-11').getTime();
    const end = new Date('2024-08-18').getTime();
    if (curDate <= end && curDate >= begin) {
      setShowWelcome(true);
    }
    document.title = 'Client Portal - Login';
  }, [name, password, loginError, login]);

  const register = () => {
    router.push('/register');
  };

  const forgotPassword = () => {
    router.push('/forgot-password');
  };

  const onSubmit = () => {
    resetStores();

    if (!name || !password) {
      setLoginError('Please enter username and password');
    } else {
      void login(name, password).then((response: UserLoginResponse) => {
        if (response) {
          if (response.user && response.user.isAuthenticated) {
            dispatch(setForAdmin(response.user.isAdmin));
            const searchParams = new URLSearchParams(window.location.search);
            const returnPath = searchParams.get('returnPath');
            if (returnPath) {
              router.push(returnPath);
            } else if (response.user.isAdmin) {
              router.push('/dashboard');
            } else {
              router.push('/');
            }
          } else if (response.error) {
            setLoginError(response.error);
          } else {
            setLoginError(
              'Unknown error during login - please contact your administrator',
            );
          }
        } else {
          setLoginError('Unknown error during login - please contact your administrator');
        }
      });
    }
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
            Welcome to the new Client Portal for national-acts.com!
            <br />
            Among the many other enhancements, we have upgraded our security algorithm.
            <br />
            For that reason, all users will have to reset their password - if you have not
            done so, please click on the link next to &quot;Forgot Password&quot; below to
            start the process.
            <br />
            If you have any issues, please contact us as{' '}
            <a href="mailto:info@national-acts.com">info@national-acts.com</a>
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
          <Col className="auth-button-container">
            <Button onClick={onSubmit}>Login</Button>
            {loginError ? (
              <div className="h-fit flex flex-row gap-2 items-center justify-center danger">
                {loginError}
              </div>
            ) : (
              ''
            )}
          </Col>
        </Row>
        <Row>
          <Col className="auth-control-container">
            <p>
              Don&apos;t have an account?{' '}
              <a onClick={register} title="Sign up now">
                Sign up now
              </a>
            </p>
            <p>
              Forgot Password?{' '}
              <a onClick={forgotPassword} title="Forgot Password?">
                Click here.
              </a>
            </p>
          </Col>
        </Row>
      </Container>
    </>
  );
}
