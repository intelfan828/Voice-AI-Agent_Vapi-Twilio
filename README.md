# Voice AI Callback Service

A Next.js application that provides an immersive callback experience using AI voice agents.

## Features

- Callback request form with phone and email collection
- AI-powered voice calls using Twilio
- Information collection through natural conversation
- Secure passwordless authentication via email
- Firebase integration for data storage and authentication

## Prerequisites

- Node.js 18+ and npm
- Firebase project
- Twilio account with a phone number

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Application Configuration
NEXT_PUBLIC_BASE_URL=your_application_url
```

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with your environment variables
4. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

- `/src/app` - Next.js app directory
- `/src/components` - React components
- `/src/lib` - Utility functions and configurations
- `/src/app/api` - API routes

## Usage

1. Users access the callback form and enter their phone number and email
2. The system initiates a call using Twilio
3. The AI agent collects necessary information through conversation
4. Upon completion, the user receives an email with a secure authentication link
5. The user can access their personalized consultation portal

## Security Considerations

- All sensitive data is stored in Firebase
- Passwordless authentication is implemented for secure access
- API keys and tokens are stored in environment variables
- HTTPS is required for production deployment

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
