# Finance Visualizer

A modern web application for tracking personal finances, visualizing expenses, and managing budgets.

## Features

- 💰 Transaction tracking with categorization
- 📊 Interactive charts and visualizations
- 💼 Monthly budget management
- 📈 Expense analysis by category
- 📱 Responsive design for all devices
- 🔄 Real-time updates

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Database**: MongoDB
- **Form Handling**: React Hook Form, Zod
- **API**: Next.js API Routes

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/finance-visualizer.git
cd finance-visualizer
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
finance-visualizer/
├── src/
│   ├── app/              # Next.js app router
│   ├── components/       # React components
│   ├── lib/             # Utilities and database
│   └── types/           # TypeScript types
├── public/              # Static assets
└── ...config files
```

## Features in Detail

### Transaction Management
- Add, edit, and delete transactions
- Categorize transactions
- View transaction history

### Budget Management
- Set monthly budgets by category
- Compare actual spending vs budget
- Visual budget tracking

### Visualizations
- Monthly expense trends
- Category-wise expense breakdown
- Budget vs actual comparison

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

