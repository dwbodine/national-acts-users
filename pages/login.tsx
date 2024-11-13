import { useRouter } from 'next/router';
import { useState, KeyboardEvent, useEffect } from 'react';
import { useLogin } from '../src/hooks/user/useLogin';
import Container from 'react-bootstrap/Container';
import { Col, Row, Button } from 'react-bootstrap';
import CheckAuth from '../components/common/checkAuthComponent';
import Image from 'next/image';
import { useResetStores } from '@/hooks/common/useResetStores';
import { useDispatch } from 'react-redux';
import {
  setForAdmin,
} from '@/lib/reportSelectionSlice';

export default function Login() {
  const [name, setName] = useState('');
  const [loginError, setLoginError] = useState('');
  const [password, setPassword] = useState('');
  const [showWelcome, setShowWelcome] = useState(false);
  const { login } = useLogin();
  const router = useRouter();
  const { resetStores } = useResetStores();
  const dispatch = useDispatch();

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

  const handlePasswordKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Enter') {
      onSubmit();
    }
  };

  const onSubmit = () => {
    resetStores();

    if (!name || !password) {
      setLoginError('Please enter username and password');
    } else {
      login(name, password)
        .then((response) => {
          if (response) {
            if (response.user && response.user.isAuthenticated) {
              dispatch(setForAdmin(response.user.isAdmin));
              const searchParams = new URLSearchParams(window.location.search);
              const returnPath = searchParams.get('returnPath');
              if (returnPath) {
                router.push(returnPath);
              } else if (response.user.isAdmin) {
                router.push('/dashboard/');
              } else {
                router.push('/');
              }
            } else if (response.loginError) {
              setLoginError(response.loginError);
            } else {
              setLoginError(
                'Unknown error during login - please contact your administrator',
              );
            }
          } else {
            setLoginError(
              'Unknown error during login - please contact your administrator',
            );
          }
        })
        .catch((e) => {
          console.log(e);
          setLoginError('Unknown error during login - please contact your administrator');
        });
    }
  };

  return (
    <>
      <CheckAuth />
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
          <Col className="login-logo-container">
            <Image
              className="login-logo"
              src="/images/logo-new.png"
              alt="National Acts Client Portal"
              title="National Acts Client Portal"
              width={300}
              height={231}
            />
          </Col>
        </Row>
        <Row>
          <Col className="login-title-container">
            <h2>CLIENT PORTAL</h2>
            <p>Please fill in your credentials to log in.</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="form-group">
              <label>USERNAME</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control"
                placeholder="username"
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="form-group">
              <label className="mt-4">PASSWORD</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyUp={(e) => handlePasswordKey(e)}
                className="form-control"
                placeholder="password"
                type="password"
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="form-group">
              <Button onClick={onSubmit}>Login</Button>
              {loginError ? (
                <div className="h-fit flex flex-row gap-2 items-center justify-center danger">
                  {loginError}
                </div>
              ) : (
                ''
              )}
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
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
