const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.'));

// Email configuration
const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
    }
});

// Sample data for packages
const packages = [
    {
        id: 1,
        title: 'Luxury Beach Villa',
        location: 'Goa, India',
        price: 2700,
        rating: 4.8,
        reviews: 124,
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        type: 'beach',
        category: 'beach',
        amenities: ['WiFi', 'Pool', 'Parking', 'Kitchen']
    },
    {
        id: 2,
        title: 'Mountain Cabin Retreat',
        location: 'Kashmir, India',
        price: 4999,
        rating: 4.6,
        reviews: 89,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        type: 'mountain',
        category: 'mountain',
        amenities: ['WiFi', 'Fireplace', 'Parking', 'Mountain View']
    },
    {
        id: 3,
        title: 'Modern City Apartment',
        location: 'Mumbai, India',
        price: 9999,
        rating: 4.9,
        reviews: 156,
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        type: 'city',
        category: 'city',
        amenities: ['WiFi', 'Gym', 'Parking', 'City View']
    },
    {
        id: 4,
        title: '5-Star Luxury Resort',
        location: 'Dubai, UAE',
        price: 30000,
        rating: 4.9,
        reviews: 203,
        image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        type: 'luxury',
        category: 'luxury',
        amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Concierge']
    },
    {
        id: 5,
        title: 'Charming Paris Apartment',
        location: 'Paris, France',
        price: 47500,
        rating: 4.8,
        reviews: 167,
        image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        type: 'city',
        category: 'city',
        amenities: ['WiFi', 'Kitchen', 'Historic Building', 'City Center']
    },
    {
        id: 6,
        title: 'Tropical Villa',
        location: 'Bali, Indonesia',
        price: 37700,
        rating: 4.7,
        reviews: 98,
        image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        type: 'beach',
        category: 'beach',
        amenities: ['WiFi', 'Pool', 'Garden', 'Ocean View']
    },
    {
        id: 8,
        title: 'Kerala Backwater Villa',
        location: 'Kerala, India',
        price: 12000,
        rating: 4.9,
        reviews: 134,
        image: 'https://images.unsplash.com/photo-1571983823232-07e8610c35a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        type: 'nature',
        category: 'nature',
        amenities: ['WiFi', 'Garden', 'Boat Access', 'River View']
    },
    {
        id: 11,
        title: 'Luxury Mumbai Apartment',
        location: 'Mumbai, India',
        price: 8500,
        rating: 4.6,
        reviews: 89,
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        type: 'city',
        category: 'city',
        amenities: ['WiFi', 'Gym', 'Parking', 'City View']
    },
    {
        id: 14,
        title: 'Historic City Center Hotel',
        location: 'Istanbul, Turkey',
        price: 18500,
        rating: 4.6,
        reviews: 98,
        image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        type: 'historic',
        category: 'historic',
        amenities: ['WiFi', 'Historic Building', 'City Center', 'Restaurant']
    },
    {
        id: 15,
        title: 'Burj Khalifa View Suite',
        location: 'Dubai, UAE',
        price: 45000,
        rating: 4.9,
        reviews: 203,
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        type: 'luxury',
        category: 'luxury',
        amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Luxury View']
    },
    {
        id: 16,
        title: 'Private Beach Villa',
        location: 'Bali, Indonesia',
        price: 25000,
        rating: 4.7,
        reviews: 156,
        image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        type: 'tropical',
        category: 'tropical',
        amenities: ['WiFi', 'Pool', 'Beach Access', 'Garden']
    }
];

// Routes

// Get all packages
app.get('/api/packages', (req, res) => {
    const { type, category, minPrice, maxPrice, location } = req.query;
    let filteredPackages = [...packages];

    if (type && type !== 'all') {
        filteredPackages = filteredPackages.filter(pkg => pkg.type === type);
    }

    if (category && category !== 'all') {
        filteredPackages = filteredPackages.filter(pkg => pkg.category === category);
    }

    if (minPrice) {
        filteredPackages = filteredPackages.filter(pkg => pkg.price >= parseInt(minPrice));
    }

    if (maxPrice) {
        filteredPackages = filteredPackages.filter(pkg => pkg.price <= parseInt(maxPrice));
    }

    if (location) {
        filteredPackages = filteredPackages.filter(pkg => 
            pkg.location.toLowerCase().includes(location.toLowerCase())
        );
    }

    res.json(filteredPackages);
});

