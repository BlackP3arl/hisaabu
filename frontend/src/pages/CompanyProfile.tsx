import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { UploadOutlined, SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
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
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [logoFile, setLogoFile] = useState<UploadFile | null>(null);
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [logoKey, setLogoKey] = useState<number>(0);
  const [loadingLogo, setLoadingLogo] = useState(false);

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
        console.log('Starting logo upload...');
        await uploadLogo(file.originFileObj);
        console.log('✅ Logo uploaded, store updated');
        message.success('Logo uploaded successfully');
        setLogoFile(null);
        // Force re-render of img by incrementing key
        setLogoKey(prev => prev + 1);
        console.log('Logo image will refresh');
        return false; // Prevent default upload behavior
      }
    } catch (error) {
      console.error('Logo upload error:', error);
      message.error('Failed to upload logo');
    }
    return false;
  };

  const handleLogoUrlUpdate = async () => {
    if (!logoUrl.trim()) {
      message.error('Please enter a valid URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(logoUrl);
    } catch {
      message.error('Please enter a valid URL');
      return;
    }

    setLoadingLogo(true);
    try {
      // Add cache-busting parameter
      const urlWithCache = `${logoUrl}?t=${Date.now()}`;
      await updateProfile({ logoUrl: urlWithCache });
      message.success('Logo URL updated successfully');
      setLogoUrl('');
      setLogoKey(prev => prev + 1);
      await fetchProfile();
    } catch (error) {
      console.error('Logo URL update error:', error);
      message.error('Failed to update logo URL');
    } finally {
      setLoadingLogo(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      console.log('=== FORM SUBMISSION ===');
      console.log('Form values received:', JSON.stringify(values, null, 2));

      // Helper to check if object has any non-empty values
      const hasAnyValue = (obj: any) =>
        obj && Object.values(obj).some((v) => v !== null && v !== undefined && v !== '');

      const updateData: any = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        website: values.website || undefined,
        gstTinNumber: values.gstTinNumber || undefined,
        defaultCurrencyCode: values.defaultCurrencyCode,
        headerNote: values.headerNote || undefined,
        footerNote: values.footerNote || undefined,
        defaultTerms: values.defaultTerms || undefined,
        defaultInvoiceTerms: values.defaultInvoiceTerms || undefined,
        defaultQuotationTerms: values.defaultQuotationTerms || undefined,
      };

      // Only add address if it has at least one value
      const addressData = {
        street: values.street,
        city: values.city,
        state: values.state,
        zip: values.zip,
        country: values.country,
      };
      if (hasAnyValue(addressData)) {
        updateData.address = addressData;
      }

      // Only add social links if it has at least one value
      const socialData = {
        facebook: values.facebook,
        instagram: values.instagram,
        linkedin: values.linkedin,
        twitter: values.twitter,
      };
      if (hasAnyValue(socialData)) {
        updateData.socialLinks = socialData;
      }

      // Only add bank accounts if available
      if (bankAccounts.length > 0) {
        updateData.bankAccounts = bankAccounts;
      }

      console.log('Sending update data:', JSON.stringify(updateData, null, 2));
      await updateProfile(updateData);
      console.log('✅ Update successful');
      message.success('Company profile updated successfully');
    } catch (error) {
      console.error('❌ Update failed:', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to update company profile';
      message.error(errorMsg);
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
      <Card
        title="Company Profile"
        extra={
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/dashboard')}
            type="default"
          >
            Back to Dashboard
          </Button>
        }
      >
        {error && (
          <div style={{ color: '#ff4d4f', marginBottom: '16px', padding: '12px', backgroundColor: '#fff1f0', borderRadius: '4px' }}>
            {error}
          </div>
        )}

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* Logo Section */}
          <Card type="inner" title="Company Logo" style={{ marginBottom: '24px' }}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {profile?.logoUrl ? (
                <div key={logoKey}>
                  <img
                    src={profile.logoUrl}
                    alt="Company Logo"
                    style={{
                      maxWidth: '200px',
                      maxHeight: '200px',
                      borderRadius: '4px',
                      border: '1px solid #d9d9d9'
                    }}
                    onError={(e) => {
                      console.error('Image failed to load:', profile.logoUrl);
                      e.currentTarget.style.display = 'none';
                    }}
                    onLoad={() => {
                      console.log('Image loaded successfully:', profile.logoUrl);
                    }}
                  />
                </div>
              ) : (
                <div style={{ color: '#999', padding: '20px' }}>No logo uploaded yet</div>
              )}

              <Divider style={{ margin: '12px 0' }} />

              <div style={{ display: 'flex', gap: '12px' }}>
                <Upload
                  beforeUpload={handleLogoUpload}
                  accept="image/*"
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Upload Image</Button>
                </Upload>
                <span style={{ color: '#999' }}>or</span>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <Input
                  placeholder="Enter logo URL (https://example.com/logo.png)"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  onPressEnter={handleLogoUrlUpdate}
                  disabled={loadingLogo}
                  style={{ flex: 1 }}
                />
                <Button
                  type="primary"
                  onClick={handleLogoUrlUpdate}
                  loading={loadingLogo}
                >
                  Set URL
                </Button>
              </div>
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
