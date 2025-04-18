# Deployment Guide

This document outlines the steps to deploy the NULLSTRA-terminal to various environments.

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- Docker and Docker Compose (for containerized deployment)
- Access to a hosting service (Vercel, Netlify, AWS, etc.)

## Local Development

1. Clone the repository

   ```bash
   git clone <repository-url>
   cd futuristic-terminal-ui
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the development server

   ```bash
   npm run dev
   ```

4. The application will be available at http://localhost:3000

## Testing

1. Run unit tests

   ```bash
   npm test
   ```

2. Run linting
   ```bash
   npm run lint
   ```

## Production Build

1. Create a production build

   ```bash
   npm run build
   ```

2. Start the production server
   ```bash
   npm start
   ```

## Docker Deployment

1. Build the Docker image

   ```bash
   docker build -t futuristic-terminal-ui .
   ```

2. Run the container

   ```bash
   docker run -p 3000:3000 futuristic-terminal-ui
   ```

3. Alternatively, use Docker Compose
   ```bash
   docker-compose up -d
   ```

## Hosting Providers

### Vercel

1. Install Vercel CLI

   ```bash
   npm install -g vercel
   ```

2. Deploy to Vercel
   ```bash
   vercel --prod
   ```

### Netlify

1. Install Netlify CLI

   ```bash
   npm install -g netlify-cli
   ```

2. Deploy to Netlify
   ```bash
   netlify deploy --prod
   ```

### AWS Amplify

1. Install AWS Amplify CLI

   ```bash
   npm install -g @aws-amplify/cli
   ```

2. Initialize Amplify

   ```bash
   amplify init
   ```

3. Deploy to AWS Amplify
   ```bash
   amplify publish
   ```

## CI/CD Configuration

The project includes GitHub Actions workflows for continuous integration and deployment:

- On every push to the `main` branch, the CI/CD pipeline:
  1. Runs linting and tests
  2. Builds the application
  3. Deploys to the production environment

To set up CI/CD with GitHub Actions:

1. Add the following secrets to your GitHub repository settings:

   - `VERCEL_TOKEN`: Your Vercel API token
   - `VERCEL_PROJECT_ID`: Your Vercel project ID
   - `VERCEL_ORG_ID`: Your Vercel organization ID

2. Commit and push the `.github/workflows/ci-cd.yml` file to your repository

## Environment Variables

The following environment variables can be configured for deployment:

- `NODE_ENV`: Set to `production` for production deployments
- `NEXT_PUBLIC_API_URL`: API URL for backend services (if needed)

## Troubleshooting

- **Build fails**: Ensure all dependencies are correctly installed
- **Docker container crashes**: Check container logs with `docker logs futuristic-terminal-ui`
- **Deployment errors**: Verify API tokens and environment variables are correctly set up
