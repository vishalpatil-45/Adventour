# Adventour - Modern Travel Booking Website

A beautiful, modern travel booking website inspired by Airbnb, built with HTML, CSS, JavaScript, and Node.js.

## Features

- 🏠 **Modern UI/UX** - Clean, responsive design inspired by Airbnb
- 🔍 **Advanced Search** - Filter by location, price, type, and dates
- 📱 **Mobile Responsive** - Works perfectly on all devices
- 💳 **Booking System** - Complete booking flow with form validation
- 📧 **Email Notifications** - Automated booking confirmations
- 🎨 **Interactive Elements** - Smooth animations and micro-interactions
- 🌍 **Multiple Destinations** - Explore various locations worldwide
- ⭐ **Rating System** - User reviews and ratings
- 💰 **Price Calculator** - Dynamic pricing based on dates and guests

## Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid and Flexbox
- **JavaScript (ES6+)** - Interactive functionality
- **Font Awesome** - Icons
- **Google Fonts** - Typography

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **Nodemailer** - Email functionality
- **CORS** - Cross-origin resource sharing

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/adventour-travel-website.git
   cd adventour-travel-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your configuration:
   ```env
   PORT=3000
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with live reload
- `npm run build` - Build and minify assets
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

```
adventour-travel-website/
├── assets/
│   ├── css/
│   │   ├── style.css          # Main stylesheet
│   │   └── booking.css        # Booking page styles
│   ├── js/
│   │   ├── main.js           # Main JavaScript
│   │   └── booking.js        # Booking functionality
│   └── files/                # Images and assets
├── index.html                # Homepage
├── booking.html              # Booking page
├── package.html              # Packages page
├── contact.html              # Contact page
├── info.html                 # About page
├── server.js                 # Node.js server
├── package.json              # Dependencies
└── README.md                 # This file
```

## API Endpoints

### Packages
- `GET /api/packages` - Get all packages
- `GET /api/packages/:id` - Get package by ID
- `GET /api/search` - Search packages

### Booking
- `POST /api/booking` - Submit booking
- `POST /api/newsletter` - Subscribe to newsletter
- `POST /api/contact` - Submit contact form

### Locations
- `GET /api/locations` - Get all locations

## Features in Detail

### Search & Filter
- Real-time search with suggestions
- Filter by property type (beach, mountain, city, luxury)
- Price range slider
- Date picker with validation
- Guest count selection

### Booking Process
- Multi-step booking form
- Form validation with error messages
- Price calculation based on dates
- Payment method selection
- Booking confirmation with email

### Responsive Design
- Mobile-first approach
- Breakpoints for tablet and desktop
- Touch-friendly interface
- Optimized images and assets

### Performance
- Minified CSS and JavaScript
- Optimized images
- Lazy loading
- Efficient DOM manipulation

## Customization

### Colors
Edit CSS variables in `assets/css/style.css`:
```css
:root {
  --primary-color: #FF385C;
  --secondary-color: #00A699;
  --text-dark: #222222;
  /* ... more variables */
}
```

### Content
- Update package data in `server.js`
- Modify images in `assets/files/`
- Edit text content in HTML files

### Styling
- Modify `assets/css/style.css` for global styles
- Update `assets/css/booking.css` for booking page
- Add new CSS files for additional pages

## Deployment

### Heroku
1. Create a Heroku app
2. Set environment variables
3. Deploy with Git

### Vercel
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

### Netlify
1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `.`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@adventour.com or create an issue on GitHub.

## Acknowledgments

- Design inspired by Airbnb
- Images from Unsplash
- Icons from Font Awesome
- Fonts from Google Fonts

---

**Happy Traveling! 🌍✈️**