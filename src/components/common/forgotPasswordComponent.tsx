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

import {
  FORGOT_PASSWORD_RESET_ERROR,
  FORGOT_PASSWORD_RESET_SUCCESS,
  FORGOT_PASSWORD_SEND_ERROR,
  FORGOT_PASSWORD_VALIDATE_ERROR,
  getForgotPasswordBackNavigation,
  getForgotPasswordTitle,
  validateForgotPasswordCode,
  validateForgotPasswordReset,
  validateForgotPasswordUsername,
} from './forgotPasswordComponent.helpers';

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
    document.title = getForgotPasswordTitle(mode);
  }, [mode]);

  const onForgotPassword = () => {
    setResetError('');

    const validationError = validateForgotPasswordUsername(username);
    if (validationError) {
      setResetError(validationError);
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
        setResetError(FORGOT_PASSWORD_SEND_ERROR);
      });
  };

  const onValidateCode = () => {
    setResetError('');

    const validationError = validateForgotPasswordCode(code);
    if (validationError) {
      setResetError(validationError);
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
        setResetError(FORGOT_PASSWORD_VALIDATE_ERROR);
      });
  };

  const onResetPassword = () => {
    setResetError('');
    setResetSuccess('');

    const validationError = validateForgotPasswordReset(password, confirmPassword);
    if (validationError) {
      setResetError(validationError);
      return;
    }

    resetPassword(username, password, confirmPassword, code)
      .then((response: UserResponse) => {
        if (response.error) {
          setResetError(response.error);
        } else {
          setResetSuccess(FORGOT_PASSWORD_RESET_SUCCESS);
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        }
      })
      .catch(() => {
        setResetError(FORGOT_PASSWORD_RESET_ERROR);
      });
  };

  const onBack = () => {
    const backNavigation = getForgotPasswordBackNavigation(mode);
    if (backNavigation.mode !== undefined) {
      setMode(backNavigation.mode);
      return;
    }

    router.push(backNavigation.route ?? '/login');
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
