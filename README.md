# Task Management Application

A modern task management application built with Next.js, React, TypeScript, and Tailwind CSS. This application allows users to create, manage, and organize tasks with different priorities.

## Live Demo

Check out the live application: [Task Management App](https://task-management-woad-six.vercel.app/)

## Features

- **User Authentication**: Register and login functionality with role-based access control
- **Task Management**: Create, edit, and delete tasks
- **Priority Levels**: Assign different priority levels to tasks (Low, Medium, High)
- **Filtering & Sorting**: Filter tasks by priority, date, or view all tasks
- **Search Functionality**: Search for specific tasks
- **Responsive Design**: Works on mobile, tablet, and desktop devices
- **Dark/Light Mode**: Toggle between dark and light themes
- **Role-Based Access**: Admin users can manage all tasks, regular users can only manage their own tasks

## Technologies Used

- **Frontend**:

  - Next.js 15.2.2
  - React 19
  - TypeScript
  - Tailwind CSS 4
  - React Icons

- **State Management**:

  - React Context API
  - Local Storage for data persistence

- **Authentication**:
  - Custom authentication with local storage

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/task-management.git
   cd task-management
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Build and Deployment

### Build for Production

```bash
npm run build
# or
yarn build
```

### Start Production Server

```bash
npm run start
# or
yarn start
```

## Deployment

The application is deployed on Vercel. Any changes pushed to the main branch will automatically trigger a new deployment.

## Project Structure

- `/src/app`: Next.js app router pages
- `/src/components`: Reusable React components
- `/src/context`: React context providers for state management
- `/src/types`: TypeScript type definitions
- `/src/utils`: Utility functions including localStorage handlers

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vercel](https://vercel.com/) for hosting the application
