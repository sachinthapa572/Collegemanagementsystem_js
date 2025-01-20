# College Management System

## Description

The College Management System is a web application designed to manage various aspects of a college, including academics, staff, and students. It provides functionalities for handling academic terms, academic years, class levels, programs, subjects, exams, and more. The system uses Node.js, Express, and MongoDB as its main technologies.

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/sachinthapa572/Collegemanagementsystem_js.git
   ```

2. Navigate to the project directory:
   ```bash
   cd Collegemanagementsystem_js
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and add the required environment variables as specified in the `.env.sample` file.

5. Start the server:
   ```bash
   npm start
   ```

## Usage

The College Management System provides various routes for managing different functionalities. Here are some of the available routes and their functionalities:

- **Academic Terms**:
  - `POST /api/v1/academics/academic-term`: Create a new academic term
  - `GET /api/v1/academics/academic-term`: Get all academic terms
  - `GET /api/v1/academics/academic-term/:id`: Get an academic term by ID
  - `PUT /api/v1/academics/academic-term/:id`: Update an academic term by ID
  - `DELETE /api/v1/academics/academic-term/:id`: Delete an academic term by ID

- **Academic Years**:
  - `POST /api/v1/academics/academic-year`: Create a new academic year
  - `GET /api/v1/academics/academic-year`: Get all academic years
  - `GET /api/v1/academics/academic-year/:id`: Get an academic year by ID
  - `PUT /api/v1/academics/academic-year/:id`: Update an academic year by ID
  - `DELETE /api/v1/academics/academic-year/:id`: Delete an academic year by ID

- **Class Levels**:
  - `POST /api/v1/academics/class-level`: Create a new class level
  - `GET /api/v1/academics/class-level`: Get all class levels
  - `GET /api/v1/academics/class-level/:id`: Get a class level by ID
  - `PUT /api/v1/academics/class-level/:id`: Update a class level by ID
  - `DELETE /api/v1/academics/class-level/:id`: Delete a class level by ID

- **Programs**:
  - `POST /api/v1/academics/programs`: Create a new program
  - `GET /api/v1/academics/programs`: Get all programs
  - `GET /api/v1/academics/programs/:id`: Get a program by ID
  - `PUT /api/v1/academics/programs/:id`: Update a program by ID
  - `DELETE /api/v1/academics/programs/:id`: Delete a program by ID

- **Subjects**:
  - `POST /api/v1/academics/subject/:programId`: Create a new subject
  - `GET /api/v1/academics/subjects/:programId`: Get all subjects in a program
  - `GET /api/v1/academics/subject/:programId/:id`: Get a subject by ID
  - `PUT /api/v1/academics/subjects/:programId/:id`: Update a subject by ID
  - `DELETE /api/v1/academics/subjects/:programId/:id`: Delete a subject by ID

- **Exams**:
  - `POST /api/v1/exams`: Create a new exam
  - `GET /api/v1/exams`: Get all exams
  - `GET /api/v1/exams/:id`: Get an exam by ID
  - `PUT /api/v1/exams/:id`: Update an exam by ID
  - `DELETE /api/v1/exams/:id`: Delete an exam by ID

- **Staff**:
  - `POST /api/v1/admin/register`: Register a new admin
  - `POST /api/v1/admin/login`: Login as an admin
  - `POST /api/v1/admin/logout`: Logout as an admin
  - `GET /api/v1/admin`: Get all admins
  - `GET /api/v1/admin/:email`: Get an admin by email
  - `PUT /api/v1/admin/:id`: Update an admin by ID
  - `DELETE /api/v1/admin/:id`: Delete an admin by ID

- **Students**:
  - `POST /api/v1/students/register`: Register a new student
  - `POST /api/v1/students/login`: Login as a student
  - `POST /api/v1/students/logout`: Logout as a student
  - `GET /api/v1/students`: Get all students
  - `GET /api/v1/students/:id`: Get a student by ID
  - `PUT /api/v1/students/:id`: Update a student by ID
  - `DELETE /api/v1/students/:id`: Delete a student by ID

## Environment Variables

The following environment variables are required for the project:

- `PORT`: The port on which the server will run
- `NODE_ENV`: The environment in which the server is running (e.g., development, production)
- `MONGO_URI`: The connection string for the MongoDB database
- `MONGO_DB_NAME`: The name of the MongoDB database
- `ACCESS_TOKEN_SECRET`: The secret key for generating access tokens
- `ACCESS_TOKEN_EXPIRES_IN`: The expiration time for access tokens
- `REFRESH_TOKEN_SECRET`: The secret key for generating refresh tokens
- `REFRESH_TOKEN_EXPIRES_IN`: The expiration time for refresh tokens
- `CLOUD_NAME`: The name of the Cloudinary cloud
- `CLOUDINARY_NAME`: The name of the Cloudinary account
- `CLOUDINARY_API_KEY`: The API key for Cloudinary
- `CLOUDINARY_API_SECRET`: The API secret for Cloudinary

## Scripts

The following npm scripts are available:

- `npm start`: Start the server using nodemon
- `npm test`: Run tests (currently not specified)

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