// Get package by ID
app.get('/api/packages/:id', (req, res) => {
    const packageId = parseInt(req.params.id);
    const package = packages.find(pkg => pkg.id === packageId);
    
    if (!package) {
        return res.status(404).json({ error: 'Package not found' });
    }
    
    res.json(package);
});

// Search packages
app.get('/api/search', (req, res) => {
    const { q, type, minPrice, maxPrice } = req.query;
    let filteredPackages = [...packages];

    if (q) {
        filteredPackages = filteredPackages.filter(pkg => 
            pkg.title.toLowerCase().includes(q.toLowerCase()) ||
            pkg.location.toLowerCase().includes(q.toLowerCase())
        );
    }

    if (type && type !== 'all') {
        filteredPackages = filteredPackages.filter(pkg => pkg.type === type);
    }

    if (minPrice) {
        filteredPackages = filteredPackages.filter(pkg => pkg.price >= parseInt(minPrice));
    }

    if (maxPrice) {
        filteredPackages = filteredPackages.filter(pkg => pkg.price <= parseInt(maxPrice));
    }

    res.json(filteredPackages);
});

// Submit booking
app.post('/api/booking', async (req, res) => {
    try {
        const bookingData = req.body;
        
        // Validate required fields
        const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'checkIn', 'checkOut', 'guests'];
        for (const field of requiredFields) {
            if (!bookingData[field]) {
                return res.status(400).json({ error: `Missing required field: ${field}` });
            }
        }

        // Generate booking ID
        const bookingId = 'ADV' + Date.now().toString().slice(-6);
        
        // Send confirmation email
        const mailOptions = {
            from: process.env.EMAIL_USER || 'your-email@gmail.com',
            to: bookingData.email,
            subject: 'Booking Confirmation - Adventour',
            html: `
                <h2>Booking Confirmed!</h2>
                <p>Dear ${bookingData.firstName} ${bookingData.lastName},</p>
                <p>Your booking has been confirmed with the following details:</p>
                <ul>
                    <li><strong>Booking ID:</strong> ${bookingId}</li>
                    <li><strong>Check-in:</strong> ${bookingData.checkIn}</li>
                    <li><strong>Check-out:</strong> ${bookingData.checkOut}</li>
                    <li><strong>Guests:</strong> ${bookingData.guests}</li>
                    <li><strong>Rooms:</strong> ${bookingData.rooms || '1'}</li>
                </ul>
                <p>Thank you for choosing Adventour!</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            bookingId: bookingId,
            message: 'Booking confirmed successfully'
        });

    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({ error: 'Failed to process booking' });
    }
});

// Newsletter subscription
app.post('/api/newsletter', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Send welcome email
        const mailOptions = {
            from: process.env.EMAIL_USER || 'your-email@gmail.com',
            to: email,
            subject: 'Welcome to Adventour Newsletter!',
            html: `
                <h2>Welcome to Adventour!</h2>
                <p>Thank you for subscribing to our newsletter. You'll receive the latest travel deals and destination inspiration.</p>
                <p>Happy travels!</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            message: 'Successfully subscribed to newsletter'
        });

    } catch (error) {
        console.error('Newsletter error:', error);
        res.status(500).json({ error: 'Failed to subscribe to newsletter' });
    }
});

// Contact form submission
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Send contact email
        const mailOptions = {
            from: process.env.EMAIL_USER || 'your-email@gmail.com',
            to: process.env.EMAIL_USER || 'your-email@gmail.com',
            subject: `Contact Form: ${subject}`,
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            message: 'Message sent successfully'
        });

    } catch (error) {
        console.error('Contact error:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// Get locations
app.get('/api/locations', (req, res) => {
    const locations = [
        { name: 'Kashmir', country: 'India', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
        { name: 'Istanbul', country: 'Turkey', image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
        { name: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
        { name: 'Bali', country: 'Indonesia', image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
        { name: 'Dubai', country: 'UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
        { name: 'Geneva', country: 'Switzerland', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' }
    ];
    
    res.json(locations);
});

// Serve static files
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`API endpoints available at http://localhost:${PORT}/api/`);
});

module.exports = app;


