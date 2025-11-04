# SpendSmart Frontend

A modern, responsive web application for personal finance management built with Next.js 14.

## 🚀 Features

- **Modern UI/UX**: Clean, intuitive design with Tailwind CSS
- **Authentication**: JWT-based login/register system
- **Dashboard**: Comprehensive financial overview with charts and analytics
- **Expense Management**: Add, edit, delete, and categorize expenses/income
- **Wallet Management**: Multiple wallets with different currencies
- **Category Management**: Custom categories with colors and icons
- **Budget Tracking**: Create and monitor budgets with visual progress
- **Analytics**: Interactive charts and spending insights
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## 🛠 Tech Stack

- **Next.js 14** with App Router
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Recharts** for data visualization
- **Axios** for HTTP requests
- **Context API** for state management

## 🏗 Project Structure

```
src/
├── app/                    # Next.js 14 App Router
│   ├── (auth)/            # Authentication routes
│   ├── budgets/           # Budget management pages
│   ├── categories/        # Category management pages
│   ├── expenses/          # Expense management pages
│   ├── reports/           # Analytics and reports
│   ├── settings/          # User settings
│   ├── wallets/           # Wallet management pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # Reusable components
│   ├── budgets/          # Budget-specific components
│   ├── categories/       # Category-specific components
│   ├── dashboard/        # Dashboard components
│   ├── expenses/         # Expense-specific components
│   ├── wallets/          # Wallet-specific components
│   ├── DashboardLayout.tsx
│   ├── ProtectedRoute.tsx
│   └── ...
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication context
├── lib/                  # Utilities and configurations
│   └── api.ts            # Axios configuration
└── types/                # TypeScript type definitions
```

## 📱 Pages & Features

### 🏠 **Dashboard**
- Financial overview with key metrics
- Recent transactions list
- Quick action buttons
- Spending trends chart
- Budget progress indicators

### 💰 **Expense Management**
- Add new income/expense transactions
- Edit existing transactions
- Category and wallet selection
- Transaction type filtering
- Date-based filtering

### 🏦 **Wallet Management**
- Create multiple wallets
- Different currencies support
- Set default wallet
- View wallet balances
- Edit/delete wallets

### 🏷️ **Category Management**
- Custom categories with colors
- System categories
- Category-based analytics
- Edit/delete categories

### 🎯 **Budget Tracking**
- Create budgets by category or overall
- Visual progress tracking
- Alert thresholds
- Budget periods (weekly, monthly, quarterly, yearly)
- Budget analytics

### 📊 **Reports & Analytics**
- Spending trends over time
- Category breakdown charts
- Income vs expense analysis
- Monthly/yearly comparisons

### ⚙️ **Settings**
- User profile management
- Notification preferences
- Currency settings
- Theme customization

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd spend-smart-frontend
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Configure environment variables**
```bash
# Create .env.local file
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

5. **Open in browser**
- Navigate to `http://localhost:3000`

## 🔧 Development Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Linting
npm run lint

# Type checking
npm run type-check
```

## 🎨 UI Components

### Layout Components
- **DashboardLayout**: Main application layout with sidebar navigation
- **ProtectedRoute**: Route wrapper for authenticated pages

### Form Components
- **ExpenseForm**: Transaction creation/editing
- **WalletForm**: Wallet management form
- **BudgetForm**: Budget creation/editing
- **CategoryForm**: Category management form

### Display Components
- **SpendingChart**: Interactive spending analytics
- **BudgetProgress**: Visual budget tracking
- **RecentTransactions**: Transaction list with filtering
- **QuickActions**: Dashboard action buttons

## 🔐 Authentication Flow

1. **Registration**: User creates account
2. **Login**: JWT token issued and stored
3. **Protected Routes**: Auto-redirect if not authenticated
4. **Token Refresh**: Automatic token renewal
5. **Logout**: Token cleanup and redirect

## 📊 Data Management

### API Integration
- Centralized API configuration with Axios
- Automatic JWT token injection
- Error handling and response interceptors
- Loading states and error boundaries

### State Management
- React Context for authentication state
- Local component state for UI interactions
- Form state management with controlled components

## 🎯 Key Features Implementation

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Adaptive layouts for different screen sizes
- Touch-friendly interface elements

### Real-time Updates
- Immediate UI updates after API operations
- Success/error message feedback
- Loading states for better UX

### Data Visualization
- Interactive charts with Recharts
- Color-coded categories
- Progress indicators and trends

## 🚀 Production Deployment

### Build Optimization
```bash
# Create optimized production build
npm run build

# Analyze bundle size
npm run analyze
```

### Environment Configuration
```bash
# Production environment variables
NEXT_PUBLIC_API_URL=https://api.yourapp.com/api/v1
NEXTAUTH_URL=https://yourapp.com
NEXTAUTH_SECRET=your-secret-key
```

### Deployment Options
- **Vercel**: Seamless Next.js deployment
- **Netlify**: Static site deployment
- **Docker**: Containerized deployment
- **AWS/Azure**: Cloud platform deployment

## 🔧 API Integration

The frontend connects to the SpendSmart Backend API with the following endpoints:

- **Auth**: `/auth/*` - User authentication
- **Expenses**: `/expenses/*` - Transaction management
- **Wallets**: `/wallets/*` - Wallet operations
- **Categories**: `/categories/*` - Category management
- **Budgets**: `/budgets/*` - Budget tracking
- **Analytics**: `/analytics/*` - Reports and insights

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you have any questions or issues, please open an issue on GitHub.

---

**Built with ❤️ using Next.js and React**
