<h1 align="center">TODO WEB APP 🛒</h1>

About This Course:

- 🚀 Project Setup
- 🗄️ MongoDB Integration
- 🔐 Robust Authentication System
- 🔑 JWT with Refresh/Access Tokens
- 📝 User Register & Login
- 🛒 E-Commerce Core
- 👑 Dashboard
- 📦 TODO Management, All CRUD operations.
- 🎨 Design with Tailwind
- 🔒 Security

- ⌛ And a lot more...

### Setup .env file for Frontend

```bash
VITE_API_URL=http://localhost:8000/api/v1
VITE_BASE_URL=/
```

### Setup .env file for Backend

```bash
# Server Configuration
PORT=8000

# CORS Configuration
CORS_ORIGIN=http://localhost:3000


# Environment Mode
NODE_ENV=development

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000 # 15 minutes
RATE_LIMIT_MAX=500

# JWT TOKEN
ACCESS_TOKEN_SECRET="your-secret"
ACCESS_TOKEN_EXPIRY="30m"
REFRESH_TOKEN_SECRET="your-secret"
REFRESH_TOKEN_EXPIRY="7d"


# DATABASE CONNECTION
# MongoDB
MONGODB_URI = "your-mongodb-url"


# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
CLOUDINARY_API_KEY=y"your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

```

### Run this app locally

```shell
npm run dev
```

### Start the app

```shell
npm run start
```
