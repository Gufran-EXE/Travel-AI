# Authentication API Documentation

## Base URL
```
http://localhost:5000/api/auth
```

## Endpoints

### 1. Register User
**POST** `/api/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- **400 Bad Request** - Missing fields or validation errors
```json
{
  "success": false,
  "message": "Please provide name, email and password"
}
```
- **400 Bad Request** - User already exists
```json
{
  "success": false,
  "message": "User already exists with this email"
}
```

---

### 2. Login User
**POST** `/api/auth/login`

Authenticate an existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- **400 Bad Request** - Missing credentials
```json
{
  "success": false,
  "message": "Please provide email and password"
}
```
- **401 Unauthorized** - Invalid credentials
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### 3. Get Current User
**GET** `/api/auth/me`

Get the currently authenticated user's information.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- **401 Unauthorized** - No token provided
```json
{
  "success": false,
  "message": "Not authorized, no token"
}
```
- **401 Unauthorized** - Invalid token
```json
{
  "success": false,
  "message": "Not authorized, token failed"
}
```

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Current User
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Security Features

- Passwords are hashed using bcrypt with salt rounds of 10
- JWT tokens expire after 7 days (configurable via JWT_EXPIRE)
- Email validation using regex pattern
- Password minimum length of 6 characters
- Unique email constraint at database level
- Protected routes require valid JWT token
- Passwords are never returned in API responses
