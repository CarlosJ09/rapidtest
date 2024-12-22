# Rapidtest

## Project Description

This is an online platform designed for creating and taking tests on various subjects such as programming, literature, math, and history. It allows instructors to create and manage tests, while students can take these tests, track their performance, and save them for later attempts.

The project consists of a Django backend and a React frontend, and it includes features like user authentication, test creation and management, test-taking and scoring.

## Distinctiveness and Complexity

- Complexity:

  Backend with Django REST Framework: The project makes extensive use of Django REST Framework (DRF) to create a robust API that manages authentication, test creation, and results tracking. The backend handles complex relationships between multiple models, including Users, Tests, Categories, and TestAttempts. For instance, each test is associated with multiple categories and questions, and each attempt by a student is tracked for scoring.
  Token Authentication & Security: Securing the API endpoints is a key component of the project. I implemented Bearer token authentication to ensure that only authenticated users can access specific endpoints. This system prevents unauthorized access, providing a safe environment for both students and instructors to interact with the platform.
  Role-based Access Control (RBAC): I integrated role-based access management using Django’s Groups feature. Instructors and students are assigned specific roles, and the platform’s functionality changes depending on the user’s role. This allows instructors to create and manage tests while students can only attempt tests and view their results. This dynamic access control enhances security and makes the platform more flexible.
  Randomized Question Options: The options for each question are sorted randomly before a student takes a test, ensuring that each test attempt is unique and reducing the chances of cheating.

- Distinctiveness:

  User-Centric Design: The project is distinct in its focus on both student and instructor experiences. Instructors can create detailed tests. Meanwhile, students have a streamlined test-taking experience that allows them to track their progress, save their attempts, and visit their test history.
  Clean API Documentation with Swagger: To ensure that the API is easy to understand and integrate with, I used Swagger (OpenAPI 3) for clean and interactive documentation. This auto-generated documentation provides clear, user-friendly details about each endpoint, request, and response format, making it easy for developers to extend or modify the platform in the future.
  Persistent Data with Session Storage: On the frontend, I used Session Storage to persist user data across page reloads. This improves the user experience by retaining important information, such as test progress or partial answers, ensuring a seamless interaction with the platform even if the user navigates away or refreshes the page.
  Responsive Frontend with Tailwind CSS: For the frontend, I used Tailwind CSS to ensure that the platform is visually appealing, modern, and fully responsive. The design adapts across devices, offering an optimized user experience on desktops, tablets, and mobile devices.

## Files Overview

### Backend (Django + Django REST Framework)

- **`manage.py`**: The Django project management command-line utility.
- **`requirements.py`**: A list of required Python packages for the backend, including Django, Django REST Framework, and others.
- **`apps.py`**: Configuration for the Django application, including application-specific settings and initialization.
- **`models.py`**: Contains all the database models, such as `User`, `Test`, `Category`, `Question`, `Answer`, `Option`, `SavedTest`, and `TestAttempt`.
- **`views.py`**: Contains API views for managing tests, creating and submitting answers, and handling test attempts.
- **`urls.py`**: The URL routing for API endpoints.
- **`serializers.py`**: Contains serializers for converting model instances to JSON and validating incoming data.
- **`admin.py`**: Customizes the Django admin interface to manage the models more easily.
- **`migrations/`**: Folder containing database migration files.
- **`management/commands/create_default_data.py`**: Contains commands to populate database with default data.

### Frontend (React)

- **`.env`**: Contains environment variables.
- **`.gitignore`**:Specifies files and folders that Git should ignore when committing to version control, such as node_modules, environment variables, and build files.
- **`.eslint.config.js`**: Configuration file for ESLint, defining coding style rules and linting preferences to maintain consistent code quality.
- **`index.html`**: The entry point for the React application, used to mount the React components into the DOM.
- **`package.json`**: Specifies the frontend project's dependencies, scripts, metadata, and configurations.
- **`package-lock`**: Auto-generated file that locks the version of dependencies for consistent installs across different environments.
- **`postcss.config.js`**: Configuration file for PostCSS, used for transforming CSS with plugins like Tailwind CSS.
- **`tailwind.config.js`**: Configuration file for Tailwind CSS, allowing customization of themes, colors, and other design utilities.
- **`vite.config.js`**: Configuration file for Vite, the frontend build tool used in the project. Defines settings like server options and plugins.
- **`public/vite.svg`**: The Vite logo, used as the favicon for the project.
- **`src/main.jsx`**: The main entry point for the React application, where the React component tree is initialized and rendered into the DOM.
- **`src/App.jsx`**: The root React component that defines the main structure of the application. Contains routes, layouts, and shared components.
- **`src/index.css`**: Main CSS file for the application, used for importing Tailwind CSS utilities.
- **`src/api/`**: Contains utility functions or services for interacting with the backend API.
- **`src/assets/`**: Stores static assets used across the application.
- **`src/components/`**: Reusable React components, such as buttons, cards, and navigations bars, that are shared across different pages and layouts.
- **`src/constants/session.js`**: Houses constant session related values.
- **`src/hooks/useSession.jsx`**: A custom React hook for managing user session data in the frontend, like authentication tokens or role information.
- **`src/interceptor/interceptor.js`**: Contains an Axios interceptor for handling API requests and responses, such as attaching tokens or error handling globally.
- **`src/layouts/`**: Defines reusable instructor and student layouts components, to structure pages consistently.
- **`src/pages/auth/sign-in.jsx`**: The sign-in page where users can log in to their accounts.
- **`src/pages/auth/sign-up.jsx`**: The sign-up page where new users can create an account.
- **`src/pages/instructor/create.jsx`**: The page for instructors to create new tests.
- **`src/pages/instructor/detail.jsx`**: The page displaying detailed information about a specific test created by an instructor.
- **`src/pages/instructor/home.jsx`**: The home page for instructors, listing all tests they have created.
- **`src/pages/logout.jsx`**: The page that handles user logout and redirects to the sign-in page.
- **`src/pages/profile.jsx`**: The profile page displaying user information.
- **`src/pages/student/detail.jsx`**: The page displaying detailed information about a specific test for students.
- **`src/pages/student/history.jsx`**: The page displaying the test attempt history for students.
- **`src/pages/student/home.jsx`**: The home page for students, listing all available tests.
- **`src/pages/student/saved.jsx`**: The page displaying tests that students have saved for later.
- **`src/pages/student/take.jsx`**: The page where students can take a test.
- **`src/pages/unauthorized.jsx`**: The page displayed when a user tries to access a restricted area without proper authorization.
- **`src/routes/ProtectedRoute.jsx`**: Implements the routing logic for the application, including handling private routes, enforcing role-based access control, and managing navigation.
- **`src/utils/category.js`**: Contains a helper function to apply a color based on the category.

## How to Run the Application

### First setup the backend server

1. Install required Python packages:

```console
 pip install -r requirements.txt

```

2. Apply database migrations:

```console
 python manage.py migrate

```

3. Seed the Database with default data:

```console
python manage.py create_default_data

```

4. Start backend development server:

```console
python manage.py runserver

```

### Then for the frontend

1. Access to the client folder:

```console
cd client

```

2. Install neccesary dependencies:

```console
npm install

```

3. Start frontend development server:

```console
npm run dev

```

## Additional Information

- The platform supports Bearer token authentication for secure access to the API.

- Swagger documentation for the API is available at http://localhost:8000/api/schema/swagger-ui/

- To avoid CORS errors, ensure that your frontend development server is running at http://127.0.0.1:5173. Alternatively, you can update this configuration in **`final_project_api/settings.py`** under the **`CORS_ALLOWED_ORIGINS`** setting.
