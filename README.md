# User Authentication Module

A full-stack authentication system built with React TypeScript frontend and Express.js backend.

## Features

- User registration and login
- JWT-based authentication
- Protected routes with automatic redirects
- User profile management with edit functionality
- Modern UI with Ant Design
- MySQL database with proper ORM
- Comprehensive error handling

## Tech Stack

### Frontend
- React 18 with TypeScript
- Ant Design (UI Components)
- Tailwind CSS (Styling)
- Axios (HTTP Client)
- React Router (Navigation)

### Backend
- Express.js with TypeScript
- JWT Authentication
- MySQL Database
- Sequelize ORM (TypeScript alternative to SQLAlchemy)
- Bcrypt (Password Hashing)
- CORS & Security Middleware

## Project Structure

```
User_Auth/
├── frontend/          # React TypeScript frontend
├── backend/           # Express.js backend
├── database/          # Database schema and migrations
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MySQL Server
- Git

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd User_Auth
```

2. Install frontend dependencies
```bash
cd frontend
npm install
```

3. Install backend dependencies
```bash
cd ../backend
npm install
```

4. Set up environment variables (see .env.example files)

5. Set up MySQL database
```bash
# Create database
mysql -u root -p
CREATE DATABASE user_auth_db;
```

6. Run database migrations
```bash
cd backend
npm run migrate
```

7. Start development servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)
- `POST /api/auth/logout` - User logout

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
JWT_SECRET=your_jwt_secret_key
DB_HOST=localhost
DB_PORT=3306
DB_NAME=user_auth_db
DB_USER=root
DB_PASSWORD=your_password
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
