<div align="center">

# 📚 Smart Library Management System

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=32&duration=2800&pause=2000&color=6366F1&center=true&vCenter=true&width=940&lines=Welcome+to+Smart+Library+%F0%9F%93%96;Modern+Library+Management+Made+Easy+%E2%9C%A8;Secure+%7C+Fast+%7C+Beautiful+%F0%9F%9A%80" alt="Typing SVG" />

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-7.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Express.js-5.x-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
</p>

<p align="center">
  <img src="https://img.shields.io/github/license/Sainath91106/Smart-Library?style=flat-square&color=5D6D7E" alt="GitHub license" />
  <img src="https://img.shields.io/github/stars/Sainath91106/Smart-Library?style=flat-square&color=FFD700" alt="GitHub stars" />
  <img src="https://img.shields.io/github/forks/Sainath91106/Smart-Library?style=flat-square&color=1ABC9C" alt="GitHub forks" />
  <img src="https://img.shields.io/github/last-commit/Sainath91106/Smart-Library?style=flat-square&color=E74C3C" alt="GitHub last commit" />
</p>

<p align="center">
  A modern, full-stack library management system with a stunning dark theme UI featuring glassmorphism effects, secure JWT authentication, and role-based access control.
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-demo">Demo</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-api-documentation">API Docs</a> •
  <a href="#-screenshots">Screenshots</a>
</p>

</div>

---

## ✨ Features

<table>
<tr>
<td>

### 🎨 **Beautiful UI/UX**
- 🌙 Dark theme with glassmorphism effects
- 🎯 Responsive design for all devices
- ✨ Smooth animations and transitions
- 🎨 Modern gradient cards and components
- 📱 Mobile-first approach

</td>
<td>

### 🔐 **Secure Authentication**
- 🔑 JWT-based authentication
- 👥 Role-based access control (Admin/Student)
- 🛡️ Protected routes and middleware
- 🚫 Secure password hashing with bcrypt
- ✅ Input validation and sanitization

</td>
</tr>
<tr>
<td>

### 📚 **Book Management**
- ➕ Add, edit, and delete books
- 🔍 Advanced search and filters
- 📖 Category-based organization
- 📊 Real-time availability tracking
- 🖼️ Cover image support

</td>
<td>

### 📋 **Issue Management**
- 📤 Book issue/return system
- ⏰ Due date tracking
- ⚠️ Overdue book alerts
- 📊 Issue history tracking
- 🔄 Real-time status updates

</td>
</tr>
<tr>
<td>

### 👨‍💼 **Admin Dashboard**
- 📊 Statistics and analytics
- 👥 User management
- 📖 Monitor all issues
- ⚠️ Overdue book tracking
- 📈 Recent activity feed

</td>
<td>

### 🎓 **Student Dashboard**
- 📚 Browse available books
- 📖 View issued books
- ⭐ Points system
- 📅 Due date reminders
- 📝 Issue history

</td>
</tr>
</table>

---

## 🎬 Demo

<div align="center">

### 🏠 Landing & Authentication
*Beautiful login/signup interface with tab-based role selection*

### 👨‍💼 Admin Dashboard
*Comprehensive admin panel with statistics, overdue tracking, and management tools*

### 🎓 Student Dashboard
*User-friendly interface for browsing books and managing issues*

### 📚 Book Management
*Advanced book catalog with search, filters, and CRUD operations*

</div>

> **Note:** Add your demo GIFs or screenshots here once you deploy the application

---

## 🛠️ Tech Stack

<div align="center">

### Frontend
<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
<img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
<img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white" alt="React Router" />
<img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios" />

### Backend
<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
<img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
<img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
<img src="https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white" alt="Mongoose" />
<img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white" alt="JWT" />

</div>

---

## 🚀 Installation

<details>
<summary><b>📋 Prerequisites</b></summary>

- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- npm or yarn
- Git

</details>

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Sainath91106/Smart-Library.git
cd Smart-Library
```

### 2️⃣ Backend Setup

```bash
cd smart-library-server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure your environment variables
# Edit .env file with your MongoDB URI, JWT secret, and one AI provider key
```

**Environment Variables (.env)**
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/smart-library
JWT_SECRET=your_super_secret_jwt_key_here
OPENAI_API_KEY=your_openai_api_key_here
# OR
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
```

**Seed the Database (Optional)**
```bash
npm run seed
```

**Start the Server**
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

### 3️⃣ Frontend Setup

```bash
cd smart-library-client

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure API URL
# Edit .env file
```

**Environment Variables (.env)**
```env
VITE_API_URL=http://localhost:5001/api
```

**Start the Development Server**
```bash
npm run dev
```

### 4️⃣ Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5001
- **API Test Endpoint:** http://localhost:5001/test

---

## 📡 API Documentation

<details>
<summary><b>🔐 Authentication Routes</b></summary>

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

</details>

<details>
<summary><b>📚 Book Routes</b></summary>

### Get All Books
```http
GET /api/books?search=keyword&category=Fiction&available=true
```

### Get Book by ID
```http
GET /api/books/:id
```

### Create Book (Admin Only)
```http
POST /api/books
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Book Title",
  "author": "Author Name",
  "category": "Fiction",
  "description": "Book description",
  "totalCopies": 5,
  "availableCopies": 5
}
```

### Update Book (Admin Only)
```http
PUT /api/books/:id
Authorization: Bearer <token>
```

### Delete Book (Admin Only)
```http
DELETE /api/books/:id
Authorization: Bearer <token>
```

