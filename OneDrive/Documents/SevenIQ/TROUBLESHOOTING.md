# SevenIQ Local Server Troubleshooting Guide

## Quick Fixes

### 1. Double-click `start-server.bat` (Recommended)
- This is the easiest way to start your local server
- The batch file will automatically:
  - Check Node.js installation
  - Install missing packages
  - Create basic environment file
  - Start the server
  - Open your browser

### 2. Use PowerShell Script
- Right-click `start-server.ps1` and select "Run with PowerShell"
- This provides better error messages and handling

### 3. Manual Startup
If the scripts don't work, try these steps manually:

```bash
# 1. Install packages (if needed)
npm install

# 2. Start the server
npm run dev
```

## Common Issues & Solutions

### Issue: "Node.js is not installed"
**Solution:** Download and install Node.js from https://nodejs.org/
- Choose the LTS version
- Restart your computer after installation

### Issue: "Port 3000 is already in use"
**Solution:** 
- Close other applications that might be using port 3000
- Or use a different port: `npm run dev -- -p 3001`

### Issue: "Missing environment variables"
**Solution:**
- The startup scripts will create a basic `.env.local` file
- Edit this file to add your actual API keys and configuration
- For development, you can use placeholder values

### Issue: "npm packages not found"
**Solution:**
- Delete the `node_modules` folder
- Run `npm install` to reinstall all packages

### Issue: "Permission denied" (PowerShell)
**Solution:**
- Right-click PowerShell and select "Run as Administrator"
- Or change execution policy: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

## Environment Setup

The server needs these basic environment variables to start:

```bash
# Required for basic startup
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional (can use placeholder values for local development)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
OPENAI_API_KEY=your_key_here
```

## Still Having Issues?

1. **Check the console output** for specific error messages
2. **Try running `npm run dev` manually** to see detailed errors
3. **Check if port 3000 is free**: `netstat -an | findstr :3000`
4. **Restart your computer** to clear any port conflicts
5. **Update Node.js** to the latest LTS version

## Getting Help

If you're still experiencing issues:
1. Copy the exact error message from the console
2. Check the browser's developer console (F12) for additional errors
3. Try the manual startup method to isolate the issue
