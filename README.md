# AI Client Intake Tool

An AI-powered full-stack client onboarding tool built for BrandNovate Digital Inc.'s technical assessment.

This application allows internal team members to capture new client details, generate a structured onboarding brief using AI, and review previous submissions from a dashboard.

## Features

- Clean client intake form
- AI-generated onboarding brief
- MongoDB persistence with timestamps
- Submission dashboard
- Search and filter functionality for past submissions
- Responsive UI built with Next.js and Tailwind CSS

## Tech Stack

- **Frontend:** Next.js 16, React, Tailwind CSS
- **Backend:** Next.js Route Handlers
- **AI Integration:** OpenAI API
- **Database:** MongoDB Atlas with Mongoose
- **Deployment:** Vercel

## Project Structure

```bash
src/
  app/
    api/
      intake/
        route.ts
      submissions/
        route.ts
      test/
        route.ts
    dashboard/
      page.tsx
    page.tsx
    globals.css
  lib/
    mongodb.ts
    openai.ts
  models/
    Submission.ts
```
    
## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/theos-stack/client-intake-ai.git
```
### 2. Install dependencies
```bash
npm install
```

### 3. Create environment variables
Create .env.local file in the root of the project and the following:
```bash
MONGODB_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
```
### 4. Run the development server
```bash
npm run dev
```
Then open:
```bash
http://localhost:3000
```
### Environment Variables

#### MONGODB_URI
MongoDB Atlas connection string used to connect the application to the database.

#### OPENAI_API_KEY
OpenAI API key used to generate AI-powered onboarding briefs.

### How It Works
1. A user enters client details in the intake form:
    - Client name
    - Business type
    - Goals
    - Budget range
    - Location
2. The form submits the data to the backend API.
3. The backend sends the client details to the OpenAI API.
4. The AI returns a structured onboarding brief containing:
    - Business summary
    - Goals
    - Recommended strategy
    - Budget insight
    - Next steps
5. The original submission and generated brief are stored in MongoDB.
6. The dashboard displays previous submissions with search and filtering support.

## Author
Samuel Ojo