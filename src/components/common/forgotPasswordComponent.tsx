'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button, Col, Input, Row } from 'rsuite';
import Container from 'rsuite/Container';

import { useForgotPassword } from '@/hooks/user/useForgotPassword';
import { useResetPassword } from '@/hooks/user/useResetPassword';
import { useValidateResetCode } from '@/hooks/user/useValidateResetCode';
import { UserResponse } from '@/types/responses';
import { ForgotPasswordMode } from '@/types/user';

export default function ForgotPasswordComponent() {
  const [mode, setMode] = useState(ForgotPasswordMode.SendPasswordReset);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState(0);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const router = useRouter();
  const { forgotPassword } = useForgotPassword();
  const { validateResetCode } = useValidateResetCode();
  const { resetPassword } = useResetPassword();

  useEffect(() => {
    switch (mode) {
      case ForgotPasswordMode.ValidateResetCode:
        document.title = 'Client Portal - Validate Reset Code';
        break;
      case ForgotPasswordMode.ResetPassword:
        document.title = 'Client Portal - Reset Password';
        break;
      default:
        document.title = 'Client Portal - Forgot Password';
        break;
    }
  }, [mode]);

  const onForgotPassword = () => {
    setResetError('');
    if (!username) {
      setResetError('Username cannot be blank');
      return;
    }
    forgotPassword(username)
      .then((response: UserResponse) => {
        if (response.error) {
          setResetError(response.error);
        } else {
          setMode(ForgotPasswordMode.ValidateResetCode);
        }
      })
      .catch(() => {
        setResetError(
          'Unknown error during send of password reset email - please contact your administrator',
        );
      });
  };

  const onValidateCode = () => {
    setResetError('');
    if (!code || isNaN(code)) {
      setResetError('Missing or invalid code');
      return;
    }
    validateResetCode(username, code)
      .then((response: UserResponse) => {
        if (response.error) {
          setResetError(response.error);
        } else {
          setMode(ForgotPasswordMode.ResetPassword);
        }
      })
      .catch(() => {
        setResetError('Unknown error while validating code - please contact your administrator');
      });
  };

  const onResetPassword = () => {
    setResetError('');
    setResetSuccess('');
    if (!password) {
      setResetError('Password is required');
      return;
    }
    if (!confirmPassword) {
      setResetError('Confirm password is required');
      return;
    }
    if (password !== confirmPassword) {
      setResetError('Passwords do not match');
      return;
    }
    resetPassword(username, password, confirmPassword, code)
      .then((response: UserResponse) => {
        if (response.error) {
          setResetError(response.error);
        } else {
          setResetSuccess('Password changed successfully, redirecting to login...');
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        }
      })
      .catch(() => {
        setResetError('Unknown error while resetting password - please contact your administrator');
      });
  };

  const onBack = () => {
    if (mode === ForgotPasswordMode.ValidateResetCode) {
      setMode(ForgotPasswordMode.SendPasswordReset);
    } else if (mode === ForgotPasswordMode.ResetPassword) {
      setMode(ForgotPasswordMode.ValidateResetCode);
    } else {
      router.push('/login');
    }
  };

  switch (mode) {
    case ForgotPasswordMode.ValidateResetCode:
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
              <h2>Enter Security Code</h2>
              <p className="danger">
                Please leave this window open while you wait for an email to be sent
              </p>
              <p>
                If you have a valid email in our system, a six-digit security code has been sent to
                you, please enter it here:
              </p>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="auth-control-container">
                <span>Code:</span>
                <Input
                  type="number"
                  value={code}
                  onChange={(value) => setCode(parseInt(value))}
                  autoComplete="off"
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="auth-button-container">
                <Button onClick={onValidateCode}>Validate</Button>
                <Button onClick={onBack}>Back</Button>
              </div>
              <div className="auth-control-container">
                {resetError ? <div className="danger">{resetError}</div> : ''}
              </div>
            </Col>
          </Row>
        </Container>
      );
      break;
    case ForgotPasswordMode.ResetPassword:
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
              <h2>Reset Password</h2>
              <p>Please fill out this form to reset your password.</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="auth-control-container">
                <span>New Password:</span>
                <Input
                  type="password"
                  value={password ?? ''}
                  onChange={setPassword}
                  autoComplete="off"
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
                  value={confirmPassword ?? ''}
                  onChange={setConfirmPassword}
                  autoComplete="off"
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="auth-button-container">
                <Button onClick={onResetPassword}>Reset</Button>
                <Button onClick={onBack}>Back</Button>
              </div>
              <div className="auth-control-container">
                {resetError ? <div className="danger">{resetError}</div> : ''}
                {resetSuccess ? <div className="success">{resetSuccess}</div> : ''}
              </div>
            </Col>
          </Row>
        </Container>
      );
      break;
    default:
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
              <h2>Forgot Password</h2>
              <p>Please enter your username/email address.</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="auth-control-container">
                <span>Username:</span>
                <Input
                  value={username ?? ''}
                  onChange={setUsername}
                  placeholder="Please enter email address"
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="auth-button-container">
                <Button onClick={onForgotPassword}>Send</Button>
                <Button onClick={onBack}>Back</Button>
              </div>
              <div className="auth-control-container">
                {resetError ? <div className="danger">{resetError}</div> : ''}
              </div>
            </Col>
          </Row>
        </Container>
      );
      break;
  }
}
