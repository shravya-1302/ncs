\# NCS Learning Platform



NCS Learning Platform is a full-stack EdTech web application built for Next Chapter Skills. It supports student registration, login, program enrollment, LMS lessons, progress tracking, project submission, and admin review.



\---



\## Features



\### Student Features



\* Register and login

\* View available programs

\* Enroll in programs

\* Access lessons

\* Mark lessons as completed

\* Track course progress

\* Submit GitHub/project links

\* View submission status and admin feedback



\### Admin Features



\* Admin dashboard access

\* View all student submissions

\* Review project links

\* Accept, reject, or mark submissions as reviewed

\* Add feedback for students



\---



\## Tech Stack



\### Frontend



\* React

\* Vite

\* Axios

\* JavaScript

\* CSS



\### Backend



\* Node.js

\* Express.js

\* MySQL

\* JWT Authentication

\* bcryptjs

\* dotenv

\* CORS



\### Database



\* MySQL

\* XAMPP phpMyAdmin for local development



\---



\## Project Structure



```txt

ncs/

├── client/                 # React frontend

├── server/                 # Node.js backend

│   ├── database/           # Database schema and seed files

│   │   ├── schema.sql

│   │   └── seed.sql

│   ├── src/

│   ├── .env.example

│   └── package.json

├── .gitignore

└── README.md

```



\---



\## Requirements



Install these before running the project:



\* Node.js

\* npm

\* Git

\* XAMPP



Check installation:



```powershell

node -v

npm -v

git --version

```



\---



\## Clone the Repository



```powershell

git clone https://github.com/shravya-1302/ncs.git

cd ncs

```



\---



\## Database Setup



Start XAMPP and run:



```txt

Apache

MySQL

```



Open phpMyAdmin:



```txt

http://localhost/phpmyadmin

```



Create a database named:



```txt

ncs

```



\---



\## Backend Setup



Open terminal from the project root:



```powershell

cd server

npm install

```



Create `.env` file:



```powershell

copy .env.example .env

```



Open `.env` and check the values:



```env

PORT=6001



DB\_HOST=localhost

DB\_PORT=3307

DB\_USER=root

DB\_PASSWORD=

DB\_NAME=ncs



JWT\_SECRET=change\_this\_secret\_key

JWT\_EXPIRES\_IN=7d



CLIENT\_URL=http://localhost:5174

```



If your MySQL runs on default port, change:



```env

DB\_PORT=3306

```



For Shravya’s local XAMPP setup, use:



```env

DB\_PORT=3307

```



\---



\## Create Tables and Insert Sample Data



After creating the `ncs` database in phpMyAdmin, run:



```powershell

npm run db:setup

```



This command runs:



```powershell

npm run db:schema

npm run db:seed

```



It creates the database tables and inserts sample programs, modules, and lessons.



Expected tables:



```txt

users

programs

course\_modules

lessons

enrollments

payments

task\_submissions

certificates

lesson\_progress

```



\---



\## Run Backend



From the `server` folder:



```powershell

npm run dev

```



Expected output:



```txt

NCS backend running on http://localhost:6001

MySQL connected successfully

```



Backend health check:



```txt

http://localhost:6001/api/health

```



\---



\## Frontend Setup



Open another terminal from project root:



```powershell

cd client

npm install

npm run dev

```



Frontend runs at:



```txt

http://localhost:5174

```



\---



\## Full Run Steps for New Team Members



Use these commands after cloning:



```powershell

git clone https://github.com/shravya-1302/ncs.git

cd ncs

```



Install backend:



```powershell

cd server

npm install

copy .env.example .env

npm run db:setup

npm run dev

```



Open another terminal and install frontend:



```powershell

cd client

npm install

npm run dev

```



Open app:



```txt

http://localhost:5174

```



\---



\## Student Flow



1\. Open the frontend.

2\. Register a new student account.

3\. Login.

4\. Go to Explore Programs.

5\. Select a program.

6\. Enroll in the program.

7\. Go to My Programs.

8\. Start learning.

9\. Complete lessons.

10\. Submit GitHub/project link.

11\. Check My Submissions for status and feedback.



\---



\## Make a User Admin



Register a normal user first.



Then open phpMyAdmin → select `ncs` database → SQL tab.



Run:



```sql

UPDATE users

SET role = 'admin'

WHERE email = 'your-email@example.com';

```



Replace `your-email@example.com` with the registered user email.



Then logout and login again.



Admin will see:



```txt

Admin Reviews

```



\---



\## API Routes



\### Auth



```txt

POST /api/auth/register

POST /api/auth/login

GET /api/auth/me

```



\### Programs



```txt

GET /api/programs

GET /api/programs/:id

POST /api/programs

```



\### Enrollments



```txt

POST /api/enrollments

GET /api/enrollments/my-programs

```



\### Lessons



```txt

GET /api/lessons/program/:programId

GET /api/lessons/:lessonId

PATCH /api/lessons/:lessonId/complete

```



\### Submissions



```txt

POST /api/submissions

GET /api/submissions/my

GET /api/submissions/lesson/:lessonId

GET /api/submissions/admin/all

PATCH /api/submissions/admin/:id/review

```



\---



\## Git Workflow for Team Members



Before starting work:



```powershell

git pull

```



After making changes:



```powershell

git status

git add .

git commit -m "Describe your change"

git push

```



Team rules:



\* Always pull before starting work.

\* Do not commit `.env`.

\* Do not commit `node\_modules`.

\* Do not push broken code.

\* Test frontend and backend before pushing.

\* Use clear commit messages.



\---



\## Updating Database Changes



Database changes do not automatically update from GitHub unless they are saved in SQL files.



When changing tables or seed data, update:



```txt

server/database/schema.sql

server/database/seed.sql

```



Then push changes:



```powershell

git add .

git commit -m "Update database schema"

git push

```



Team members should pull and run:



```powershell

cd server

npm run db:setup

```



\---



\## Common Issues



\### MySQL connection failed



Check:



\* XAMPP MySQL is running.

\* Database `ncs` exists.

\* `.env` DB port is correct.

\* `.env` DB password is correct.



For Shravya’s local setup:



```env

DB\_PORT=3307

DB\_PASSWORD=

DB\_NAME=ncs

```



\### Access token missing



Logout and login again.



\### Port already in use



Stop the running terminal:



```powershell

Ctrl + C

```



Then restart frontend/backend.



\### npm is not recognized



Install Node.js and restart terminal.



\### Git push denied



Accept the GitHub collaborator invitation first.



\---



\## Important Notes



\* Every team member must create their own `.env`.

\* Every team member must run `npm install`.

\* Every team member must create local database `ncs`.

\* `.env` is ignored and should not be pushed.

\* `node\_modules` is ignored and should not be pushed.



