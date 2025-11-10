import { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  Space,
  Spin,
  message,
  Tag,
  Pagination,
} from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useAdminCompanyStore } from '../store/admin.company.store';
import type { Company } from '../api/admin.company.api';

export const AdminCompanies = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [modalType, setModalType] = useState<'status' | 'plan'>('status');

  const {
    companies,
    loading,
    error,
    page,
    limit,
    totalPages,
    total,
    fetchCompanies,
    updateCompanyStatus,
    updateCompanyPlan,
    clearError,
  } = useAdminCompanyStore();

  useEffect(() => {
    fetchCompanies(page, limit);
  }, []);

  const handleStatusChange = (company: Company) => {
    form.resetFields();
    setEditingCompany(company);
    setModalType('status');
    form.setFieldsValue({ status: company.status });
    setIsModalVisible(true);
  };

  const handlePlanChange = (company: Company) => {
    form.resetFields();
    setEditingCompany(company);
    setModalType('plan');
    form.setFieldsValue({ plan: company.plan });
    setIsModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    if (!editingCompany) return;

    try {
      if (modalType === 'status') {
        await updateCompanyStatus(editingCompany.id, values.status);
        message.success('Company status updated successfully');
      } else {
        await updateCompanyPlan(editingCompany.id, values.plan);
        message.success('Company plan updated successfully');
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (err) {
      message.error(error || 'Failed to update company');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      approved: 'green',
      pending: 'orange',
      rejected: 'red',
      suspended: 'volcano',
    };
    return colors[status] || 'default';
  };

  const columns = [
    {
      title: 'Company Name',
      dataIndex: 'name',
      key: 'name',
      width: 180,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
      render: (text: string) => <a href={`mailto:${text}`}>{text}</a>,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      width: 120,
      render: (text: string) => text || '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status: string, record: Company) => (
        <Space>
          <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleStatusChange(record)}
          >
            Change
          </Button>
        </Space>
      ),
    },
    {
      title: 'Plan',
      dataIndex: 'plan',
      key: 'plan',
      width: 110,
      render: (plan: string, record: Company) => (
        <Space>
          <span>{plan}</span>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handlePlanChange(record)}
          >
            Change
          </Button>
        </Space>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '16px' }}>
        <h1>Companies Management</h1>
        <p>Total Companies: {total}</p>
      </div>

      {error && (
        <div style={{ marginBottom: '16px', padding: '12px', background: '#fff2f0', color: '#ff4d4f', borderRadius: '4px' }}>
          {error}
          <Button type="text" size="small" onClick={clearError} style={{ float: 'right' }}>
            Clear
          </Button>
        </div>
      )}

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={companies}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={false}
        />

        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
          <Pagination
            current={page}
            pageSize={limit}
            total={total}
            onChange={(newPage) => fetchCompanies(newPage, limit)}
            showSizeChanger={false}
          />
        </div>
      </Spin>

      <Modal
        title={modalType === 'status' ? 'Change Company Status' : 'Change Company Plan'}
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        width={400}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          {modalType === 'status' ? (
            <Form.Item
              name="status"
              label="Company Status"
              rules={[{ required: true, message: 'Please select a status' }]}
            >
              <Select
                options={[
                  { label: 'Pending', value: 'pending' },
                  { label: 'Approved', value: 'approved' },
                  { label: 'Rejected', value: 'rejected' },
                  { label: 'Suspended', value: 'suspended' },
                ]}
              />
            </Form.Item>
          ) : (
            <Form.Item
              name="plan"
              label="Company Plan"
              rules={[{ required: true, message: 'Please select a plan' }]}
            >
              <Select
                options={[
                  { label: 'Starter', value: 'starter' },
                  { label: 'Pro', value: 'pro' },
                ]}
              />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};
