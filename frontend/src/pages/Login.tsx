import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Form, Input, Button, Card, Tabs, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useAuthStore } from '../store/auth.store';
import '../styles/auth.css';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'admin' | 'company'>(
    (searchParams.get('type') as 'admin' | 'company') || 'company'
  );
  const [adminForm] = Form.useForm();
  const [companyForm] = Form.useForm();
  const { isLoading, loginAsAdmin, loginAsCompanyUser } = useAuthStore();

  const handleAdminLogin = async (values: any) => {
    try {
      await loginAsAdmin(values.email, values.password);
      message.success('Admin login successful!');
      navigate('/admin/dashboard');
    } catch (error: any) {
      message.error(error.response?.data?.error || 'Admin login failed');
    }
  };

  const handleCompanyLogin = async (values: any) => {
    try {
      await loginAsCompanyUser(values.email, values.password);
      message.success('Company login successful!');
      navigate('/dashboard');
    } catch (error: any) {
      message.error(error.response?.data?.error || 'Company login failed');
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card" title="Hisaabu Login">
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as 'admin' | 'company')}
          items={[
            {
              key: 'company',
              label: 'Company Login',
              children: (
                <Form
                  form={companyForm}
                  onFinish={handleCompanyLogin}
                  layout="vertical"
                  requiredMark={false}
                >
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
                    rules={[{ required: true, message: 'Please enter your password' }]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="Enter your password"
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      size="large"
                      loading={isLoading}
                    >
                      Sign In
                    </Button>
                  </Form.Item>

                  <div className="auth-footer">
                    <p>Don't have an account? <a href="/register">Register here</a></p>
                  </div>
                </Form>
              ),
            },
            {
              key: 'admin',
              label: 'Admin Login',
              children: (
                <Form
                  form={adminForm}
                  onFinish={handleAdminLogin}
                  layout="vertical"
                  requiredMark={false}
                >
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
                      placeholder="admin@example.com"
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[{ required: true, message: 'Please enter your password' }]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="Enter your password"
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      size="large"
                      loading={isLoading}
                    >
                      Admin Sign In
                    </Button>
                  </Form.Item>

                  <div className="auth-footer">
                    <p>Admins only - contact support for access</p>
                  </div>
                </Form>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};
