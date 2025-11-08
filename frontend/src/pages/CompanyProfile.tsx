import { useEffect, useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Upload,
  message,
  Spin,
  Divider,
  Avatar,
  Space,
} from 'antd';
import { UploadOutlined, SaveOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { useCompanyStore } from '../store/company.store';
import '../styles/auth.css';

interface BankAccount {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  ifscCode: string;
  branchName?: string;
}

export const CompanyProfile = () => {
  const [form] = Form.useForm();
  const [logoFile, setLogoFile] = useState<UploadFile | null>(null);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);

  const {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    uploadLogo,
    clearError,
  } = useCompanyStore();

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Populate form when profile loads
  useEffect(() => {
    if (profile) {
      form.setFieldsValue({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        website: profile.website,
        gstTinNumber: profile.gstTinNumber,
        defaultCurrencyCode: profile.defaultCurrencyCode,
        headerNote: profile.headerNote,
        footerNote: profile.footerNote,
        defaultTerms: profile.defaultTerms,
        defaultInvoiceTerms: profile.defaultInvoiceTerms,
        defaultQuotationTerms: profile.defaultQuotationTerms,
        street: profile.address?.street,
        city: profile.address?.city,
        state: profile.address?.state,
        zip: profile.address?.zip,
        country: profile.address?.country,
        facebook: profile.socialLinks?.facebook,
        instagram: profile.socialLinks?.instagram,
        linkedin: profile.socialLinks?.linkedin,
        twitter: profile.socialLinks?.twitter,
      });
      if (profile.bankAccounts) {
        setBankAccounts(profile.bankAccounts);
      }
    }
  }, [profile, form]);

  // Clear error when user navigates away
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleLogoUpload = async (file: UploadFile) => {
    try {
      if (file.originFileObj) {
        await uploadLogo(file.originFileObj);
        message.success('Logo uploaded successfully');
        setLogoFile(null);
        return false; // Prevent default upload behavior
      }
    } catch {
      message.error('Failed to upload logo');
    }
    return false;
  };

  const handleSubmit = async (values: any) => {
    try {
      const updateData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        website: values.website,
        gstTinNumber: values.gstTinNumber,
        defaultCurrencyCode: values.defaultCurrencyCode,
        headerNote: values.headerNote,
        footerNote: values.footerNote,
        defaultTerms: values.defaultTerms,
        defaultInvoiceTerms: values.defaultInvoiceTerms,
        defaultQuotationTerms: values.defaultQuotationTerms,
        address: {
          street: values.street,
          city: values.city,
          state: values.state,
          zip: values.zip,
          country: values.country,
        },
        socialLinks: {
          facebook: values.facebook,
          instagram: values.instagram,
          linkedin: values.linkedin,
          twitter: values.twitter,
        },
        bankAccounts: bankAccounts.length > 0 ? bankAccounts : undefined,
      };

      await updateProfile(updateData);
      message.success('Company profile updated successfully');
    } catch {
      message.error('Failed to update company profile');
    }
  };

  if (loading && !profile) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <Card title="Company Profile">
        {error && (
          <div style={{ color: '#ff4d4f', marginBottom: '16px', padding: '12px', backgroundColor: '#fff1f0', borderRadius: '4px' }}>
            {error}
          </div>
        )}

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* Logo Section */}
          <Card type="inner" title="Company Logo" style={{ marginBottom: '24px' }}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {profile?.logoUrl && (
                <Avatar
                  size={120}
                  src={profile.logoUrl}
                  style={{ backgroundColor: '#f0f0f0' }}
                />
              )}
              <Upload
                beforeUpload={handleLogoUpload}
                accept="image/*"
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Upload Logo</Button>
              </Upload>
            </Space>
          </Card>

          <Divider />

          {/* Basic Information */}
          <Card type="inner" title="Basic Information" style={{ marginBottom: '24px' }}>
            <Form.Item
              label="Company Name"
              name="name"
              rules={[{ required: true, message: 'Company name is required' }]}
            >
              <Input placeholder="Your Company Name" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Email is required' },
                { type: 'email', message: 'Invalid email' },
              ]}
            >
              <Input placeholder="company@example.com" />
            </Form.Item>

            <Form.Item
              label="Phone"
              name="phone"
              rules={[{ required: true, message: 'Phone is required' }]}
            >
              <Input placeholder="+91 1234567890" />
            </Form.Item>

            <Form.Item
              label="Website"
              name="website"
            >
              <Input placeholder="https://example.com" />
            </Form.Item>

            <Form.Item
              label="GST/TIN Number"
              name="gstTinNumber"
            >
              <Input placeholder="27AABCT1234A1Z0" />
            </Form.Item>

            <Form.Item
              label="Default Currency"
              name="defaultCurrencyCode"
              rules={[{ required: true, message: 'Currency is required' }]}
            >
              <Input placeholder="INR" maxLength={3} />
            </Form.Item>
          </Card>

          <Divider />

          {/* Address */}
          <Card type="inner" title="Address" style={{ marginBottom: '24px' }}>
            <Form.Item label="Street" name="street">
              <Input placeholder="Street address" />
            </Form.Item>

            <Form.Item label="City" name="city">
              <Input placeholder="City" />
            </Form.Item>

            <Form.Item label="State" name="state">
              <Input placeholder="State" />
            </Form.Item>

            <Form.Item label="Postal Code" name="zip">
              <Input placeholder="12345" />
            </Form.Item>

            <Form.Item label="Country" name="country">
              <Input placeholder="Country" />
            </Form.Item>
          </Card>

          <Divider />

          {/* Social Links */}
          <Card type="inner" title="Social Links" style={{ marginBottom: '24px' }}>
            <Form.Item label="Facebook" name="facebook">
              <Input placeholder="https://facebook.com/company" />
            </Form.Item>

            <Form.Item label="Instagram" name="instagram">
              <Input placeholder="https://instagram.com/company" />
            </Form.Item>

            <Form.Item label="LinkedIn" name="linkedin">
              <Input placeholder="https://linkedin.com/company/company" />
            </Form.Item>

            <Form.Item label="Twitter" name="twitter">
              <Input placeholder="https://twitter.com/company" />
            </Form.Item>
          </Card>

          <Divider />

          {/* Terms and Notes */}
          <Card type="inner" title="Terms & Notes" style={{ marginBottom: '24px' }}>
            <Form.Item label="Default Terms" name="defaultTerms">
              <Input.TextArea
                placeholder="Default payment/delivery terms"
                rows={3}
              />
            </Form.Item>

            <Form.Item label="Invoice Terms" name="defaultInvoiceTerms">
              <Input.TextArea
                placeholder="Default invoice terms"
                rows={3}
              />
            </Form.Item>

            <Form.Item label="Quotation Terms" name="defaultQuotationTerms">
              <Input.TextArea
                placeholder="Default quotation terms"
                rows={3}
              />
            </Form.Item>

            <Form.Item label="Header Note" name="headerNote">
              <Input.TextArea
                placeholder="Note to display at the top of documents"
                rows={2}
              />
            </Form.Item>

            <Form.Item label="Footer Note" name="footerNote">
              <Input.TextArea
                placeholder="Note to display at the bottom of documents"
                rows={2}
              />
            </Form.Item>
          </Card>

          <Divider />

          {/* Submit Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              icon={<SaveOutlined />}
              loading={loading}
              block
            >
              Save Profile
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
