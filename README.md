# 🛍️ Snitch Clone

## 📖 About the Project

Snitch Clone is a full-stack fashion e-commerce platform inspired by Snitch, built using the MERN stack. The project focuses on building a scalable and production-ready application by implementing secure authentication, role-based access control, and modern frontend and backend development practices. It aims to provide a seamless shopping experience while exploring the architecture of real-world e-commerce platforms.

---

## ❓ Why I Built This?

I built this project to strengthen my understanding of full-stack development concepts by working on a real-world application from scratch. Through this project, I am learning how to design secure authentication flows, build scalable REST APIs, manage application state efficiently, model databases, and structure large-scale MERN applications.

This project is still under active development, and I plan to implement modern e-commerce features such as product management, shopping cart functionality, seller dashboards, payment integration, and order management in future updates.

---

## 🛠️ Tech Stack

### 🎨 Frontend

- React.js
- Vite
- Tailwind CSS
- Redux Toolkit
- React Router
- Axios
- Lucide React

### ⚙️ Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Passport.js (Google OAuth)
- Express Validator
- Cookie Parser
- Bcrypt.js

---

## ✨ Current Features

### 🔐 Authentication

- User Registration
- User Login
- User Logout
- JWT-based Authentication using HTTP-only Cookies
- Google OAuth Authentication
- Role-based Registration (Buyer / Seller)
- Frontend and Backend Form Validation
- Secure Password Hashing using Bcrypt
- Server-side Error Handling
- Loading States for Authentication Requests

### 🚀 User Experience

- Fully Responsive Login and Registration Pages
- User-friendly Error Messages
- Automatic Error Message Dismissal
- Loading Animations during Authentication Requests
- Modern and Clean Authentication UI

---

## 🔮 Upcoming Features

- Product Management System
- Seller Dashboard
- Shopping Cart Functionality
- Product Variants Management
- Wishlist Functionality
- Product Search and Filtering
- Order Management System
- Payment Gateway Integration
- Reviews and Ratings
- Forgot Password and Reset Password
- Email Verification
- Protected Routes
- Deployment and Performance Optimizations

---

## 📁 Project Structure

```
snitch-clone/
├─ Backend/
│  ├─ package.json
│  ├─ package-lock.json
│  ├─ server.js
│  └─ src/
│     ├─ app.js
│     ├─ config/
│     │  ├─ config.js
│     │  └─ db.js
│     ├─ controllers/
│     │  ├─ auth.controllers.js
│     │  └─ product.controllers.js
│     ├─ middlewares/
│     │  ├─ auth.middlewares.js
│     │  └─ upload.middleware.js
│     ├─ models/
│     │  ├─ price.schema.js
│     │  ├─ product.model.js
│     │  └─ user.model.js
│     ├─ routes/
│     │  ├─ auth.routes.js
│     │  └─ product.routes.js
│     ├─ services/
│     │  └─ storage.service.js
│     └─ validators/
│        ├─ auth.validators.js
│        └─ product.validator.js
│
├─ Frontend/
│  ├─ package.json
│  ├─ package-lock.json
│  ├─ vite.config.js
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ public/
│  │  └─ snitch-favicon.ico
│  └─ src/
│     ├─ main.jsx
│     ├─ index.css
│     ├─ assets/
│     ├─ app/
│     │  ├─ App.jsx
│     │  ├─ app.routes.jsx
│     │  ├─ app.store.js
│     │  └─ App.css
│     └─ features/
│        ├─ auth/
│        │  ├─ components/
│        │  │  ├─ ContinueWithGoogle.jsx
│        │  │  ├─ ImageSection.jsx
│        │  │  ├─ ProtectedRoute.jsx
│        │  │  ├─ PublicRoute.jsx
│        │  │  └─ TitleLogo.jsx
│        │  ├─ hook/
│        │  │  └─ useAuth.js
│        │  ├─ pages/
│        │  │  ├─ Login.jsx
│        │  │  └─ Register.jsx
│        │  ├─ service/
│        │  │  └─ auth.api.js
│        │  └─ state/
│        │     └─ auth.slice.js
│        └─ product/
│           ├─ components/
│           │  ├─ Navbar.jsx
│           │  ├─ ProductForm.jsx
│           │  ├─ ProductPreviewCard.jsx
│           │  └─ SideNavBar.jsx
│           ├─ hook/
│           │  └─ useProduct.js
│           ├─ pages/
│           │  ├─ CreateProduct.jsx
│           │  ├─ Dashboard.jsx
│           │  ├─ Home.jsx
│           │  ├─ ProductDetails.jsx
│           │  ├─ Profile.jsx
│           │  ├─ SellerCustomers.jsx
│           │  ├─ SellerOrders.jsx
│           │  ├─ SellerProductDetails.jsx
│           │  ├─ SellerProducts.jsx
│           │  ├─ SellerSettings.jsx
│           │  └─ Wishlist.jsx
│           ├─ service/
│           │  └─ product.api.js
│           └─ state/
│              └─ product.slice.js
│
└─ README.md
```

