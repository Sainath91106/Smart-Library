# 📚 Smart Library Management System

A modern, full-stack library management system built with React and Node.js. Features include book management, issue tracking, user authentication, and an admin dashboard with analytics.

## 🚀 Features

### For Students
- 📖 Browse and search books by title, author, or category
- 📝 Issue and return books online
- 👤 Personal dashboard with issue history
- 🎯 Earn points for on-time returns
- 🔐 Secure authentication

### For Admins
- 📊 Comprehensive dashboard with analytics
- ➕ Add, edit, and delete books
- 👥 Manage user accounts
- 📈 Track library statistics
- 🔍 Monitor all book issues and returns

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool & dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS 4** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB Atlas account** (or local MongoDB)

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd smart-library
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd smart-library-server

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env with your credentials
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret_key
# PORT=5001
```

### 3. Frontend Setup

```bash
# Navigate to client directory (from root)
cd ../smart-library-client

# Install dependencies
npm install

# Optional: Create .env file if needed
cp .env.example .env
```

## 🚀 Running the Application

### Start Backend Server

```bash
cd smart-library-server
npm run dev
```

Server will run on `http://localhost:5001`

### Start Frontend Development Server

```bash
cd smart-library-client
npm run dev
```

Client will run on `http://localhost:5173`

## 🔑 Environment Variables

### Backend (.env)
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret_key
PORT=5001
```

### Frontend (.env) - Optional
```env
VITE_API_URL=http://localhost:5001/api
```

## 📁 Project Structure

```
smart-library/
├── smart-library-client/          # React frontend
│   ├── src/
│   │   ├── components/            # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   └── BookCard.jsx
│   │   ├── context/               # React context
│   │   │   └── AuthContext.jsx
│   │   ├── pages/                 # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Books.jsx
│   │   │   └── MyIssues.jsx
│   │   ├── services/              # API services
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── smart-library-server/          # Node.js backend
    ├── config/                    # Configuration
    │   └── db.js
    ├── controllers/               # Route controllers
    │   ├── authController.js
    │   ├── bookController.js
    │   ├── issueController.js
    │   └── dashboardController.js
    ├── middleware/                # Custom middleware
    │   └── authMiddleware.js
    ├── models/                    # MongoDB models
    │   ├── User.js
    │   ├── Book.js
    │   └── Issue.js
    ├── routes/                    # API routes
    │   ├── authRoutes.js
    │   ├── bookRoutes.js
    │   ├── issueRoutes.js
    │   └── dashboardRoutes.js
    ├── server.js
    └── package.json
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Create book (Admin only)
- `PUT /api/books/:id` - Update book (Admin only)
- `DELETE /api/books/:id` - Delete book (Admin only)

### Issues
- `GET /api/issues` - Get all issues (Admin) / user issues (Student)
- `POST /api/issues` - Issue a book
- `PUT /api/issues/:id/return` - Return a book

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## 👥 Default User Roles

### Student Account
Students are the default user type. Register through the signup page or login with:
- **Role:** Student (default on registration)
- **Features:** Browse books, issue/return books, view reading history, earn points

### Admin Account
Create an admin account by registering and manually updating the role in MongoDB:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

**Admin Features:** Manage all books, view all issues, monitor system statistics

### Login Page
The login page has **two tabs**:
- **🎓 Student Login** - For student accounts
- **👨‍💼 Admin Login** - For admin accounts

The system validates that the role matches the selected login type for security.

## 🧪 Testing

Access the test endpoint:
```bash
curl http://localhost:5001/test
```

Expected response:
```json
{
  "message": "Smart Library API is running"
}
```

## 📦 Production Build

### Backend
```bash
cd smart-library-server
npm start
```

### Frontend
```bash
cd smart-library-client
npm run build
```

Build output will be in the `dist/` directory.

## 🔒 Security Notes

1. **Never commit `.env` files** - They contain sensitive credentials
2. **Use strong JWT secrets** - Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
3. **Enable HTTPS** in production
4. **Implement rate limiting** for API endpoints
5. **Validate all user inputs** on both client and server

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify your MongoDB Atlas IP whitelist includes your current IP
- Check the connection string format
- Ensure database user has correct permissions

### CORS Errors
- Verify the frontend URL in backend CORS configuration
- Check that ports match (frontend: 5173, backend: 5001)

### Authentication Issues
- Clear browser localStorage and cookies
- Verify JWT_SECRET is set in .env
- Check token expiration

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Sainath Naik Karamthote

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## ⭐ Show your support

Give a ⭐️ if you like this project!
