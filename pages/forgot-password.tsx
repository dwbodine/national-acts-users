import { Button, Col, Row } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import { ForgotPasswordMode } from '@/types/user';
import { UserResponse } from '@/types/responses';
import { useForgotPassword } from '@/hooks/user/useForgotPassword';
import { useResetPassword } from '@/hooks/user/useResetPassword';
import { useRouter } from 'next/router';
import { useValidateResetCode } from '@/hooks/user/useValidateResetCode';

export default function ForgotPassword() {
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
        setResetError(
          'Unknown error while validating code - please contact your administrator',
        );
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
            router.push('/login/');
          }, 2000);
        }
      })
      .catch(() => {
        setResetError(
          'Unknown error while resetting password - please contact your administrator',
        );
      });
  };

  const onBack = () => {
    if (mode === ForgotPasswordMode.ValidateResetCode) {
      setMode(ForgotPasswordMode.SendPasswordReset);
    } else if (mode === ForgotPasswordMode.ResetPassword) {
      setMode(ForgotPasswordMode.ValidateResetCode);
    } else {
      router.push('/login/');
    }
  };

  switch (mode) {
    case ForgotPasswordMode.ValidateResetCode:
      return (
        <Container className="wrapper">
          <Row>
            <Col>
              <h2>Enter Security Code</h2>
              <p className="danger">
                Please leave this window open while you wait for an email to be sent
              </p>
              <p>
                If you have a valid email in our system, a six-digit security code has
                been sent to you, please enter it here:
              </p>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="form-group">
                <label>Code:</label>
                <input
                  type="number"
                  value={code}
                  onChange={(e) => setCode(parseInt(e.target.value))}
                  className="form-control"
                  autoComplete="off"
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="form-group">
                <Button onClick={onValidateCode}>Validate</Button>
                <Button onClick={onBack}>Back</Button>
                {resetError ? (
                  <div className="h-fit flex flex-row gap-2 items-center justify-center danger">
                    {resetError}
                  </div>
                ) : (
                  ''
                )}
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
            <Col>
              <h2>Reset Password</h2>
              <p>Please fill out this form to reset your password.</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="form-group">
                <label>New Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  autoComplete="off"
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
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-control"
                  autoComplete="off"
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="form-group">
                <Button onClick={onResetPassword}>Reset</Button>
                <Button onClick={onBack}>Back</Button>
                {resetError ? (
                  <div className="h-fit flex flex-row gap-2 items-center justify-center danger">
                    {resetError}
                  </div>
                ) : (
                  ''
                )}
                {resetSuccess ? (
                  <div className="h-fit flex flex-row gap-2 items-center justify-center success">
                    {resetSuccess}
                  </div>
                ) : (
                  ''
                )}
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
            <Col>
              <h2>Forgot Password</h2>
              <p>Please enter your username/email address.</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="form-group">
                <label>Username:</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-control"
                  placeholder="Please enter email address"
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="form-group">
                <Button onClick={onForgotPassword}>Send</Button>
                <Button onClick={onBack}>Back</Button>
                {resetError ? (
                  <div className="h-fit flex flex-row gap-2 items-center justify-center danger">
                    {resetError}
                  </div>
                ) : (
                  ''
                )}
              </div>
            </Col>
          </Row>
        </Container>
      );
      break;
  }
}
