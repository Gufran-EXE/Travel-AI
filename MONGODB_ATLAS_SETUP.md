# MongoDB Atlas Setup Guide for VoyageAI

## Step-by-Step Instructions

### 1. Create MongoDB Atlas Account
1. Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Sign up with your email or Google account
3. Complete the registration (it's free!)

### 2. Create a Free Cluster
1. After logging in, click **"Build a Database"** or **"Create"**
2. Choose **"M0 FREE"** tier (perfect for development)
3. Select your preferred cloud provider and region (choose one closest to you)
4. Cluster Name: You can keep the default or name it `VoyageAI`
5. Click **"Create Cluster"** (takes 3-5 minutes to provision)

### 3. Create Database User
1. While the cluster is being created, you'll see a **"Security Quickstart"**
2. Under **"How would you like to authenticate your connection?"**
   - Choose **"Username and Password"**
   - Username: `voyageai_user` (or your choice)
   - Password: Click **"Autogenerate Secure Password"** and **COPY IT!**
   - Or create your own password (remember it!)
3. Click **"Create User"**

### 4. Add Your IP Address
1. Under **"Where would you like to connect from?"**
2. Choose **"My Local Environment"**
3. Click **"Add My Current IP Address"**
   - Or for development, click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Note: For production, restrict to specific IPs
4. Click **"Finish and Close"**

### 5. Get Your Connection String
1. Click **"Go to Database"** or navigate to your cluster
2. Click the **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Driver: **Node.js**
5. Version: **5.5 or later**
6. Copy the connection string - it looks like:
   ```
   mongodb+srv://voyageai_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### 6. Update Your .env File
1. Replace `<password>` in the connection string with your actual password
2. Add the database name `voyageai` before the `?` in the URL
3. Your final connection string should look like:
   ```
   mongodb+srv://voyageai_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/voyageai?retryWrites=true&w=majority
   ```

### 7. Update server/.env
Open `server/.env` and replace the MONGODB_URI line with your Atlas connection string:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://voyageai_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/voyageai?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_change_this_in_production_use_random_string
JWT_EXPIRE=7d
```

### 8. Test the Connection
The server will automatically restart and connect to MongoDB Atlas!

Check the terminal output - you should see:
```
MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
Server running in development mode on port 5000
```

---

## Quick Visual Guide

```
MongoDB Atlas Dashboard
    ↓
[Create Database] → Choose M0 FREE
    ↓
[Security] → Create User (username + password)
    ↓
[Network Access] → Add IP Address (0.0.0.0/0 for dev)
    ↓
[Connect] → Drivers → Copy Connection String
    ↓
Replace <password> and add database name
    ↓
Paste into server/.env
    ↓
Server connects automatically! ✅
```

---

## Troubleshooting

### Error: "Authentication failed"
- Double-check your username and password
- Make sure you replaced `<password>` in the connection string
- Password should NOT have special characters like `<`, `>`, `@`, or encode them

### Error: "IP not whitelisted"
- Go to Network Access in Atlas
- Add your current IP or use 0.0.0.0/0 for development

### Error: "Connection timeout"
- Check your internet connection
- Verify the cluster is running (green status in Atlas)
- Try a different region when creating the cluster

### Need to reset password?
1. Go to Database Access in Atlas
2. Click "Edit" on your user
3. Click "Edit Password"
4. Generate new password and update .env

---

## Important Notes

⚠️ **Never commit your .env file to Git!** (Already in .gitignore)

✅ **Free Tier Limits:**
- 512 MB storage
- Shared RAM
- Perfect for development and small projects

🔒 **Security Best Practices:**
- Use strong passwords
- Restrict IP addresses in production
- Rotate credentials regularly
- Use environment variables (never hardcode)

---

## Next Steps After Setup

Once connected, you can:
1. View your data in Atlas dashboard under "Browse Collections"
2. Run the test scripts: `npm run test-auth` and `npm run test-trips`
3. Monitor database performance in Atlas
4. Set up automated backups (available in paid tiers)

---

## Need Help?

If you encounter issues:
1. Check the MongoDB Atlas documentation: https://docs.atlas.mongodb.com/
2. Verify your connection string format
3. Check the server logs for specific error messages
4. Ensure your cluster is active (not paused)

Happy coding! 🚀
