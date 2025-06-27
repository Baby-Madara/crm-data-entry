# Enhanced CRM Data Entry System

A modern, responsive React application for managing customer relationships and orders with enhanced UX and scrollable columns.

## Features

### ✨ Enhanced User Experience
- **Modern Design**: Clean, professional interface with Tailwind CSS styling
- **Responsive Layout**: Works seamlessly on desktop and mobile devices
- **Intuitive Navigation**: Easy-to-use forms and clear visual hierarchy

### 📊 Data Management
- **Customer Management**: Add, view, edit, and delete customer records
- **Order Tracking**: Track order details, values, and completion status
- **CRM Agent Assignment**: Assign multiple agents to customers
- **Status Management**: Track customer status (New, In Progress, Completed, On Hold, Cancelled)

### 🔍 Advanced Features
- **Horizontal Scrolling**: Table columns are scrollable for better data visibility
- **Search & Filter**: Real-time search by name, phone, location, or order number
- **Status Filtering**: Filter customers by status
- **Export Functionality**: Export data to JSON format
- **Local Storage**: Data persistence between sessions

### 📋 Customer Details
- Client information (name, phone, city, country, location)
- Order details (description, value, number, payment method)
- CRM agent assignments
- Delivery tracking
- Customer and agent notes
- Start and completion dates

## Technical Stack

- **React 18**: Modern React with hooks
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/UI**: High-quality UI components
- **Lucide Icons**: Beautiful, consistent icons
- **UUID**: Unique identifier generation
- **Vite**: Fast build tool and development server

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Installation
1. Navigate to the project directory:
   ```bash
   cd crm-data-entry
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm run dev
   ```

4. Open your browser and visit `http://localhost:5173`

### Building for Production
```bash
pnpm run build
```

## Usage

### Adding Customers
1. Click the "Add Customer" button
2. Fill in the customer details form
3. Select CRM agents by clicking on their badges
4. Click "Add Customer" to save

### Managing Data
- **Search**: Use the search bar to find customers by name, phone, location, or order number
- **Filter**: Use the status dropdown to filter by customer status
- **View Details**: Click the eye icon to view full customer details
- **Delete**: Click the trash icon to remove a customer

### Table Navigation
- The table supports horizontal scrolling to view all columns
- Headers remain fixed while scrolling
- Action buttons are available in the rightmost column

## Data Structure

Each customer record includes:
- Basic info: name, phone, city, country, location
- Order details: description, value, number, payment method
- CRM data: assigned agents, status, notes
- Dates: start date, completion date
- Delivery status

## Dummy Data

The application includes sample employee data:
- Ahmed Hassan (Sales)
- Mona Adel (Support)
- Omar Khaled (Manager)
- Fatma Ali (Sales)
- Hassan Mohamed (Support)

## Enhancements Made

### From Original Code
1. **Better UX**: Modern design with cards, proper spacing, and visual hierarchy
2. **Scrollable Columns**: Horizontal scrolling table with fixed headers
3. **Improved Forms**: Better input controls with dropdowns and validation
4. **Enhanced Modals**: Professional customer details view
5. **Search & Filter**: Advanced filtering capabilities
6. **Statistics Dashboard**: Overview cards showing key metrics
7. **Export Functionality**: Data export capabilities
8. **Responsive Design**: Mobile-friendly layout
9. **Better State Management**: Improved data handling and persistence
10. **Professional Styling**: Consistent design system with proper colors and spacing

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

This project is for demonstration purposes.

