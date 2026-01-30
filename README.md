# Health Agent 🏥

A comprehensive AI-powered health assistant application built with Next.js 14, Google Gemini AI, and Neon PostgreSQL.

## Features

### 🤖 AI Health Chat
- Conversational health assistant powered by Google Gemini
- Context-aware responses based on your health profile
- Medical disclaimers and safety guardrails

### 📅 Smart Appointment Booking
- Natural language appointment scheduling ("Book an appointment with a cardiologist tomorrow")
- Doctor listings with specializations
- Calendar-based slot selection
- Appointment management

### 🍎 Personalized Diet Plans
- AI-generated meal plans based on health profile
- Macro and calorie calculations
- Foods to include/avoid recommendations
- Hydration tips

### 🏋️ Exercise Recommendations
- Body-part specific workout plans
- Fitness level customization
- Exercise tracking with completion progress
- Safety warnings and modifications

### 🧘 Yoga Practice
- Personalized yoga sequences
- Multiple focus areas (stress relief, flexibility, energy, etc.)
- Detailed pose instructions
- Breathing exercises (Pranayama)

### 📊 Health Assessment
- Comprehensive health score calculation
- BMI, Activity, Sleep, Stress, Nutrition scores
- Personalized recommendations
- Risk factor identification

### 🩺 Condition Management
- Guidance for various health conditions
- Diet and exercise recommendations per condition
- Warning signs and when to see a doctor
- Lifestyle modifications

### 🎯 Goal Planning
- Goal-based comprehensive plans (weight loss, muscle building, etc.)
- Weekly action plans
- Milestones and tracking tips
- Success strategies

### 📈 Health Metrics Tracking
- Log and track various health metrics
- Weight, blood pressure, heart rate, sleep, steps, etc.
- Trend visualization
- Historical data view

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Neon PostgreSQL
- **ORM**: Prisma
- **AI**: Google Gemini API
- **Authentication**: Custom JWT-based auth (bcrypt + jose)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Neon PostgreSQL database
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd health-agent
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env file with:
DATABASE_URL="your-neon-postgresql-url"
GEMINI_API_KEY="your-gemini-api-key"
JWT_SECRET="your-secret-key"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
health-agent/
├── app/
│   ├── (auth)/           # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/      # Protected dashboard pages
│   │   ├── appointments/
│   │   ├── assessment/
│   │   ├── chat/
│   │   ├── conditions/
│   │   ├── dashboard/
│   │   ├── diet/
│   │   ├── exercise/
│   │   ├── goals/
│   │   ├── metrics/
│   │   ├── profile/
│   │   ├── settings/
│   │   └── yoga/
│   ├── profile/
│   │   └── setup/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx          # Landing page
├── components/
│   └── layout/
│       ├── Header.tsx
│       └── Sidebar.tsx
├── lib/
│   ├── actions/          # Server actions
│   │   ├── appointments.ts
│   │   ├── auth.ts
│   │   ├── chat.ts
│   │   ├── metrics.ts
│   │   ├── profile.ts
│   │   └── recommendations.ts
│   ├── ai/
│   │   ├── gemini.ts     # Gemini API integration
│   │   ├── prompts.ts    # AI prompts
│   │   └── index.ts
│   ├── auth.ts           # Auth utilities
│   ├── prisma.ts         # Prisma client
│   ├── utils.ts          # Utility functions
│   └── validations.ts    # Zod schemas
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed data
├── middleware.ts         # Route protection
├── next.config.js
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## API Features

### AI Functions (lib/ai/gemini.ts)
- `healthChat()` - Conversational health assistant
- `extractAppointmentDetails()` - NLP appointment parsing
- `generateDietPlan()` - Personalized diet recommendations
- `generateExercisePlan()` - Exercise routines
- `generateYogaPlan()` - Yoga sequences
- `calculateHealthScores()` - Health assessment
- `getDiseaseGuidance()` - Condition management
- `generateGoalPlan()` - Goal-based planning

### Server Actions
- Authentication (register, login, logout)
- Profile management
- Chat history
- Appointments (CRUD)
- Health metrics
- Recommendations

## Security

- Passwords hashed with bcrypt
- JWT-based session management
- Protected API routes
- Middleware route protection
- Input validation with Zod
- Medical disclaimers in AI responses

## Disclaimer

⚠️ **Important**: This application is for informational and educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.

## License

MIT

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.
