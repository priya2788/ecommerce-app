const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT ||  80;

// Simulate a database with an array of products
let products = [
  { id: 1, name: 'Laptop', price: 999.89, image: 'laptop.jpg' },
  { id: 2, name: 'Smartphone', price: 699.99, image: 'smartphone.jpg' },
  { id: 3, name: 'Headphones', price: 199.99, image: 'headphones.jpg' }
];

// Simulate a cart (in-memory)
let cart = [];

// Serve static files like images, CSS, etc.
app.use(express.static(path.join(__dirname, 'public')));
let viewsPath;
if (process.env.NODE_ENV === 'production') {
  viewsPath = '/var/app/current/views';  // Elastic Beanstalk default path
} else {
  viewsPath = path.join(__dirname, 'views');  // Local development path
}

// Set the views folder path dynamically
app.set('views', viewsPath);
// Set EJS as the view engine
app.set('view engine', 'ejs');

// Home route to display products
app.get('/', (req, res) => {
  res.render('index', { products });
});

// Route to view individual product details
app.get('/product/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).send('Product not found');
  }

  res.render('product', { product });
});

// Route to add a product to the cart
app.get('/add-to-cart/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).send('Product not found');
  }

  cart.push(product);
  res.redirect('/cart');
});

// Route to view the cart
app.get('/cart', (req, res) => {
  const total = cart.reduce((sum, product) => sum + product.price, 0);
  res.render('cart', { cart, total });
});

// Route to checkout (just a dummy route for now)
app.get('/checkout', (req, res) => {
  res.send('<h1>Checkout Page</h1><p>Your order has been placed.</p>');
});

// 404 handler
app.use((req, res) => {
  res.status(404).send('<h1>404 Page Not Found</h1>');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
