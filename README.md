# Expense Tracker

A modern, full-stack expense tracking application built with React, Redux Toolkit, and Supabase. Features a sleek, institutional-grade UI with real-time authentication and user-specific data isolation.

## 🚀 Features

- **Authentication**: Secure signup/login with Supabase Auth
- **User Data Isolation**: Row Level Security (RLS) ensures users only see their own expenses
- **CRUD Operations**: Add, view, edit, and delete expenses
- **Expense Fields**: Title, amount (positive/negative), category, and date
- **Smart Sorting**: Latest expenses displayed on top
- **Total Calculation**: Real-time expense totals with visual metrics
- **Form Validation**: Client-side validation with error feedback
- **Responsive Design**: Mobile-first with desktop sidebar navigation
- **State Management**: Redux Toolkit with async thunks for API calls
- **Beautiful UI**: Tailwind CSS with glass-morphism effects and smooth animations

## 🛠️ Tech Stack

- **Frontend**: React 19
- **State Management**: Redux Toolkit
- **Backend/Database**: Supabase
- **Styling**: Tailwind CSS 4
- **Build Tool**: Vite
- **Authentication**: Supabase Auth (Email/Password)

## 📋 Prerequisites

- Node.js 18+ and npm
- A Supabase account and project ([supabase.com](https://supabase.com))

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Expense-Tracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

The `.env` file should already contain your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Important**: If you need to update these values:
1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy your project URL and anon/public key
4. Update the `.env` file accordingly

### 4. Set Up the Database

1. Open your Supabase dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `database-schema.sql`
4. Click **Run** to execute the SQL

This will create:
- The `expenses` table with proper schema
- Row Level Security (RLS) policies for user data isolation
- Indexes for optimal query performance
- Auto-updating timestamps

### 5. Enable Email Authentication in Supabase

1. Go to **Authentication** → **Providers** in Supabase
2. Enable **Email** provider
3. Configure email settings (disable email confirmation for development if desired)

### 6. Start the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
Expense-Tracker/
├── src/
│   ├── components/
│   │   ├── AuthForm.jsx        # Login/Signup form
│   │   ├── Dashboard.jsx       # Main dashboard with stats
│   │   ├── ExpenseForm.jsx     # Add/Edit expense form
│   │   └── ExpenseList.jsx     # Expenses list view
│   ├── store/
│   │   ├── index.js            # Redux store configuration
│   │   ├── authSlice.js        # Auth state & async thunks
│   │   └── expensesSlice.js    # Expenses state & async thunks
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # App entry point
│   ├── index.css               # Global styles & Tailwind
│   └── supabase-config.js      # Supabase client setup
├── database-schema.sql         # Database setup script
├── .env                        # Environment variables
├── tailwind.config.js          # Tailwind configuration
└── package.json                # Dependencies
```

## 🎯 Usage

### Sign Up / Login

1. Open the app
2. Click "Provision account" to sign up
3. Enter your email and password (min 6 characters)
4. For existing users, click "Return to hub" to login

### Add an Expense

1. Click the **"+"** button (mobile) or **"New Operation"** (desktop)
2. Select **Outflow** (expense) or **Inflow** (income)
3. Fill in the form:
   - **Description**: Name of the expense
   - **Amount**: Positive number (system handles sign based on type)
   - **Category**: Select from dropdown
   - **Date**: Transaction date
4. Click **"Authorize Entry"**

### Edit an Expense

1. Hover over any expense in the list
2. Click **"Modify"**
3. Update the fields
4. Click **"Update Main Ledger"**

### Delete an Expense

1. Hover over any expense in the list
2. Click **"Delete"**
3. Confirm the deletion

### Sign Out

- **Desktop**: Click **"Terminate"** in the sidebar
- **Mobile**: Access settings from the bottom navigation

## 🔒 Security Features

- **Row Level Security (RLS)**: Database-level policies ensure users can only access their own data
- **Auth State Listener**: Automatic session management
- **Environment Variables**: Sensitive keys stored securely in `.env`
- **Input Validation**: Client-side validation prevents invalid data submission

## 🎨 UI/UX Highlights

- **Glass-morphism Design**: Frosted glass effects with backdrop blur
- **Responsive Layout**: 
  - Mobile: Bottom tab navigation, card-based layout
  - Desktop: Sticky sidebar, expanded metrics
- **Animations**: Smooth transitions, floating backgrounds, hover effects
- **Dark Theme**: Professional black background with white accents
- **Visual Feedback**: Loading spinners, success/error toasts, validation errors

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` folder.

### Deploy Options

- **Vercel**: `vercel deploy`
- **Netlify**: Drag and drop `dist/` folder
- **GitHub Pages**: Use `vite-plugin-pages`
- **Supabase Hosting**: Direct deployment

## 🐛 Troubleshooting

### Database Connection Error
- Verify your Supabase URL and anon key in `.env`
- Ensure the database schema has been executed
- Check that RLS policies are properly configured

### Authentication Issues
- Confirm email auth is enabled in Supabase
- Check browser console for specific error messages
- Ensure email confirmation is disabled for development

### Expenses Not Showing
- Verify RLS policies are correctly set up
- Check that `user_id` is being properly passed in requests
- Ensure the user is authenticated before fetching data

## 📝 API Endpoints (Supabase)

All API calls go through Supabase's auto-generated REST API:

- `POST /auth/v1/signup` - User registration
- `POST /auth/v1/token` - User login
- `GET /rest/v1/expenses` - Fetch user expenses
- `POST /rest/v1/expenses` - Create expense
- `PATCH /rest/v1/expenses/:id` - Update expense
- `DELETE /rest/v1/expenses/:id` - Delete expense

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Built as part of the SMIT Class Assignment - React JS Track

---

**Secured by Supabase Core** ⚡
