# Fix for Deployment Errors (COOP & 500 Auth Errors)

## Quick Summary of Issues

1. ❌ **Cross-Origin-Opener-Policy error** - Fixed by adding security headers
2. ❌ **500 errors on /api/auth/google** - Fixed by proper exception handling & env variables
3. ❌ **500 errors on /api/auth/login** - Fixed by better error messages

## What Changed

### Backend Code Changes
- **NEW**: `backend/src/main/java/com/placementos/backend/config/WebConfig.java` - Adds COOP/COEP headers
- **UPDATED**: `backend/src/main/java/com/placementos/backend/exception/GlobalExceptionHandler.java` - Better auth error handling
- **UPDATED**: `backend/render.yaml` - Added required environment variables

## Action Required on Render Dashboard

### ⚠️ CRITICAL: Set These Environment Variables on Render

1. Go to your Render Dashboard
2. Select **crackplacement-backend** service
3. Click **Environment** tab
4. Add these variables with **Mark as Secret**:

```
GOOGLE_CLIENT_ID = <your-google-client-id>
JWT_SECRET = <generate-random-secure-string>
GEMINI_API_KEY = <your-gemini-api-key>
OPENAI_API_KEY = <your-openai-api-key>
```

And these as normal variables:
```
CORS_ALLOWED_ORIGINS = https://crackplacement.vercel.app,https://*.vercel.app,http://localhost:5173
AI_PROVIDER = gemini
```

5. Click **Manual Deploy** to apply changes
6. Wait 2-3 minutes for deployment

## How to Get Google Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 Web Application credentials
3. Copy the Client ID (ends with `.apps.googleusercontent.com`)
4. Set as `GOOGLE_CLIENT_ID` on Render

## Testing After Deployment

```bash
# Test health endpoint
curl https://your-backend.onrender.com/health

# Test login
curl -X POST https://your-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## If Still Having Issues

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Hard refresh** (Ctrl+Shift+R)
3. **Check Render logs**: Dashboard → Service → Logs
4. **Verify variables are set**: Dashboard → Service → Environment
5. **Make sure Git is deployed**: Check if latest code is deployed

## Files That Need Deployment

These backend files need to be in your Git repo for deployment to work:
- `backend/src/main/java/com/placementos/backend/config/WebConfig.java`
- `backend/src/main/java/com/placementos/backend/exception/GlobalExceptionHandler.java`
- `backend/render.yaml` (already updated)

**Make sure to commit and push these changes to GitHub!**

```bash
git add .
git commit -m "Fix: Add COOP headers and improve auth error handling"
git push
```

Then on Render: Click **Manual Deploy** to trigger the deployment.
