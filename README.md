FullStack Store Rating System

A full-stack web application that allows users to submit ratings for stores, with role-based access (System Administrator, Store Owner, Normal User).
Built with React.js (Frontend), Node.js & Express.js (Backend), and MySQL (Database).

- Tech Stack

Frontend: React.js, TailwindCSS (Responsive UI)

Backend: Node.js, Express.js

Database: MySQL (Sequelize ORM)

Authentication: JWT (JSON Web Tokens)

Password Security: bcrypt.js

Validation: Custom rules + Express Validator

- Features by Role
- System Administrator

Add stores, normal users, and admin users.

Dashboard with insights:

Total number of users

Total number of stores

Total number of submitted ratings

Manage users with details: Name, Email, Address, Role.

Manage stores with details: Name, Email, Address, Rating.

Apply filters (Name, Email, Address, Role).

View details of all users (including ratings for Store Owners).

Logout functionality.


- Normal User

Register & login to the platform.

Update password after login.

Browse all registered stores.

Search stores by Name or Address.

Store listings show:

Store Name

Address

Overall Rating

User’s Submitted Rating

Submit a rating (1–5) for a store.

Modify submitted rating.

Logout functionality.


- Store Owner

Login to the platform.

Update password.

Dashboard functionalities:

View all users who submitted ratings for their store.

See average rating of their store.

Logout functionality.


- Form Validations

Name: 20–60 characters

Address: Max 400 characters

Password: 8–16 characters, must include one uppercase letter and one special character

Email: Standard email validation


- Additional Features

Sorting support for tables (Name, Email, etc.)

Clean database schema with best practices

Responsive & mobile-friendly UI

Follows coding best practices for both frontend & backend


- Database Schema Overview

Users Table

id, name, email, password, role, address

Stores Table

id, name, address, createdBy (adminId)

Ratings Table

id, userId, storeId, rating (1–5)


- Relations:

A user can submit multiple ratings

A store can have many ratings

Admins can create stores

- Installation & Setup
- Clone Repository
git clone https://github.com/Manasi04Tambe/store_ratings_project--frontend.git (For Frontend)
https://github.com/Manasi04Tambe/store_ratings_project--backend.git (For Backend)

Backend Setup
cd backend
npm install


Create a .env file in backend/:

PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=root
DB_NAME=store_ratings_db
DB_DIALECT=mysql
JWT_SECRET=secret_key
JWT_EXPIRES=30d
CORS_ORIGIN=http://localhost:5173


Run backend:

nodemon server.js / node server.js

Frontend Setup
cd frontend
npm install
npm run dev

- Database Setup

A MySQL Dump file (store_ratings_db.sql) is attached with the project in the email.

You can import it directly to set up the schema and sample data:

mysql -u root -p store_ratings_db < store_ratings_db.sql


- Demo Login Credentials

After importing the provided MySQL dump, you can use the following demo accounts:

- System Administrator

Email: wtlmanasi9822@gmail.com

Password: manasi@123

- Store Owner

Email: storeowner@gmail.com

Password: Store@123

- Normal User

Email: hina@gmail.com

Password: Hina@123

(You can also create new users, admin, owner via signup or login.)


- Authentication

Login generates a JWT token.

Role-based access (Admin, Store Owner, User).

Token is stored in localStorage and used for protected routes.
