import React from 'react';
import { Layout, Button, Avatar, Dropdown, Space, Typography } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const { Header } = Layout;
const { Text } = Typography;

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <SettingOutlined />,
      label: 'Profile Settings',
      onClick: () => navigate('/profile'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <Header className="navbar flex items-center justify-between">
      <div 
        className="logo cursor-pointer"
        onClick={() => navigate(isAuthenticated ? '/profile' : '/')}
      >
        🔐 UserAuth
      </div>

      {isAuthenticated && user ? (
        <Space>
          <Text className="hidden sm:inline">
            Welcome, {user.firstName}!
          </Text>
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            arrow
          >
            <Button type="text" className="flex items-center">
              <Avatar 
                size="small" 
                icon={<UserOutlined />}
                className="mr-2"
              />
              <span className="hidden sm:inline">
                {user.firstName} {user.lastName}
              </span>
            </Button>
          </Dropdown>
        </Space>
      ) : (
        <Space>
          <Button type="text" onClick={() => navigate('/login')}>
            Login
          </Button>
          <Button type="primary" onClick={() => navigate('/register')}>
            Register
          </Button>
        </Space>
      )}
    </Header>
  );
};

export default Navbar;
