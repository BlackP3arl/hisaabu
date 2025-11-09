import { useEffect, useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, message, Space, Spin, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useCustomerStore } from '../store/customer.store';
import { Customer, CreateCustomerData } from '../api/customer.api';

type ModalMode = 'create' | 'edit' | null;

export const Customers = () => {
  const { customers, loading, fetchAll, create, update, delete: deleteCustomer } = useCustomerStore();
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleAdd = () => {
    form.resetFields();
    setModalMode('create');
    setSelectedCustomer(null);
    setModalVisible(true);
  };

  const handleEdit = (record: Customer) => {
    form.setFieldsValue(record);
    setModalMode('edit');
    setSelectedCustomer(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCustomer(id);
      message.success('Customer deleted successfully');
    } catch {
      message.error('Failed to delete customer');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      if (modalMode === 'create') {
        await create(values as CreateCustomerData);
        message.success('Customer created successfully');
      } else if (modalMode === 'edit' && selectedCustomer) {
        await update(selectedCustomer.id, values);
        message.success('Customer updated successfully');
      }

      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      if (error instanceof Error && error.message !== 'Failed to validate fields') {
        message.error(error.message || 'Operation failed');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const columns: ColumnsType<Customer> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
    },
    {
      title: 'Contact Person',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
      width: 150,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive) => (isActive ? 'Active' : 'Inactive'),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          />
          <Popconfirm
            title="Delete Customer"
            description="Are you sure you want to delete this customer?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (loading && customers.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title="Customers"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Add Customer
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={customers}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={modalMode === 'create' ? 'Add Customer' : 'Edit Customer'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        confirmLoading={submitting}
      >
        <Form form={form} layout="vertical" style={{ marginTop: '24px' }}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter customer name' }]}
          >
            <Input placeholder="Customer Name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ type: 'email', message: 'Invalid email' }]}
          >
            <Input placeholder="email@example.com" />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
          >
            <Input placeholder="+1234567890" />
          </Form.Item>

          <Form.Item
            label="Contact Person"
            name="contactPerson"
          >
            <Input placeholder="Contact Person Name" />
          </Form.Item>

          <Form.Item
            label="Designation"
            name="designation"
          >
            <Input placeholder="Designation" />
          </Form.Item>

          <Form.Item
            label="GST/TIN Number"
            name="gstTinNumber"
          >
            <Input placeholder="GST/TIN Number" />
          </Form.Item>

          <Form.Item
            label="Website"
            name="website"
          >
            <Input placeholder="https://example.com" />
          </Form.Item>

          <Form.Item
            label="Notes"
            name="notes"
          >
            <Input.TextArea rows={3} placeholder="Additional notes" />
          </Form.Item>

          <Form.Item
            label="Street Address"
            name={['address', 'street']}
          >
            <Input placeholder="Street Address" />
          </Form.Item>

          <Form.Item
            label="City"
            name={['address', 'city']}
          >
            <Input placeholder="City" />
          </Form.Item>

          <Form.Item
            label="State"
            name={['address', 'state']}
          >
            <Input placeholder="State" />
          </Form.Item>

          <Form.Item
            label="Zip Code"
            name={['address', 'zip']}
          >
            <Input placeholder="Zip Code" />
          </Form.Item>

          <Form.Item
            label="Country"
            name={['address', 'country']}
          >
            <Input placeholder="Country" />
          </Form.Item>

          <Form.Item
            label="Status"
            name="isActive"
            valuePropName="checked"
          >
            <input type="checkbox" defaultChecked />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