---

## 📸 Preview

### 🔐 Login and Registration Pages
<table>
  <tr>
    <td width="50%">
      <img
        src="./Frontend/public/preview/login-page.png"
        alt="Login Page"
        width="100%"
        height="200"
      />
      <p align="center">Login Page</p>
    </td>
    <td width="50%">
      <img
        src="./Frontend/public/preview/register-page.png"
        alt="Registration Page"
        width="100%"
        height="200"
      />
      <p align="center">Registration Page</p>
    </td>
  </tr>
</table>

### 🏠 Home Page
<table>
  <tr>
    <td width="50%">
      <img
        src="./Frontend/public/preview/home-page.png"
        alt="Home Page"
        width="100%"
        height="200"
      />
    </td>
    <td width="50%">
      <img
        src="./Frontend/public/preview/home-page2.png"
        alt="Home Page 2"
        width="100%"
        height="200"
      />
    </td>
  </tr>

  <tr>
    <td width="50%">
      <img
        src="./Frontend/public/preview/home-page3.png"
        alt="Home Page 3"
        width="100%"
        height="200"
      />
    </td>
    <td width="50%">
      <img
        src="./Frontend/public/preview/home-page4.png"
        alt="Home Page 4"
        width="100%"
        height="200"
      />
    </td>
  </tr>
</table>

### 🛍️ Product Details Pages
<table>
  <tr>
    <td width="50%">
      <img
        src="./Frontend/public/preview/product-details-page.png"
        alt="Product Details Page"
        width="100%"
        height="200"
      />
      <p align="center">Product Details</p>
    </td>
    <td width="50%">
      <img
        src="./Frontend/public/preview/product-variants.png"
        alt="Product Variants"
        width="100%"
        height="200"
      />
      <p align="center">Product Details with different Variants</p>
    </td>
  </tr>
</table>

### 🛒 Cart Page
<table>
  <tr>
    <td width="50%">
      <img
        src="./Frontend/public/preview/cart-page.png"
        alt="Cart Page"
        width="100%"
        height="200"
      />
    </td>
    <td width="50%">
      <img
        src="./Frontend/public/preview/cart-page2.png"
        alt="Cart Page 2"
        width="100%"
        height="200"
      />
    </td>
  </tr>
</table>

### 💳 Checkout Page
<table>
  <tr>
    <td width="50%">
      <img
        src="./Frontend/public/preview/razorpay-payment.png"
        alt="Razorpay Payment"
        width="100%"
        height="200"
      />
    </td>
    <td width="50%">
      <img
        src="./Frontend/public/preview/razorpay-payment2.png"
        alt="Razorpay Payment 2"
        width="100%"
        height="200"
      />
    </td>
  </tr>

  <tr>
    <td width="50%">
      <img
        src="./Frontend/public/preview/razorpay-payment3.png"
        alt="Razorpay Payment 3"
        width="100%"
        height="200"
      />
    </td>
    <td width="50%">
    </td>
  </tr>
</table>

### ✅ Order Confirmation
<table>
  <tr>
    <td width="50%">
      <img
        src="./Frontend/public/preview/razorpay-payment4.png"
        alt="Razorpay Payment Confirmation"
        width="100%"
        height="200"
      />
      <p align="center">Payment Confirmation</p>
    </td>
    <td width="50%">
      <img
        src="./Frontend/public/preview/order-confirmation-page.png"
        alt="Order Confirmation"
        width="100%"
        height="200"
      />
      <p align="center">Order Confirmation</p>
    </td>
  </tr>
