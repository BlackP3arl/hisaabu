import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col, Statistic, Layout, Space } from 'antd';
import { LogoutOutlined, UserOutlined, TeamOutlined, BuildOutlined } from '@ant-design/icons';
import { useAuthStore } from '../store/auth.store';

const { Header, Content } = Layout;

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { admin, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login?type=admin');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#667eea' }}>
            Hisaabu - Admin Panel
          </div>
          <Space>
            <Button
              type="text"
              icon={<BuildOutlined />}
              onClick={() => navigate('/admin/companies')}
            >
              Manage Companies
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
          <Col span={24}>
            <Card>
              <h2>Welcome, {admin?.name}!</h2>
              <p>Admin Dashboard - Manage companies and users from here.</p>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic
                title="Admin Role"
                value={admin?.role}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic
                title="Email"
                value={admin?.email}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic
                title="Admin ID"
                value={admin?.id?.substring(0, 8)}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
          <Col span={24}>
            <Card title="Admin Information">
              <p><strong>Name:</strong> {admin?.name}</p>
              <p><strong>Email:</strong> {admin?.email}</p>
              <p><strong>Admin ID:</strong> {admin?.id}</p>
              <p><strong>Role:</strong> {admin?.role}</p>
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
          <Col span={24}>
            <Card title="Admin Features (Coming Soon)">
              <ul>
                <li>Approve/Reject company registrations</li>
                <li>Manage user accounts</li>
                <li>View system statistics</li>
                <li>Configure platform settings</li>
                <li>View audit logs</li>
              </ul>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};
