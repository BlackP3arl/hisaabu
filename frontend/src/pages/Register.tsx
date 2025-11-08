import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, message, Steps, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, ShopOutlined } from '@ant-design/icons';
import { useAuthStore } from '../store/auth.store';
import '../styles/auth.css';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const { isLoading, registerCompany } = useAuthStore();

  // Store form values in state to persist across steps
  const [formData, setFormData] = useState({
    companyName: '',
    companyEmail: '',
    phone: '',
    gstTinNumber: '',
    currency: 'INR',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });

  const handleNext = async () => {
    try {
      // Validate current step fields
      let fieldsToValidate: string[] = [];

      if (currentStep === 0) {
        fieldsToValidate = ['companyName', 'companyEmail', 'phone'];
      } else if (currentStep === 1) {
        fieldsToValidate = ['fullName', 'email', 'password', 'confirmPassword', 'termsAccepted'];
      }

      await form.validateFields(fieldsToValidate);
      // Save form data before moving to next step
      const values = form.getFieldsValue(fieldsToValidate);
      setFormData({ ...formData, ...values });
      setCurrentStep(currentStep + 1);
    } catch (error) {
      // Validation failed, don't move forward
    }
  };

  const handleBack = () => {
    // Save current step data before going back
    if (currentStep === 1) {
      const values = form.getFieldsValue(['companyName', 'companyEmail', 'phone']);
      setFormData({ ...formData, ...values });
    } else if (currentStep === 2) {
      const values = form.getFieldsValue(['fullName', 'email', 'password', 'confirmPassword', 'termsAccepted']);
      setFormData({ ...formData, ...values });
    }
    setCurrentStep(currentStep - 1);
  };

  const handleRegister = async () => {
    try {
      // Validate all current step fields before submission
      let fieldsToValidate: string[] = [];
      if (currentStep === 1) {
        fieldsToValidate = ['fullName', 'email', 'password', 'confirmPassword', 'termsAccepted'];
      } else if (currentStep === 2) {
        // No fields to validate on review step
        fieldsToValidate = [];
      }

      if (fieldsToValidate.length > 0) {
        await form.validateFields(fieldsToValidate);
        const values = form.getFieldsValue(fieldsToValidate);
        setFormData({ ...formData, ...values });
      }

      // Use stored formData which has all values from all steps
      const payload = {
        company: {
          name: formData.companyName,
          email: formData.companyEmail,
          phone: formData.phone || '',
          gstTinNumber: formData.gstTinNumber || '',
          defaultCurrencyCode: formData.currency || 'INR',
        },
        user: {
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
        },
      };

      console.log('📤 Sending payload to backend:', JSON.stringify(payload, null, 2));
      const result = await registerCompany(payload);
      message.success(
        'Company registered successfully! Waiting for admin approval. You will receive an email notification.'
      );

      console.log('✅ Registration successful:', result);

      navigate('/pending-approval', {
        state: { companyId: result.companyId, email: formData.email },
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Registration failed';
      console.error('❌ Registration error:', error);
      message.error(errorMessage);
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
          layout="vertical"
          requiredMark={false}
        >
          {/* STEP 0: Company Information */}
          {currentStep === 0 && (
            <>
              <Form.Item
                name="companyName"
                label="Company Name"
                rules={[{ required: true, message: 'Please enter company name' }]}
                initialValue={formData.companyName}
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
                initialValue={formData.companyEmail}
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
                initialValue={formData.phone}
              >
                <Input
                  placeholder="+91 1234567890"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="gstTinNumber"
                label="GST/TIN Number"
                initialValue={formData.gstTinNumber}
              >
                <Input
                  placeholder="27AABCT1234A1Z0"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="currency"
                label="Default Currency"
                initialValue={formData.currency}
              >
                <Input
                  placeholder="INR"
                  size="large"
                />
              </Form.Item>
            </>
          )}

          {/* STEP 1: Account Information */}
          {currentStep === 1 && (
            <>
              <Form.Item
                name="fullName"
                label="Full Name"
                rules={[{ required: true, message: 'Please enter your full name' }]}
                initialValue={formData.fullName}
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
                initialValue={formData.email}
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
                initialValue={formData.password}
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
                  ({ getFieldValue }) => (
                    {
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Passwords do not match'));
                      },
                    }
                  ),
                ]}
                initialValue={formData.confirmPassword}
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
                initialValue={formData.termsAccepted}
              >
                <Checkbox>
                  I accept the <a href="/terms">Terms and Conditions</a>
                </Checkbox>
              </Form.Item>
            </>
          )}

          {/* STEP 2: Review */}
          {currentStep === 2 && (
            <div className="review-section">
              <h3>Review Your Information</h3>
              <div className="review-item">
                <strong>Company Name:</strong>
                <p>{formData.companyName}</p>
              </div>
              <div className="review-item">
                <strong>Company Email:</strong>
                <p>{formData.companyEmail}</p>
              </div>
              <div className="review-item">
                <strong>Admin Name:</strong>
                <p>{formData.fullName}</p>
              </div>
              <div className="review-item">
                <strong>Admin Email:</strong>
                <p>{formData.email}</p>
              </div>
              <p style={{ marginTop: '20px', color: '#666' }}>
                Click "Complete Registration" to submit your company for approval.
              </p>
            </div>
          )}

          <div className="form-actions">
            {currentStep > 0 && (
              <Button
                onClick={handleBack}
                size="large"
              >
                Back
              </Button>
            )}
            {currentStep < 2 && (
              <Button
                type="primary"
                onClick={handleNext}
                size="large"
              >
                Next
              </Button>
            )}
            {currentStep === 2 && (
              <Button
                type="primary"
                size="large"
                loading={isLoading}
                onClick={handleRegister}
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
