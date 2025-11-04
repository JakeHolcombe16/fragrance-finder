# Authentication Setup

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
```

### Notes:
- `MONGODB_URI`: Your MongoDB connection string (should already exist)
- `JWT_SECRET`: A strong secret key for signing JWT tokens. Use a long, random string in production.
- `JWT_EXPIRES_IN`: Token expiration time (default: 7d). Options: `1h`, `7d`, `30d`, etc.

## Creating an Admin User

To create an admin user, you can either:

1. **Manually update the database**: Connect to your MongoDB and update a user's role:
   ```javascript
   db.users.updateOne(
     { email: "your-email@example.com" },
     { $set: { role: "admin" } }
   )
   ```

2. **Use MongoDB Compass or similar tool**: Update the user document directly in the database.

3. **Create a script** (future enhancement): We can create a script to set the first user as admin.

## Testing the Authentication

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/register` to create a new account
3. Navigate to `http://localhost:3000/login` to login
4. Check the header for the user menu when logged in

## API Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/logout` - Logout current user
- `GET /api/auth/me` - Get current user information

## Security Notes

- Passwords are hashed using bcryptjs (10 rounds)
- JWT tokens are stored in HTTP-only cookies
- Tokens expire after 7 days (configurable via JWT_EXPIRES_IN)
- SameSite=Strict cookie policy for CSRF protection

