# Crack Placement - Deployment Troubleshooting Guide

## Issues Fixed

### 1. **Cross-Origin-Opener-Policy (COOP) Error**
**Error**: `Cross-Origin-Opener-Policy policy would block the window.postMessage call`

**Root Cause**: Backend wasn't sending the required COOP header for Google OAuth popups to work correctly.

**Solution**: Added `WebConfig.java` which sets proper security headers:
- `Cross-Origin-Opener-Policy: same-origin-allow-popups` - Allows Google OAuth popups
- `Cross-Origin-Embedder-Policy: require-corp` - COEP policy compliance

### 2. **500 Error on `/api/auth/google` and `/api/auth/login`**
**Root Cause**: 
- `GOOGLE_CLIENT_ID` environment variable not set on Render
- Missing proper exception handlers for auth errors

**Solution**:
- Enhanced `GlobalExceptionHandler.java` with specific handlers for auth errors
- Updated `render.yaml` to include all required environment variables

---

## Setup Instructions for Render Deployment

### Step 1: Get Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Type: Web Application
   - Authorized redirect URIs:
     - `https://accounts.google.com/gsi/client` (for Google Sign-In Library)
     - `https://your-deployed-backend-url/api/auth/google`
5. Copy the **Client ID** (looks like: `12345678901234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com`)

### Step 2: Set Environment Variables on Render

1. **Go to your Render Dashboard**
2. **Select your backend service** (crackplacement-backend)
3. **Click on "Environment"** tab
4. **Add/Update these variables**:

| Variable | Value | Type |
|----------|-------|------|
| `GOOGLE_CLIENT_ID` | Your Google Client ID from Step 1 | Secret |
| `JWT_SECRET` | Generate a random secure string (min 32 chars) | Secret |
| `GEMINI_API_KEY` | Your Google Gemini API key (from Google AI Studio) | Secret |
| `OPENAI_API_KEY` | Your OpenAI API key (if using OpenAI) | Secret |
| `CORS_ALLOWED_ORIGINS` | `https://crackplacement.vercel.app,https://*.vercel.app,http://localhost:5173` | Standard |
| `AI_PROVIDER` | `gemini` (or `openai`) | Standard |

**Steps to add variables**:
1. Click **"Add Environment Variable"**
2. Enter key name and value
3. Toggle **"Secret"** if it contains sensitive data
4. Click **"Save"**
5. **Redeploy** the service (click **"Manual Deploy"** or push to GitHub)

### Step 3: Update Frontend Configuration

Ensure your frontend `.env` or environment variables include:

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
VITE_API_URL=https://your-backend-url.onrender.com
```

If using Vercel for frontend:
1. Go to Vercel Project Settings
2. Click **"Environment Variables"**
3. Add the same GOOGLE_CLIENT_ID

### Step 4: Verify Deployment

After redeploying:

1. **Check backend health**: 
   ```
   https://your-backend-url.onrender.com/health
   ```
   Should return `200 OK`

2. **Test login endpoint**:
   ```bash
   curl -X POST https://your-backend-url.onrender.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```

3. **Check browser console**: 
   - COOP errors should be gone
   - No more 500 errors on Google auth
   - Should see "Successfully signed in" or appropriate error messages

---

## Common Issues and Solutions

### Issue: "Google credential audience mismatch"
**Cause**: `GOOGLE_CLIENT_ID` doesn't match the frontend client ID
**Fix**: Ensure both frontend and backend use the exact same Google Client ID

### Issue: "Google sign-in is not configured on the server"
**Cause**: `GOOGLE_CLIENT_ID` environment variable is empty
**Fix**: 
1. Set `GOOGLE_CLIENT_ID` in Render environment variables
2. Click **"Manual Deploy"** to apply changes
3. Wait 2-3 minutes for deployment

### Issue: Still seeing COOP errors after deployment
**Cause**: Old code cached in browser
**Fix**:
1. Hard refresh browser (Ctrl+Shift+R / Cmd+Shift+R)
2. Clear browser cache and cookies for the domain
3. Try in incognito/private window

### Issue: 500 error on `/api/auth/login`
**Cause**: JWT_SECRET not set or database connection issue
**Fix**:
1. Ensure `JWT_SECRET` is set in environment
2. Check database connection: `DB_URL` should be properly configured
3. Check backend logs in Render dashboard

---

## Backend Changes Made

### Files Modified:
1. **`config/WebConfig.java`** (NEW)
   - Adds COOP/COEP security headers
   - Interceptor to modify response headers

2. **`exception/GlobalExceptionHandler.java`** (UPDATED)
   - Better error messages for auth failures
   - Specific handlers for BadCredentialsException
   - Proper HTTP status codes

3. **`render.yaml`** (UPDATED)
   - Added all required environment variables
   - Configured CORS origins
   - Added AI provider configuration

---

## Testing Checklist

- [ ] Backend deployed successfully
- [ ] All environment variables set on Render
- [ ] Health check endpoint returns 200
- [ ] No COOP errors in browser console
- [ ] Can login with email/password without 500 error
- [ ] Google Sign-In button renders
- [ ] Google Sign-In works (no 500 error)
- [ ] JWT token is returned after successful auth
- [ ] Can access protected routes after login

---

## Support

If issues persist:

1. Check Render service logs: Dashboard → Service → Logs
2. Check frontend console errors: Browser DevTools → Console
3. Check network requests: Browser DevTools → Network
4. Verify all environment variables are set correctly
5. Try manual deploy if auto-deploy doesn't pick up changes

