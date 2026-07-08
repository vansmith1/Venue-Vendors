# Venue Vendors 
The Venue Vendors Application allows hirers to browse venues, make bookings, upload compliance documents, manage their bookings, etc. Vendors can create and manage venues, review applicants and bookings, assess compliance documents and approve or reject bookings. 

## Team Information

### Number
40 

### Members
| Name | Student Number | Role |
|---------|---------|---------|
| Vanessa Smith    | s4091675 | Frontend and Backend Developer |
| Nicholas Egerton | s4180466 | Frontend and Backend Developer |

## Installation 

### Clone Repository
```bash
git clone <repository-url>
```
### Dependencies and Running the App
- Note: Pages take a small time to load (rendering, fetching, etc.)
- Installing Frontend Dependencies
```bash
cd frontend
npm install
```

- Starting Frontend
```bash
npm run dev
```

- Installing Backend Dependencies
```bash
cd backend
npm install
```

- Starting Backend
```bash
npm run dev
```

## Environment Variables 

### Venue Vendors Backend
Create a `.env` file in the backend directory:

```env
DB_HOST=your_database_host
DB_PORT=1433
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=your_database_name
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### Venue Vendors Frontend
Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

### Admin Backend
Create a `.env` file in the admin-backend directory:

```env
DB_HOST=your_database_host
DB_PORT=1433
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=your_database_name
PORT=3008
FRONTEND_URL=http://localhost:3000
```

### Admin Frontend
Create a `.env.local` file in the admin-frontend directory:

```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:3008/graphql
```

#### .ENV files are not committed to the repository for security reasons, fill the above fields with your credentials.

## Venue Vendors Features

### Authentication Features
- User Registration
- User Login
- Input validation (Email, Passwords, etc.)

### Hirer Features
- Browse Featured Venues
- Submit bookings on selected venues
- Upload Compliance Documents 
- Customize Profile Information
- View their Credibility Score

### Vendor Features
- Create Venues and Manage Venues
- Review Booking Applicants
- Approve/Reject/Confirm Bookings
- Leave Applicant Comments 
- Leave Ratings for Hirers
- View Hirer Compliance Documents

## Vendor Analytics Features
- Bar charts showing hirer tallies for individual venues.
- A stacked bar chart showing combined hirer activity across all venues.
- A pie chart showing the most and least active hirers.
- A line chart showing venue utilization over time with time filters.

### Compliance System
- Credibility Score Calculation
- Driver's License Upload
- Public Liability Insurance Upload
- Business Registration Certificate Upload
- ABN registration

### Admin Features


## Stack Used

### Frontend
- Next.js – React framework used for routing and page rendering.
- React – Component-based frontend library.
- TypeScript – Typed JavaScript required by the assignment.
- Chakra UI - Component library used for styling and responsiveness.
- Axios - HTTP client used for communication with the backend REST API.
- Recharts – Data visualization library used for vendor analytics charts. (DI)
- Local Storage - Basic client-side session persistence.

### Backend
- Node.js – JavaScript runtime environment.
- TypeScript – Backend development language required by the assignment.
- TypeORM – ORM used for database operations and entity management.
- Express.js – Backend framework used to build REST API endpoints.
- Microsoft SQL Server (MSSQL) – Relational database used for data storage.
- CORS – Enabled for secure frontend-backend communication.

### Additional Tools Used
- npm - Package management
- Visual Studio Code – Primary development environment.
- Git & GitHub – Version control and team collaboration.
- Postman - Debugging and Testing.

## Testing Accounts Used 
| Email | Password | Role |
|---------|---------|---------|
| nicholasTesting@gmail.com | Nikolakao27! | Vendor |
| vanessaTesting@gmail.com | Nikolakao27! | Hirer |
| julia@gmail.com | Nikolakao27! | Hirer |
| dipto@gmail.com | Nikolakao27! | Hirer |
| michael@gmail.com | Nikolakao27! | Vendor |

## Deployment
Find the links to our 4 apps deployed on render (free version)

### Venue Vendors Backend
https://venue-vendors-backend-v856.onrender.com

### Admin Backend
https://venue-vendors-admin-backend-orgl.onrender.com

### Venue Vendors Frontend
https://venue-vendors-frontend-m9vm.onrender.com

### Admin Frontend
https://venue-vendors-admin-frontend-0pwh.onrender.com 

## Group References

### Course Materials (RMIT Full Stack Development 2026)

- Assessment 1 Specification – Venue Vendors system requirements.
- Assessment 2 Specification – Database integration and analytics requirements.
- Assessment 2 Submission - Base Code and overall structures
- Assessment 3 Individual Programming Test 
- Weeks 1 - 8 Lectures and Labs
- Week 9 - Labs
- Week 10 - Labs
- Week 11 Lab - GraphQL and Form Validation
- Week 12 Lectorial - Website Deployment 
### External References
- React Documentation: https://react.dev/
- Next.js Documentation: https://nextjs.org/docs=
- Chakra UI Documentation: https://chakra-ui.com/docs
- TypeORM Documentation: https://typeorm.io/
- Express.js Documentation: https://expressjs.com/
- Microsoft SQL Server Documentation: https://learn.microsoft.com/en-us/sql/sql-server/
- GraphQL

#### Compliance Documents and Profile Page
- MDN Web Docs -  Documentation: https://developer.mozilla.org/
- MDN Web Docs – Blob API Documentation: https://developer.mozilla.org/en-US/docs/Web/API/Blob
- MDN Web Docs - Window.Open() Documentation:
 https://developer.mozilla.org/en-US/docs/Web/API/Window/open
- MDN Web Docs - File Input Element Documentation: 
https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file
- MDN Web Docs – URL.createObjectURL()
https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static

#### DI Individual References
- Recharts Documentation: https://recharts.org/=
- Recharts - Barcharts Documentation: https://recharts.github.io/en-US/api/BarChart/
- Recharts - Piecharts Documentation: https://recharts.github.io/en-US/api/PieChart/
- Recharts - Linecharts Documentation: https://recharts.github.io/en-US/api/LineChart/
- Recharts - General Components Documentation: https://recharts.github.io/en-US/api/ResponsiveContainer/

#### HD Individual References
- GraphQL Documentation: https://graphql.org/learn/execution/#field-resolvers
- Week 9 Code Archive
- Week 10 Labs
- Week 11 Labs


