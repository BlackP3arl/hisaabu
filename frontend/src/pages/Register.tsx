import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, message, Steps } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, ShopOutlined } from '@ant-design/icons';
import { useAuthStore } from '../store/auth.store';
import '../styles/auth.css';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const { isLoading, registerCompany } = useAuthStore();

  const handleRegister = async (values: any) => {
    try {
      const payload = {
        company: {
          name: values.companyName,
          email: values.companyEmail,
          phone: values.phone,
          gstTinNumber: values.gstTinNumber || '',
          defaultCurrencyCode: values.currency || 'INR',
        },
        user: {
          name: values.fullName,
          email: values.email,
          password: values.password,
        },
      };

      const result = await registerCompany(payload);
      message.success(
        'Company registered successfully! Waiting for admin approval. You will receive an email notification.'
      );

      // Show company and user IDs
      console.log('Registration successful:', result);

      navigate('/pending-approval', {
        state: { companyId: result.companyId, email: values.email },
      });
    } catch (error: any) {
      message.error(error.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card" title="Register Your Company">
        <Steps
          current={currentStep}
          items={[
            { title: 'Company Info' },
            { title: 'Account Info' },
            { title: 'Review' },
          ]}
          style={{ marginBottom: '30px' }}
        />

        <Form
          form={form}
          onFinish={handleRegister}
          layout="vertical"
          requiredMark={false}
        >
          {currentStep === 0 && (
            <>
              <Form.Item
                name="companyName"
                label="Company Name"
                rules={[{ required: true, message: 'Please enter company name' }]}
              >
                <Input
                  prefix={<ShopOutlined />}
                  placeholder="Your Company Name"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="companyEmail"
                label="Company Email"
                rules={[
                  { required: true, message: 'Please enter company email' },
                  { type: 'email', message: 'Please enter a valid email' },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="company@example.com"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Phone"
                rules={[{ required: true, message: 'Please enter phone number' }]}
              >
                <Input
                  placeholder="+91 1234567890"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="gstTinNumber"
                label="GST/TIN Number"
              >
                <Input
                  placeholder="27AABCT1234A1Z0"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="currency"
                label="Default Currency"
                initialValue="INR"
              >
                <Input
                  placeholder="INR"
                  size="large"
                />
              </Form.Item>
            </>
          )}

          {currentStep === 1 && (
            <>
              <Form.Item
                name="fullName"
                label="Full Name"
                rules={[{ required: true, message: 'Please enter your full name' }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Your Full Name"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="your@company.com"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: 'Please enter a password' },
                  {
                    min: 8,
                    message: 'Password must be at least 8 characters',
                  },
                  {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message: 'Password must include uppercase, lowercase, and number',
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Enter a strong password"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Please confirm your password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Confirm your password"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="termsAccepted"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) => {
                      if (value) return Promise.resolve();
                      return Promise.reject(new Error('You must accept the terms'));
                    },
                  },
                ]}
              >
                <input type="checkbox" />
                <span style={{ marginLeft: '8px' }}>
                  I accept the <a href="/terms">Terms and Conditions</a>
                </span>
              </Form.Item>
            </>
          )}

          {currentStep === 2 && (
            <div className="review-section">
              <h3>Review Your Information</h3>
              <div className="review-item">
                <strong>Company Name:</strong>
                <p>{form.getFieldValue('companyName')}</p>
              </div>
              <div className="review-item">
                <strong>Company Email:</strong>
                <p>{form.getFieldValue('companyEmail')}</p>
              </div>
              <div className="review-item">
                <strong>Admin Name:</strong>
                <p>{form.getFieldValue('fullName')}</p>
              </div>
              <div className="review-item">
                <strong>Admin Email:</strong>
                <p>{form.getFieldValue('email')}</p>
              </div>
              <p style={{ marginTop: '20px', color: '#666' }}>
                Click "Complete Registration" to submit your company for approval.
              </p>
            </div>
          )}

          <div className="form-actions">
            {currentStep > 0 && (
              <Button
                onClick={() => setCurrentStep(currentStep - 1)}
                size="large"
              >
                Back
              </Button>
            )}
            {currentStep < 2 && (
              <Button
                type="primary"
                onClick={() => setCurrentStep(currentStep + 1)}
                size="large"
              >
                Next
              </Button>
            )}
            {currentStep === 2 && (
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={isLoading}
              >
                Complete Registration
              </Button>
            )}
          </div>
        </Form>

        <div className="auth-footer" style={{ marginTop: '20px' }}>
          <p>Already have an account? <a href="/login">Sign in here</a></p>
        </div>
      </Card>
    </div>
  );
};
