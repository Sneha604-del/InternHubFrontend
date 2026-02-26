# Auto-Login Test Guide for InternHub Frontend

## ✅ What's Already Done:
1. Backend generates JWT tokens with 30-day expiration
2. Frontend stores tokens in localStorage (persists after closing browser)
3. Frontend validates token on app load
4. Auth interceptor sends token with every request

## 🧪 How to Test:

### Step 1: Start Backend
```bash
cd "c:\Users\sanch\Desktop\final year\InternHubBackend"
mvnw spring-boot:run
```

### Step 2: Start Frontend
```bash
cd "c:\Users\sanch\Desktop\final year\InternHubFrontend"
npm start
```

### Step 3: Test Auto-Login
1. Open http://localhost:4200 in browser
2. Login with your credentials
3. **Close the browser completely**
4. **Reopen browser** and go to http://localhost:4200
5. ✅ You should be **automatically logged in** - no login page!

### Step 4: Verify Token in Browser Console
Press F12 and run:
```javascript
localStorage.getItem('token')
```
You should see your JWT token.

## 🔍 How It Works:

1. **On Login**: Token saved to localStorage (lasts 30 days)
2. **On App Load**: 
   - Checks if token exists in localStorage
   - Validates token with backend
   - If valid → Auto-login
   - If expired → Redirect to login

3. **Token Expiration**: After 30 days, user must login again

## 🐛 Troubleshooting:

If auto-login doesn't work:
1. Check browser console for errors
2. Verify backend is running on port 8083
3. Check if token exists: `localStorage.getItem('token')`
4. Clear localStorage and try fresh login: `localStorage.clear()`
