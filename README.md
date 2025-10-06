# Kasi Konnect Backend - MySQL + Node.js + Express

This is the backend API for the Kasi Konnect platform, built with Node.js, Express, and MySQL (XAMPP).

## Prerequisites

- **XAMPP** installed and running (Apache + MySQL)
- **Node.js** (version 16 or higher)
- **npm** or **yarn**

## Setup Instructions

### 1. Start XAMPP

1. Open XAMPP Control Panel
2. Start **Apache** (optional, for phpMyAdmin)
3. Start **MySQL**

### 2. Create Database

1. Open phpMyAdmin in your browser: `http://localhost/phpmyadmin`
2. Click on "SQL" tab
3. Copy and paste the entire contents of `/backend/config/database.sql`
4. Click "Go" to execute the SQL script
5. This will create the `kasi_konnect` database and all necessary tables

### 3. Configure Environment Variables

1. In the `/backend` directory, create a `.env` file:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file with your MySQL credentials:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=kasi_konnect
   DB_PORT=3306

   PORT=5000
   NODE_ENV=development

   JWT_SECRET=your_super_secret_jwt_key_change_this
   JWT_EXPIRES_IN=7d
   ```

   **Important**: Change the `JWT_SECRET` to a secure random string in production!

### 4. Install Dependencies

Open a terminal in the `/backend` directory and run:

```bash
npm install
```

This will install all required packages:
- express
- mysql2
- bcryptjs
- jsonwebtoken
- cors
- dotenv
- express-validator
- uuid

### 5. Start the Server

Run the development server:

```bash
npm start
```

Or for auto-reload during development:

```bash
npm run dev
```

You should see:
```
=================================
   Kasi Konnect API Server
=================================
Server running on port 5000
Environment: development
Database: kasi_konnect
=================================
✓ MySQL Database connected successfully
```

### 6. Test the API

Open your browser or use Postman to test:
- Health check: `http://localhost:5000/api/health`
- Root: `http://localhost:5000/`

## API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires auth)
- `PUT /api/auth/profile` - Update user profile (requires auth)
- `PUT /api/auth/verify/:userId` - Verify user (municipal workers only)

### Business (`/api/business`)
- `POST /api/business/profile` - Create/update business profile (business owners only)
- `GET /api/business/profile` - Get own business profile
- `GET /api/business/all` - Get all businesses (public)

### Freelancer (`/api/freelancer`)
- `POST /api/freelancer/profile` - Create/update freelancer profile (freelancers only)
- `GET /api/freelancer/profile` - Get own freelancer profile
- `GET /api/freelancer/all` - Get all freelancers (public)

### Jobs (`/api/jobs`)
- `POST /api/jobs` - Create job posting (clients & municipal workers)
- `GET /api/jobs` - Get all jobs (public)
- `GET /api/jobs/:jobId` - Get specific job (public)
- `PUT /api/jobs/:jobId` - Update job (job owner only)
- `POST /api/jobs/:jobId/apply` - Apply for job
- `GET /api/jobs/:jobId/applications` - Get job applications (job owner only)
- `GET /api/jobs/user/applications` - Get user's applications

### Funding (`/api/funding`)
- `POST /api/funding/apply` - Submit funding application (business owners only)
- `GET /api/funding/my-applications` - Get user's funding applications
- `GET /api/funding/applications` - Get all funding applications (municipal workers only)
- `PUT /api/funding/:applicationId/review` - Review funding application (municipal workers only)

## Database Schema

The database includes the following tables:

- **users** - User accounts and profiles
- **businesses** - Business profiles (linked to users)
- **freelancers** - Freelancer profiles (linked to users)
- **jobs** - Job/gig postings
- **job_applications** - Applications for jobs
- **funding_applications** - Funding applications from businesses
- **messages** - Messages between users (to be implemented)
- **reviews** - Reviews and ratings (to be implemented)
- **sessions** - Session management (optional)

## User Roles

1. **business_owner** - Can create business profiles and apply for funding
2. **freelancer** - Can create freelancer profiles and apply for jobs
3. **client** - Can post jobs and hire talent
4. **municipal_worker** - Can review funding applications, verify users, and post city projects

## Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. Register or login to receive a token
2. Include the token in the `Authorization` header for protected routes:
   ```
   Authorization: Bearer <your-token-here>
   ```

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Role-based access control
- SQL injection prevention with parameterized queries
- CORS enabled for frontend integration

## Troubleshooting

### Database Connection Error

If you see `ER_BAD_DB_ERROR`:
- Make sure you created the database using the SQL script
- Check your `.env` file has the correct database name

If you see `ECONNREFUSED`:
- Make sure MySQL is running in XAMPP
- Check if MySQL is running on port 3306

### Port Already in Use

If port 5000 is already in use:
- Change the `PORT` in your `.env` file
- Update the frontend API URL in `/utils/api.ts`

### Import Error with UUID

If you get an import error:
- Make sure you're using Node.js version 16+
- The package.json specifies `"type": "module"` for ES modules

## Development Tips

1. **View Database**: Use phpMyAdmin at `http://localhost/phpmyadmin`
2. **Test API**: Use Postman or Thunder Client VS Code extension
3. **Logs**: Check the terminal for request logs and errors
4. **Database Queries**: All queries are logged to console for debugging

## Next Steps

Once the backend is running:

1. Start the React frontend (in the main project directory)
2. The frontend will automatically connect to `http://localhost:5000/api`
3. Test registration and login functionality
4. Create test users for each role
5. Test role-specific features

## Production Deployment

For production:

1. Change `NODE_ENV=production` in `.env`
2. Use a strong, random `JWT_SECRET`
3. Set up proper MySQL user with limited permissions
4. Use environment variables for all sensitive data
5. Enable HTTPS
6. Set up proper CORS origins
7. Add rate limiting
8. Use a process manager like PM2

## Support

For issues or questions about the backend:
- Check the console logs for detailed error messages
- Verify MySQL is running in XAMPP
- Ensure all dependencies are installed
- Check that the database schema is created correctly
