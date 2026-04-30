# Render Deployment Debugging Guide

## App Startup Failure - Step-by-Step Fix

Your Render app is failing to start. Follow these steps to diagnose and fix:

---

## Step 1: Check All Environment Variables on Render Dashboard

1. Go to **Render Dashboard** → **crackplacement-backend**
2. Click **Environment** tab
3. **Verify ALL these variables are set:**

### 🔴 CRITICAL - Must Have These (Mark as Secret):
```
GOOGLE_CLIENT_ID = [Your Google OAuth Client ID]
JWT_SECRET = [Min 32 character random string - e.g., aB3$dE9@kL2#mN5&pQ7!rS4%tU6^vW8*]
```

### 🟡 IMPORTANT - Database Connection (From Database Link):
```
DB_URL = [Auto-filled from database]
DB_USERNAME = [Auto-filled from database]
DB_PASSWORD = [Auto-filled from database]
```

### 🟢 OPTIONAL - For Features:
```
GEMINI_API_KEY = [Your Gemini API key] (Optional - for AI features)
OPENAI_API_KEY = [Your OpenAI API key] (Optional - for AI features)
```

### 🔵 Configuration:
```
CORS_ALLOWED_ORIGINS = https://crackplacement.vercel.app,https://*.vercel.app,http://localhost:5173
AI_PROVIDER = gemini
```

---

## Step 2: Link Database (If Not Already Done)

1. In Render, go to **crackplacement-backend** → **Environment**
2. Look for "Database" section
3. Click **"Link Database"** 
4. Select **crackplacement-db**
5. Verify `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` are now auto-filled
6. **DO NOT manually type these** - they auto-populate

---

## Step 3: Manual Deploy After Changes

1. **Any time you change environment variables, you MUST manually deploy**
2. Go to **crackplacement-backend** → **Deployments**
3. Click **"Manual Deploy"** button
4. Wait for deployment to complete (2-3 minutes)

---

## Step 4: Check the Logs

While deployment is running:

1. Click **"Logs"** tab in the service details
2. Watch the logs in real-time
3. Look for any error messages like:
   - `UnsatisfiedDependencyException` - Missing bean
   - `SQLException` - Database connection issue
   - `NullPointerException` - Missing environment variable
   - `Cannot invoke HttpClient.send` - Connection issue

---

## Step 5: Common Error Messages & Solutions

### ❌ Error: `NullPointerException` in AuthService
**Cause**: `GOOGLE_CLIENT_ID` is null/missing
**Fix**:
1. Set `GOOGLE_CLIENT_ID` environment variable
2. Manual deploy

### ❌ Error: `SQLException` or `unable to connect to database`
**Cause**: Database not linked or `DB_URL` is wrong
**Fix**:
1. Link database (Step 2 above)
2. Ensure `DB_URL` starts with `mysql://`
3. Manual deploy

### ❌ Error: `Cannot find bean of type 'WebConfig'`
**Cause**: Spring Boot can't initialize our config
**Fix**: This is rare, but if it happens:
1. Delete the `WebConfig.java` file
2. Push changes: `git push`
3. Manual deploy on Render

### ❌ Error: `HibernateException` or `Could not initialize proxy`
**Cause**: Usually database connection issue
**Fix**:
1. Verify database is running on Render
2. Check `DB_URL` is correctly set
3. Manual deploy

---

## Step 6: Test the Deployment

Once logs show "Started BackendApplication", test:

```bash
# Test health endpoint
curl https://your-backend.onrender.com/health

# Should return:
# OK or {"status":"UP"}

# Test login endpoint
curl -X POST https://your-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Should return error like:
# {"error":"Unauthorized","message":"Invalid email or password","status":401}
```

If these work, your backend is running! ✅

---

## Step 7: If Still Failing

Try these:

### Option 1: Simplify WebConfig (Remove Our Custom Filter)
If you keep getting bean errors:

1. **Temporarily remove WebConfig.java** or rename it
2. Push to GitHub: `git add . && git commit -m "temp: disable WebConfig" && git push`
3. Manual deploy
4. If it starts, the issue is our WebConfig

### Option 2: Check Git Synchronization
1. Go to **Settings** → **Git Branch**
2. Verify it's set to `main` or `master` (whichever you use)
3. Force redeploy: **Manual Deploy**

### Option 3: Clean Redeploy
1. Go to **Settings** → **Advanced**
2. Click **"Clear Build Cache"**
3. **Manual Deploy** again

### Option 4: Check Render Status
1. Go to https://status.render.com/
2. See if there are any outages
3. If yes, wait and try again

---

## Environment Variable Template

Copy-paste this for reference. Fill in your values:

```
GOOGLE_CLIENT_ID = 
JWT_SECRET = 
DB_URL = 
DB_USERNAME = 
DB_PASSWORD = 
GEMINI_API_KEY = 
OPENAI_API_KEY = 
CORS_ALLOWED_ORIGINS = https://crackplacement.vercel.app,https://*.vercel.app,http://localhost:5173
AI_PROVIDER = gemini
```

---

## Getting Environment Values

### For GOOGLE_CLIENT_ID:
1. Google Cloud Console → OAuth 2.0 credentials
2. Copy "Client ID" field

### For JWT_SECRET:
Generate a random string (use any of these methods):
```bash
# Linux/Mac
openssl rand -base64 32

# Online tool
# https://www.random.org/bytes/
```

### For Database Variables:
Auto-filled by Render when you link the database. **Don't change these manually.**

---

## Still Stuck?

1. **Screenshot the error logs** from Render
2. **Share the environment variables** (hide secret values)
3. **Check Git commits** - Are your changes pushed?
4. **Try fresh clone**: Delete local repo, clone again, ensure `.gitignore` isn't excluding necessary files

---

## Key Takeaways

✅ **Do this:**
- Set all environment variables
- Link database in Render UI
- **Manual Deploy after any variable changes**
- Check logs in real-time
- Test health endpoint

❌ **Don't do this:**
- Manually type DB_URL (let Render auto-fill)
- Auto-deploy if you changed variables (need manual deploy)
- Change render.yaml without understanding it
- Assume changes automatically deploy
