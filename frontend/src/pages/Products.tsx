import { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Checkbox,
  Space,
  Spin,
  message,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useProductStore } from '../store/product.store';
import type { Product, CreateProductData, UpdateProductData } from '../api/product.api';

const { TextArea } = Input;

export const Products = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { products, loading, error, fetchAll, create, update, delete: deleteProduct, clearError } = useProductStore();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleAddProduct = () => {
    form.resetFields();
    setEditingId(null);
    setIsModalVisible(true);
  };

  const handleEditProduct = (product: Product) => {
    form.setFieldsValue(product);
    setEditingId(product.id);
    setIsModalVisible(true);
  };

  const handleDeleteProduct = (id: string) => {
    Modal.confirm({
      title: 'Delete Product',
      content: 'Are you sure you want to delete this product?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        try {
          await deleteProduct(id);
          message.success('Product deleted successfully');
        } catch (err) {
          message.error(error || 'Failed to delete product');
        }
      },
    });
  };

  const handleSubmit = async (values: CreateProductData) => {
    try {
      if (editingId) {
        await update(editingId, values as UpdateProductData);
        message.success('Product updated successfully');
      } else {
        await create(values);
        message.success('Product created successfully');
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (err) {
      message.error(error || 'Failed to save product');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      render: (text: string) => (text ? text.substring(0, 50) + '...' : '-'),
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
      width: 100,
      render: (text: string) => text || '-',
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 100,
      render: (value: number) => `₹${value.toFixed(2)}`,
    },
    {
      title: 'Tax Rate',
      dataIndex: 'taxRate',
      key: 'taxRate',
      width: 90,
      render: (value: number) => (value ? `${value}%` : '-'),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (text: string) => text || '-',
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 80,
      render: (isActive: boolean) => (isActive ? 'Active' : 'Inactive'),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: unknown, record: Product) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditProduct(record)}
          />
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteProduct(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Products</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddProduct}>
          Add Product
        </Button>
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
          dataSource={products}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1000 }}
        />
      </Spin>

      <Modal
        title={editingId ? 'Edit Product' : 'Add Product'}
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ isActive: true }}
        >
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true, message: 'Please enter product name' }]}
          >
            <Input placeholder="e.g., Laptop" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea rows={3} placeholder="Product description" />
          </Form.Item>

          <Form.Item
            name="sku"
            label="SKU"
          >
            <Input placeholder="Stock Keeping Unit" />
          </Form.Item>

          <Form.Item
            name="unitPrice"
            label="Unit Price"
            rules={[{ required: true, message: 'Please enter unit price' }]}
          >
            <InputNumber
              min={0}
              step={0.01}
              precision={2}
              placeholder="0.00"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="taxRate"
            label="Tax Rate (%)"
          >
            <InputNumber
              min={0}
              max={100}
              step={0.01}
              precision={2}
              placeholder="0.00"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
          >
            <Input placeholder="e.g., Electronics" />
          </Form.Item>

          <Form.Item
            name="isActive"
            valuePropName="checked"
          >
            <Checkbox>Active</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
