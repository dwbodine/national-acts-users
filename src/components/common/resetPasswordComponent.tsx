'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button, Col, Input, Row } from 'rsuite';
import Container from 'rsuite/Container';

import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import { useResetPasswordSecure } from '@/hooks/user/useResetPasswordSecure';
import { UserResponse } from '@/types/responses';

export default function ResetPasswordComponent() {
  const { resetPasswordSecure } = useResetPasswordSecure();
  const { getUser } = useCurrentUser();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    document.title = 'Client Portal - Reset Password';
  }, []);

  const handleSubmit = () => {
    const user = getUser();
    if (!user) {
      return;
    }
    const { username } = user;
    setPasswordError('');
    setPasswordSuccess('');
    resetPasswordSecure(username, password, confirmPassword)
      .then((response: UserResponse) => {
        if (response.error) {
          setPasswordError(response.error);
        } else {
          setPasswordSuccess(
            'Password changed successfully, please use new password to log back in...',
          );
          setTimeout(() => {
            router.push('/logout');
          }, 2000);
        }
      })
      .catch(() => {
        setPasswordError(
          'Unknown error while resetting password - please contact your administrator',
        );
      });
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <>
      <Container className="wrapper">
        <Row>
          <Col>
            <h2>Reset Password</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <p>Please fill out this form to reset your password.</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <Row>
              <Col>
                <div>
                  <span>New Password:</span>
                  <Input
                    type="password"
                    placeholder="Password"
                    name="new_password"
                    className="w-80 h-8 px-2 border border-solid border-black rounded"
                    value={password ?? ''}
                    onChange={setPassword}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div>
                  <span>Confirm Password:</span>
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    name="confirm_password"
                    className="w-80 h-8 px-2 border border-solid border-black rounded"
                    value={confirmPassword ?? ''}
                    onChange={setConfirmPassword}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <Button className="rs-btn-primary" onClick={handleSubmit}>
                  Submit
                </Button>
                <Button onClick={handleCancel}>Cancel</Button>
                <div className="h-fit flex flex-row gap-2 items-center justify-center">
                  {passwordError ? <div className="danger">{passwordError}</div> : ''}
                  {passwordSuccess ? <div className="success">{passwordSuccess}</div> : ''}
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
}
