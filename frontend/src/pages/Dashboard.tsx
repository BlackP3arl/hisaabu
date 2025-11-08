import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col, Statistic, Layout, Menu, Space, Avatar } from 'antd';
import { LogoutOutlined, UserOutlined, ShopOutlined, SettingOutlined } from '@ant-design/icons';
import { useAuthStore } from '../store/auth.store';
import { useCompanyStore } from '../store/company.store';

const { Header, Content } = Layout;

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, company, logout } = useAuthStore();
  const { profile, fetchProfile } = useCompanyStore();

  // Fetch company profile on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#667eea' }}>
            Hisaabu - {company?.name}
          </div>
          <Space>
            <Button
              type="text"
              icon={<SettingOutlined />}
              onClick={() => navigate('/company/profile')}
            >
              Company Settings
            </Button>
            <Button
              type="text"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Space>
        </div>
      </Header>

      <Content style={{ padding: '24px' }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ textAlign: 'center' }}>
              {profile?.logoUrl ? (
                <Avatar
                  size={120}
                  src={profile.logoUrl}
                  style={{ backgroundColor: '#f0f0f0', marginBottom: '16px' }}
                />
              ) : (
                <Avatar
                  size={120}
                  icon={<ShopOutlined />}
                  style={{ backgroundColor: '#667eea', marginBottom: '16px' }}
                />
              )}
              <h3 style={{ margin: '12px 0 0 0' }}>{company?.name}</h3>
            </Card>
          </Col>

          <Col span={24}>
            <Card>
              <h2>Welcome, {user?.name}!</h2>
              <p>This is your company dashboard. More features coming soon!</p>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Company Status"
                value={company?.status}
                prefix={<ShopOutlined />}
                valueStyle={{
                  color: company?.status === 'approved' ? '#52c41a' : '#faad14',
                }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Plan"
                value={company?.plan}
                prefix={<ShopOutlined />}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Email"
                value={user?.email}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Role"
                value={user?.role}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
          <Col span={24}>
            <Card title="Company Information">
              <p><strong>Company ID:</strong> {company?.id}</p>
              <p><strong>User ID:</strong> {user?.id}</p>
              <p><strong>User Email:</strong> {user?.email}</p>
              <p><strong>Company Status:</strong> {company?.status}</p>
              <p><strong>Plan:</strong> {company?.plan}</p>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};