</table>

### 🏪 Seller Account
<table>
  <tr>
    <td width="50%">
      <img
        src="./Frontend/public/preview/seller-dashboard-page.png"
        alt="Seller Dashboard"
        width="100%"
        height="200"
      />
      <p align="center">Dashboard Page</p>
    </td>
    <td width="50%">
      <img
        src="./Frontend/public/preview/seller-create-product-page.png"
        alt="Create Product"
        width="100%"
        height="200"
      />
      <p align="center">Create Product Page</p>
    </td>
  </tr>

  <tr>
    <td width="50%">
      <img
        src="./Frontend/public/preview/seller-listed-products-page.png"
        alt="Seller Listed Products"
        width="100%"
        height="200"
      />
      <p align="center">Listed Products Page</p>
    </td>
    <td width="50%">
      <img
        src="./Frontend/public/preview/seller-product-details-page.png"
        alt="Seller Product Details"
        width="100%"
        height="200"
      />
      <p align="center">Seller Product Details with Variants</p>
    </td>
  </tr>

  <tr>
    <td width="50%">
      <img
        src="./Frontend/public/preview/seller-product-details-page2.png"
        alt="Multiple Product Variants"
        width="100%"
        height="200"
      />
      <p align="center">Listed Products with Multiple Variants</p>
    </td>
    <td width="50%">
      <img
        src="./Frontend/public/preview/add-product-variants-byseller.png"
        alt="Add Product Variant"
        width="100%"
        height="200"
      />
      <p align="center">Add Product Variant</p>
    </td>
  </tr>
</table>

### 👤 User Profile
<table>
  <tr>
    <td width="50%">
      <img
        src="./Frontend/public/preview/user-profile-page.png"
        alt="User Profile"
        width="100%"
        height="200"
      />
      <p align="center">User Profile Page</p>
    </td>
    <td width="50%">
      <img
        src="./Frontend/public/preview/user-profile-details.png"
        alt="User Profile Details"
        width="100%"
        height="200"
      />
      <p align="center">User Details</p>
    </td>
  </tr>
</table>

### 🎁 Wishlist Page
<table>
  <tr>
    <td width="50%">
      <img
        src="./Frontend/public/preview/wishlist-page.png"
        alt="Wishlist Page"
        width="100%"
        height="200"
      />
      <p align="center">Wishlist Page</p>
    </td>
    <td width="50%">
    </td>
  </tr>
</table>

---

## 🚀 Get Started

### 📋 Prerequisites

- Node.js 18 or later
- npm
- MongoDB Atlas or a local MongoDB instance
- Cloudinary account (for image uploads)
- Google Cloud Project (for Google OAuth authentication)

---

### 📥 Clone the Repository

```bash
git clone <your-repo-url>
cd snitch-clone
```

---

### 🔧 Backend Setup

1. Navigate to the Backend folder

```bash
cd Backend
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the `Backend` directory

```
PORT=7000
FRONTEND_URL=http://localhost:5174
BACKEND_URL=http://localhost:7000
MONGODB_URI=your_mongo_uri_here
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key_here
```

4. Start the Backend Server

```bash
npm run dev
# or
npm start
```

### 🖥️ Frontend Setup

1. Navigate to the Frontend folder

```bash
cd ../Frontend
```

2. Install dependencies

```bash
npm install
```

3. Start the Development Server

```bash
npm run dev
```

4. Open the app at `http://localhost:5174`

### 📦 Build for Production

```bash
cd Frontend
npm run build
# serve the static files using any static server or deploy to a static host
```
The production build will be generated inside the `dist/` folder.

---

## 👨‍💻 Author

**Rahul Kumar**

- GitHub: https://github.com/rahul4work
- LinkedIn: https://linkedin.com/in/kumar-rahul4work/

---

## 📄 License

This project is shared for learning and portfolio purposes only.

Please do not redistribute or use it commercially without permission