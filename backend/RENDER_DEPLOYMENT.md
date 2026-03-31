# Render Deployment Guide

## Prerequisites
- Render.com account
- GitHub repository with code pushed
- MySQL database (local or cloud)

## Deployment Steps

### Option 1: Using render.yaml (Recommended)
1. Push the code to GitHub with `render.yaml` in the backend folder
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click "New +" → "Blueprint"
4. Connect your GitHub repository
5. Select the branch and confirm
6. Render will automatically create the service and database

### Option 2: Manual Deployment in Render UI
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Select "Deploy an existing image from a repository"
4. Choose your GitHub repo (backend folder)
5. Set build command: `docker build -t crackplacement-backend .`
6. Set start command: Leave blank (uses Dockerfile ENTRYPOINT)
7. Add environment variables:
   - `DB_URL`: your MySQL connection string
   - `DB_USERNAME`: your database user
   - `DB_PASSWORD`: your database password
   - `JWT_SECRET`: generate a strong secret key

### Database Setup
**Option A: Use Render PostgreSQL** (not MySQL)
- Render recommends PostgreSQL, but you can use external MySQL

**Option B: External MySQL Database**
- Use Railway, Clever Cloud, or any other MySQL provider
- Get the connection string and credentials
- Add to Render environment variables

### Important Environment Variables
```
DB_URL=jdbc:mysql://your-host:port/database
DB_USERNAME=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_strong_secret_key_here
PORT=8080
```

### Deployment URL
After deployment, Render will provide a URL like:
```
https://crackplacement-backend.onrender.com
```

### Monitoring
- View logs: Render Dashboard → Service → Logs
- Check health: Visit `https://your-service.onrender.com/actuator/health`

### Notes
- Free tier services spin down after 15 minutes of inactivity
- Set a cron job or monitoring service to keep it active (optional)
- For production, upgrade to a paid plan

## Troubleshooting
- **Build fails**: Check `pom.xml` and Java version compatibility
- **Database connection fails**: Verify credentials and connection string
- **Service crashes**: Check Logs in Render Dashboard
- **Slow startup**: First deployment takes longer due to Maven download
