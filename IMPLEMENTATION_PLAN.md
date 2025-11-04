# Implementation Plan: User System for Fragrance Finder

## Current Codebase Analysis

### Existing Structure:
- **Framework**: Next.js 15.3.3 (Pages Router)
- **Database**: MongoDB with Mongoose
- **Models**: Fragrance model exists at `src/lib/models/Fragrance.js`
- **API Routes**: Located in `src/pages/api/`
- **Components**: Layout.jsx, FragranceCard.jsx
- **Contexts**: Empty `src/contexts/` folder exists
- **Auth**: No authentication system currently implemented

### Database Connection:
- Connection setup at `src/lib/db.js`
- Database name: `fragrancefinder`
- Uses connection caching for performance

---

## Phase 1: User System Implementation

### Step 1: Install Required Dependencies
- **bcryptjs**: For password hashing
- **jsonwebtoken**: For JWT token generation (optional, alternative to sessions)
- **next-auth**: Alternative option (more comprehensive)
- **js-cookie**: For cookie management (if using JWT)

**Decision Point**: We'll use a simple session-based approach with JWT tokens stored in HTTP-only cookies for security, or NextAuth.js for a more complete solution.

**Recommended**: Start with bcryptjs + JWT + cookies for simplicity, can upgrade to NextAuth later if needed.

### Step 2: Create User Model
**File**: `src/lib/models/User.js`

**Schema Fields**:
- `email`: String (required, unique, lowercase)
- `password`: String (required, hashed)
- `role`: String (enum: ['user', 'admin'], default: 'user')
- `name`: String (optional)
- `createdAt`: Date (default: Date.now)
- `updatedAt`: Date (default: Date.now)

**Indexes**:
- Unique index on email
- Index on role for faster queries

### Step 3: Create Authentication API Routes

#### 3.1 Register Route
**File**: `src/pages/api/auth/register.js`
- POST endpoint
- Validate email format
- Check if user already exists
- Hash password with bcryptjs
- Create user with role 'user' (default)
- Return user object (without password)

#### 3.2 Login Route
**File**: `src/pages/api/auth/login.js`
- POST endpoint
- Validate email and password
- Find user by email
- Compare password with bcryptjs
- Generate JWT token (or session)
- Set HTTP-only cookie with token
- Return user object and token

#### 3.3 Logout Route
**File**: `src/pages/api/auth/logout.js`
- POST endpoint
- Clear authentication cookie
- Return success message

#### 3.4 Get Current User Route
**File**: `src/pages/api/auth/me.js`
- GET endpoint
- Verify JWT token from cookie
- Return current user object (without password)

### Step 4: Create Authentication Utility Functions
**File**: `src/lib/auth.js`

**Functions**:
- `hashPassword(password)`: Hash password using bcryptjs
- `comparePassword(password, hash)`: Compare password with hash
- `generateToken(userId, role)`: Generate JWT token
- `verifyToken(token)`: Verify and decode JWT token
- `requireAuth(handler)`: Middleware to protect API routes
- `requireAdmin(handler)`: Middleware to protect admin-only routes

### Step 5: Create Authentication Context
**File**: `src/contexts/AuthContext.js`

**State Management**:
- User state (current user object)
- Loading state
- Authentication status

**Methods**:
- `login(email, password)`: Call login API
- `register(email, password, name)`: Call register API
- `logout()`: Call logout API and clear state
- `checkAuth()`: Verify current session on mount

**Provider**: Wrap app in `_app.js` to provide auth context globally

### Step 6: Create Authentication UI Components

#### 6.1 Login Component
**File**: `src/components/auth/LoginForm.jsx`
- Email input
- Password input
- Submit button
- Error message display
- Link to register page

#### 6.2 Register Component
**File**: `src/components/auth/RegisterForm.jsx`
- Name input (optional)
- Email input
- Password input
- Confirm password input
- Submit button
- Error message display
- Link to login page

#### 6.3 User Menu Component
**File**: `src/components/auth/UserMenu.jsx`
- Display user name/email when logged in
- Show logout button
- Show admin indicator if role is admin
- Show login/register links when not logged in

### Step 7: Update Layout Component
**File**: `src/components/Layout.jsx`
- Import and use AuthContext
- Add UserMenu component to header
- Show user-specific navigation items

### Step 8: Create Auth Pages

#### 8.1 Login Page
**File**: `src/pages/login.js`
- Render LoginForm component
- Redirect to home if already logged in

#### 8.2 Register Page
**File**: `src/pages/register.js`
- Render RegisterForm component
- Redirect to home if already logged in

### Step 9: Update _app.js
**File**: `src/pages/_app.js`
- Import AuthContext provider
- Wrap Component with AuthProvider
- Initialize auth check on app load

### Step 10: Environment Variables
**File**: `.env.local` (add to .gitignore if not already)
- `JWT_SECRET`: Secret key for JWT token signing
- `MONGODB_URI`: Already exists

---

## Implementation Order

1. ✅ Install dependencies (bcryptjs, jsonwebtoken, js-cookie)
2. ✅ Create User model (`src/lib/models/User.js`)
3. ✅ Create auth utilities (`src/lib/auth.js`)
4. ✅ Create auth API routes (register, login, logout, me)
5. ✅ Create AuthContext (`src/contexts/AuthContext.js`)
6. ✅ Update `_app.js` to include AuthProvider
7. ✅ Create auth UI components (LoginForm, RegisterForm, UserMenu)
8. ✅ Create auth pages (login.js, register.js)
9. ✅ Update Layout component with UserMenu
10. ✅ Test authentication flow

---

## Future Phases (Not Yet Implemented)

### Phase 2: Wishlist System
- Create Wishlist model (references User and Fragrance)
- Create wishlist API routes (add, remove, get)
- Add wishlist UI to FragranceCard
- Create wishlist page to view user's wishlist

### Phase 3: Admin Controls
- Create admin dashboard page
- Add delete fragrance functionality
- Protect admin routes with `requireAdmin` middleware
- Add admin UI indicators

---

## Security Considerations

1. **Password Hashing**: Always use bcryptjs (minimum 10 rounds)
2. **JWT Tokens**: Store in HTTP-only cookies (not localStorage)
3. **Token Expiration**: Set reasonable expiration (e.g., 7 days)
4. **Input Validation**: Validate email format, password strength
5. **Rate Limiting**: Consider adding rate limiting to login/register endpoints
6. **CSRF Protection**: Next.js has built-in CSRF protection

---

## Testing Checklist

- [ ] User can register with email and password
- [ ] User cannot register with duplicate email
- [ ] User can login with correct credentials
- [ ] User cannot login with incorrect credentials
- [ ] User can logout
- [ ] User session persists across page refreshes
- [ ] User session expires after token expiration
- [ ] Protected routes redirect to login if not authenticated
- [ ] Admin routes reject non-admin users
- [ ] Password is never sent back to client

---

## Notes

- Start with basic user/admin roles. Can extend later if needed.
- Keep authentication simple initially. Can migrate to NextAuth.js later if requirements grow.
- Admin role will be set manually in database initially (or via special admin registration code).
- All user-related data will be stored in MongoDB alongside existing Fragrance data.

