import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Empty, Button, Result } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

export const PendingApproval: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { companyId: string; email: string } | null;

  if (!state) {
    return (
      <div className="auth-container">
        <Empty
          description="No registration data found"
          style={{ marginTop: '50px' }}
        >
          <Button type="primary" onClick={() => navigate('/register')}>
            Back to Register
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <Result
          icon={<CheckCircleOutlined style={{ color: '#52c41a', fontSize: '60px' }} />}
          title="Registration Successful!"
          subTitle="Your company has been registered and is pending admin approval."
          extra={
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '16px', marginBottom: '20px' }}>
                We've sent a confirmation email to <strong>{state.email}</strong>
              </p>
              <p style={{ color: '#666', marginBottom: '30px' }}>
                An administrator will review your company details within 24-48 hours.
                You'll receive an email notification once your company is approved.
              </p>
              <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '4px', marginBottom: '20px' }}>
                <p><strong>Company ID:</strong> {state.companyId}</p>
                <p><strong>Registration Email:</strong> {state.email}</p>
              </div>
              <p style={{ color: '#999', marginBottom: '30px', fontSize: '14px' }}>
                Please check your email for further instructions. You can log in once your company is approved.
              </p>
              <Button
                type="primary"
                size="large"
                onClick={() => navigate('/login')}
              >
                Go to Login
              </Button>
            </div>
          }
        />
      </Card>
    </div>
  );
};
