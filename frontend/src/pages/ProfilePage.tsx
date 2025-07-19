import React, { useState } from 'react';
import { Layout, Card, Form, Input, Button, Typography, Avatar, Row, Col, DatePicker, Alert, Space, Divider } from 'antd';
import { UserOutlined, EditOutlined, SaveOutlined, PhoneOutlined, MailOutlined, CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import _ from 'lodash';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

const { Content } = Layout;
const { Title, Text } = Typography;

const ProfilePage: React.FC = () => {
  const { user, updateProfile, loading } = useAuth();
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Initialize form with user data
  React.useEffect(() => {
    if (user) {
      form.setFieldsValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth ? dayjs(user.dateOfBirth) : null
      });
    }
  }, [user, form]);

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
    setSuccess('');
    // Reset form to original values
    if (user) {
      form.setFieldsValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth ? dayjs(user.dateOfBirth) : null
      });
    }
  };

  const handleSave = async () => {
    try {
      setUpdateLoading(true);
      setError('');
      setSuccess('');

      const values = await form.validateFields();
      
      // Prepare update data (exclude email as it shouldn't be updated)
      const updateData = _.omit(values, ['email']);
      
      // Format date if provided
      if (updateData.dateOfBirth) {
        updateData.dateOfBirth = dayjs(updateData.dateOfBirth).format('YYYY-MM-DD');
      }

      const response = await updateProfile(updateData);
      
      if (response.success) {
        setIsEditing(false);
        setSuccess('Profile updated successfully!');
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (error) {
      setError('Please fix the form errors before saving.');
    } finally {
      setUpdateLoading(false);
    }
  };

  if (!user) {
    return (
      <Layout className="min-h-screen">
        <Navbar />
        <Content className="flex items-center justify-center">
          <Text>Loading user data...</Text>
        </Content>
      </Layout>
    );
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Layout className="min-h-screen bg-gray-50">
      <Navbar />
      <Content className="profile-container">
        <div className="profile-card">
          {/* Header Section */}
          <div className="text-center mb-8">
            <Avatar
              size={100}
              className="mb-4 bg-blue-500"
              style={{ fontSize: '2rem' }}
            >
              {getInitials(user.firstName, user.lastName)}
            </Avatar>
            <Title level={2} className="mb-2">
              {user.firstName} {user.lastName}
            </Title>
            <Text type="secondary" className="text-lg">
              {user.email}
            </Text>
          </div>

          {/* Alert Messages */}
          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              className="mb-4"
              closable
              onClose={() => setError('')}
            />
          )}

          {success && (
            <Alert
              message={success}
              type="success"
              showIcon
              className="mb-4"
              closable
              onClose={() => setSuccess('')}
            />
          )}

          <Divider />

          {/* Profile Form */}
          <Form
            form={form}
            layout="vertical"
            size="large"
            disabled={!isEditing}
          >
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="firstName"
                  label="First Name"
                  rules={[
                    { required: true, message: 'Please input your first name!' },
                    { min: 2, message: 'First name must be at least 2 characters!' },
                    { pattern: /^[a-zA-Z\s]+$/, message: 'First name can only contain letters!' }
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="First name"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="lastName"
                  label="Last Name"
                  rules={[
                    { required: true, message: 'Please input your last name!' },
                    { min: 2, message: 'Last name must be at least 2 characters!' },
                    { pattern: /^[a-zA-Z\s]+$/, message: 'Last name can only contain letters!' }
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Last name"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="email"
              label="Email"
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Email address"
                disabled
                className="bg-gray-100"
              />
            </Form.Item>
            <Text type="secondary" className="text-sm -mt-2 block mb-4">
              Email cannot be changed for security reasons
            </Text>

            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="phone"
                  label="Phone Number"
                  rules={[
                    { pattern: /^[\+]?[1-9][\d]{0,15}$/, message: 'Please enter a valid phone number!' }
                  ]}
                >
                  <Input
                    prefix={<PhoneOutlined />}
                    placeholder="Phone number (optional)"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="dateOfBirth"
                  label="Date of Birth"
                >
                  <DatePicker
                    prefix={<CalendarOutlined />}
                    placeholder="Select date of birth"
                    style={{ width: '100%' }}
                    disabledDate={(current) => current && current > dayjs().endOf('day')}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Action Buttons */}
            <div className="text-center mt-8">
              {!isEditing ? (
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  size="large"
                  onClick={handleEdit}
                  className="px-8"
                >
                  Edit Profile
                </Button>
              ) : (
                <Space size="middle">
                  <Button
                    size="large"
                    onClick={handleCancel}
                    className="px-6"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    size="large"
                    onClick={handleSave}
                    loading={updateLoading}
                    className="px-8"
                  >
                    Save Changes
                  </Button>
                </Space>
              )}
            </div>
          </Form>

          {/* Account Info */}
          <Divider />
          <div className="text-center">
            <Text type="secondary">
              Member since {dayjs(user.createdAt).format('MMMM YYYY')}
            </Text>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default ProfilePage;