</details>

<details>
<summary><b>📖 Issue Routes</b></summary>

### Issue a Book
```http
POST /api/issues
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookId": "book_id_here"
}
```

### Return a Book
```http
PATCH /api/issues/:id/return
Authorization: Bearer <token>
```

### Get My Issues
```http
GET /api/issues/my
Authorization: Bearer <token>
```

</details>

<details>
<summary><b>📊 Dashboard Routes</b></summary>

### Get Dashboard Stats
```http
GET /api/dashboard/stats
Authorization: Bearer <token>
```

### Get Overdue Books (Admin Only)
```http
GET /api/dashboard/overdue
Authorization: Bearer <token>
```

### Get Recent Issues (Admin Only)
```http
GET /api/dashboard/recent-issues
Authorization: Bearer <token>
```

</details>

---

## 📸 Screenshots

<div align="center">

### 🔐 Login Page
*Dark themed login with role-based tabs*

### 👨‍💼 Admin Dashboard
*Statistics cards with gradient icons and overdue tracking*

### 📚 Books Catalog
*Modern card layout with search and filters*

### 📖 My Issues
*Track borrowed books with status indicators*

</div>

> **Add your screenshots here:** Take screenshots of your running application and add them to showcase the UI

---

## 📁 Project Structure

```
Smart-Library/
├── smart-library-client/          # Frontend React Application
│   ├── public/                    # Static files
│   ├── src/
│   │   ├── components/            # Reusable components
│   │   │   ├── BookCard.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/               # React Context
│   │   │   └── AuthContext.jsx
│   │   ├── pages/                 # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── Books.jsx
│   │   │   └── MyIssues.jsx
│   │   ├── services/              # API services
│   │   │   └── api.js
│   │   ├── App.jsx                # Main app component
│   │   ├── main.jsx               # Entry point
│   │   └── index.css              # Global styles
│   ├── package.json
│   └── vite.config.js
│
├── smart-library-server/          # Backend Node.js API
│   ├── config/
│   │   └── db.js                  # Database configuration
│   ├── controllers/               # Route controllers
│   │   ├── authController.js
│   │   ├── bookController.js
│   │   ├── issueController.js
│   │   └── dashboardController.js
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT authentication
│   ├── models/                    # Mongoose models
│   │   ├── User.js
│   │   ├── Book.js
│   │   └── Issue.js
│   ├── routes/                    # API routes
│   │   ├── authRoutes.js
│   │   ├── bookRoutes.js
│   │   ├── issueRoutes.js
│   │   └── dashboardRoutes.js
│   ├── server.js                  # Express server
│   ├── seedBooks.js               # Database seeder
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🎯 Key Features Explained

### 🔒 Security Features
- **JWT Authentication:** Secure token-based authentication
- **Password Hashing:** Bcrypt for secure password storage
- **Role-Based Access:** Separate admin and student functionalities
- **Protected Routes:** Middleware to guard sensitive endpoints
- **Input Validation:** Server-side validation for all inputs

### 🎨 UI/UX Features
- **Dark Theme:** Easy on the eyes with beautiful glassmorphism
- **Responsive Design:** Works perfectly on mobile, tablet, and desktop
- **Smooth Animations:** Fade-in, slide-in, and hover effects
- **Interactive Cards:** Gradient icons with hover states
- **Loading States:** Skeleton loaders for better UX

### ⚡ Performance Features
- **Optimized Queries:** Efficient MongoDB queries with indexing
- **Transaction Support:** Atomic operations for critical updates
- **Error Handling:** Comprehensive error handling throughout
- **Code Splitting:** React lazy loading for optimal performance

---

## 👥 User Roles

### 👨‍💼 Admin Features
- ✅ View all books and users
- ✅ Add, edit, and delete books
- ✅ View all issued books
- ✅ Track overdue books
- ✅ Monitor system statistics
- ✅ Manage user accounts

### 🎓 Student Features
- ✅ Browse available books
- ✅ Issue books (max 3 at a time)
- ✅ Return borrowed books
- ✅ View issue history
- ✅ Track due dates
- ✅ Earn points for timely returns

---

## 🔮 Future Enhancements

- [ ] 📧 Email notifications for due dates
- [ ] 💳 Fine calculation system
- [ ] 📊 Advanced analytics dashboard
- [ ] 🔔 Real-time notifications
- [ ] 📱 Progressive Web App (PWA)
- [ ] 🌐 Multi-language support
- [ ] 📖 Book recommendations
- [ ] ⭐ Rating and review system
- [ ] 📥 PDF export for reports
- [ ] 🎯 Wishlist feature

---

## 🤝 Contributing

Contributions are always welcome! Here's how you can help:

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. ✍️ Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. 📤 Push to the branch (`git push origin feature/AmazingFeature`)
5. 🔃 Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

<div align="center">

**Sainath**

[![GitHub](https://img.shields.io/badge/GitHub-Sainath91106-181717?style=for-the-badge&logo=github)](https://github.com/Sainath91106)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/your-profile)

</div>

---

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB team for the robust database
- Tailwind CSS for the utility-first styling
- All open-source contributors

---

<div align="center">

### ⭐ Star this repository if you found it helpful!

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&pause=1000&color=6366F1&center=true&vCenter=true&width=435&lines=Happy+Coding!+%F0%9F%9A%80;Made+with+%E2%9D%A4%EF%B8%8F+by+Sainath" alt="Typing SVG" />

</div>
