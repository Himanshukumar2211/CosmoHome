# 💇 Cosmo Home

A full-stack MERN web application for managing and booking premium home salon services.

Cosmo Home enables customers to discover beauty services, explore the gallery, submit reviews, apply as beauticians, contact the business, and connect directly through WhatsApp. It also provides a secure Admin Panel for managing every aspect of the business.

---

# ✨ Features

## 🌐 Public Website

- Beautiful responsive landing page
- Browse all salon services
- Dynamic testimonials and reviews
- Customer review submission
- Beautician application portal
- Contact form with purpose selection
- WhatsApp integration
- Social media integration
- Dynamic business information
- Responsive design for desktop, tablet, and mobile

---

## 🔐 Admin Panel

Secure authentication using JWT and HTTP-only cookies.

Manage:

- Services
- Gallery
- Customer Reviews
- Beautician Applications
- Contact Messages
- Website Settings

Features include:

- Create
- Read
- Update
- Delete (CRUD)
- Review approval workflow
- Dynamic homepage content
- Image uploads
- Dashboard statistics

---

# 🛠 Tech Stack

## Frontend

- React
- Vite
- React Router
- Axios
- Tailwind CSS
- Context API

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

---

## Authentication

- JWT
- HTTP-only Cookies
- Signed Cookies
- Password Hashing (bcrypt)

---

## Image Storage

- Cloudinary
- Multer

---

## Security

- Helmet
- Rate Limiting
- Request Validation
- Cookie Security
- NoSQL Injection Protection
- Environment Variable Validation

---

# 📁 Project Structure

```
CosmoHome/
│
├── client/
│   ├── public/
│   ├── src/
│   │
│   ├── assets/
│   ├── components/
│   ├── config/
│   ├── constants/
│   ├── context/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   │
│   ├── services/
│   ├── utils/
│   └── routes/
│
├── server/
│   ├── src/
│   │
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── validators/
│
└── README.md
```

---

# 🚀 Key Modules

## Public Website

- Home
- Services
- Gallery
- Reviews
- Contact
- Beautician Application

---

## Admin Panel

- Dashboard
- Services
- Gallery
- Reviews
- Beautician Applications
- Contact Messages
- Settings

---

# 📷 Image Uploads

Images are uploaded using:

- Multer
- Cloudinary

Uploaded images are securely stored in Cloudinary while metadata is maintained in MongoDB.

---

# ⭐ Reviews

Customers can submit reviews from the website.

Workflow:

Customer submits review

↓

Pending Approval

↓

Admin Reviews

↓

Approve / Reject

↓

Approved reviews appear on the homepage.

---

# 👩 Beautician Applications

Interested beauticians can apply directly through the website.

Applications include:

- Personal Information
- Contact Details
- Experience
- Skills
- Resume Upload

Applications are available inside the Admin Panel.

---

# 📬 Contact Messages

Visitors can submit enquiries including:

- General Enquiry
- Service Booking
- Partnership
- Salon Collaboration
- Franchise Enquiry
- Corporate Booking
- Complaint
- Feedback

Messages are managed through the Admin Panel.

---

# ⚙ Website Settings

Administrators can manage:

- Business Information
- Business Email
- Business Phone
- WhatsApp Number
- Facebook
- Instagram

These settings are reflected dynamically across the website.

---

# 🔒 Security Features

- JWT Authentication
- HTTP-only Cookies
- Signed Cookies
- Password Hashing
- Request Validation
- Rate Limiting
- Helmet Security Headers
- Environment Variable Validation
- Secure Cloudinary Uploads

---

# 📊 Dynamic Homepage

Homepage statistics are generated dynamically.

Includes:

- Average Rating
- Total Active Services

No hardcoded statistics are used.

---

# 📱 Responsive Design

Fully optimized for:

- Desktop
- Laptop
- Tablet
- Mobile Devices

---

# 🌍 Deployment

Recommended Deployment

Frontend

- Vercel

Backend

- Render

Database

- MongoDB Atlas

Media Storage

- Cloudinary

---

# ⚙ Environment Variables

## Server

Create a `.env` file inside the `server` directory.

Required variables:

```
NODE_ENV=
PORT=

CLIENT_URL=

MONGODB_URI=

JWT_SECRET=
JWT_EXPIRES_IN=

COOKIE_SECRET=

BCRYPT_SALT_ROUNDS=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

RATE_LIMIT_WINDOW_MS=
RATE_LIMIT_MAX_REQUESTS=

ADMIN_SEED_NAME=
ADMIN_SEED_EMAIL=
ADMIN_SEED_PASSWORD=
ADMIN_SEED_UPDATE_EXISTING=
```

---

## Client

Create a `.env` file inside the `client` directory.

```
VITE_API_BASE_URL=
VITE_SITE_URL=
VITE_APP_NAME=
```

---

# 💻 Installation

Clone the repository

```bash
git clone <repository-url>
```

Move into the project

```bash
cd CosmoHome
```

Install frontend dependencies

```bash
cd client
npm install
```

Install backend dependencies

```bash
cd ../server
npm install
```

---

# ▶ Running Locally

Backend

```bash
cd server
npm run dev
```

Frontend

```bash
cd client
npm run dev
```

---

# 📦 Production Build

Frontend

```bash
cd client
npm run build
```

Backend

```bash
cd server
npm start
```

---

# 🧪 Quality Checks

Run linting

Frontend

```bash
cd client
npm run lint
```

Backend

```bash
cd server
npm run lint
```

---

# 📈 Future Enhancements

Potential future improvements include:

- Online appointment booking
- Payment gateway integration
- Customer accounts
- Email notifications
- SMS notifications
- Push notifications
- Analytics Dashboard
- Appointment calendar
- Coupons and offers
- Multi-branch management

---

# 👨‍💻 Author

**Himanshu Kumar**

B.Tech CSE Student

Full Stack Developer

---

# 📄 License

This project is developed for Cosmo Home.

All rights reserved.