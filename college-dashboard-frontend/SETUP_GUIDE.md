# Quick Setup Guide

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Backend URL

Create a `.env` file in the project root:
```env
VITE_API_BASE_URL=http://localhost:5000
```

Or update `src/constants/api.js` directly:
```javascript
export const API_BASE_URL = 'http://your-backend-url:port';
```

### 3. Start Development Server
```bash
npm run dev
```

## 📋 Backend API Requirements

Your Flask backend should expose:

### POST /signup
**Request Body:**
```json
{
  "tenantId": "string",
  "email": "string",
  "password": "string",
  "name": "string" (optional)
}
```

**Response:**
```json
{
  "user": {
    "id": "number",
    "tenantId": "string",
    "email": "string",
    "name": "string"
  }
}
```

### POST /signin
**Request Body:**
```json
{
  "tenantId": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "user": {
    "id": "number",
    "tenantId": "string",
    "email": "string",
    "name": "string"
  }
}
```

**Note:** The frontend expects the response to contain a `user` object. If your backend returns the user data directly (not nested), the code will handle it automatically.

## 🧪 Testing the Flow

1. **Start your Flask backend** on the configured port
2. **Start the frontend:** `npm run dev`
3. **Navigate to:** `http://localhost:5173` (or your Vite port)
4. **Test Signup:**
   - Go to `/signup`
   - Fill in the form
   - Submit and verify redirect to dashboard
5. **Test Signin:**
   - Go to `/signin`
   - Enter credentials
   - Submit and verify redirect to dashboard
6. **Test Route Protection:**
   - Try accessing `/dashboard` without signing in
   - Should redirect to `/signin`
7. **Test Session Persistence:**
   - Sign in
   - Refresh the page
   - Should remain on dashboard
8. **Test Logout:**
   - Click "Sign Out" button
   - Should redirect to `/signin`
   - Try accessing `/dashboard` again
   - Should redirect to `/signin`

## 🐛 Troubleshooting

### CORS Errors
If you see CORS errors, configure your Flask backend:
```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])
```

### API Connection Errors
- Verify backend is running
- Check `VITE_API_BASE_URL` matches your backend URL
- Check browser console for detailed error messages

### Authentication Not Persisting
- Check browser localStorage in DevTools
- Verify `getUserFromStorage()` is working
- Check `AuthContext` initialization

## 📁 Project Structure Overview

```
src/
├── constants/        # Configuration constants
├── context/          # Auth context (state management)
├── services/         # API service layer
├── utils/            # Utility functions
├── components/       # Reusable components
├── pages/            # Page components
└── App.jsx           # Main app with routing
```

## 🔄 Next Steps

1. **Test with your backend** - Ensure API endpoints match
2. **Customize styling** - Update Tailwind classes as needed
3. **Add more protected routes** - Follow the same pattern
4. **Upgrade to JWT** - See `AUTHENTICATION_ARCHITECTURE.md` for details

