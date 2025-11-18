# githubFrontend

This project is the frontend application for the Sredio GitHub Integration. It allows users to connect their GitHub accounts, view various GitHub entities (organizations, repositories, commits, pull requests, issues, users), and synchronize data with the backend.

## Features

- **GitHub OAuth Integration**: Securely connect your GitHub account using OAuth.
- **Dashboard**: View and manage GitHub data through a user-friendly interface.
- **Data Synchronization**: Synchronize GitHub data with the backend for up-to-date information.
- **Pagination and Sorting**: Efficiently browse large datasets with built-in pagination and sorting capabilities.
- **Global Search**: Quickly find specific data across all entities.

## Project Structure

The project is an Angular application with the following key directories:

- `src/app/modules/public`: Contains components related to public access, such as login and GitHub callback handling.
  - `login/login.component.ts`: Handles user login and checks GitHub connection status.
  - `github-callback/github-callback.component.ts`: Processes the GitHub OAuth callback, exchanges the authorization code for an access token, and handles success/failure messages.
- `src/app/modules/user/home`: Contains the main dashboard component for authenticated users.
  - `home/home.component.ts`: Displays GitHub entities, handles data fetching, pagination, sorting, filtering, and synchronization.
- `src/app/services`: Contains shared services for authentication and API communication.
  - `auth.service.ts`: Manages GitHub OAuth flow, API calls to the backend for data queries, and user authentication status.

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- Angular CLI
- A GitHub OAuth App configured with a callback URL pointing to `http://localhost:4200/github-callback`.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/hassankhalidtech-it/githubFrontend.git
   cd githubFrontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create `src/environments/environment.development.ts` (if it doesn't exist) and `src/environments/environment.ts` and add your GitHub Client ID and API URL:

   `src/environments/environment.development.ts`:
   ```typescript
   export const environment = {
     production: false,
     APIURL: 'YOUR_BACKEND_API_URL', // e.g., http://localhost:3000/api/v1/
     GITHUB_CLIENT_ID: 'YOUR_GITHUB_CLIENT_ID'
   };
   ```

   `src/environments/environment.ts`:
   ```typescript
   export const environment = {
     production: true,
     APIURL: 'YOUR_PRODUCTION_BACKEND_API_URL',
     GITHUB_CLIENT_ID: 'YOUR_GITHUB_CLIENT_ID'
   };
   ```

### Running the Application

1. **Start the development server:**
   ```bash
   ng serve
   ```

2. **Open your browser:**
   Navigate to `http://localhost:4200`.

## Development

### Code Style

This project adheres to standard Angular coding conventions.

### Testing

- **Unit Tests**: Run unit tests using `ng test`.
- **End-to-End Tests**: Run end-to-end tests using `ng e2e`.

## Contributing

Contributions are welcome! Please fork the repository and submit pull requests.

## License

This project is licensed under the MIT License.
