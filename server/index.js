import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import QRCode from 'qrcode';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://uczcvanaxxvbslesjwvd.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjemN2YW5heHh2YnNsZXNqd3ZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNTIzNTgsImV4cCI6MjA2NzgyODM1OH0.F2l4aqo6d8m7PMeZHKqyy_6niv0St7d6ee9IdNg3nTw';

const supabase = createClient(supabaseUrl, supabaseKey);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Quick Product Check API is running!' });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get product by code
app.get('/api/products/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('code', code)
      .single();
    
    if (error) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new product
app.post('/api/products', async (req, res) => {
  try {
    const { code, status } = req.body;
    
    if (!code || !status) {
      return res.status(400).json({ error: 'Product code and status are required' });
    }
    
    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          code,
          status
        }
      ])
      .select()
      .single();
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.status(201).json({ 
      message: 'Product added successfully',
      data 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update product status
app.put('/api/products/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    
    const { data, error } = await supabase
      .from('products')
      .update({
        status
      })
      .eq('code', code)
      .select()
      .single();
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json({ 
      message: 'Product updated successfully',
      data 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete product
app.delete('/api/products/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('code', code);
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate QR code for product
app.get('/api/products/:code/qr', async (req, res) => {
  try {
    const { code } = req.params;
    
    // First check if the product exists in the database
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('code', code)
      .single();
    
    if (productError || !product) {
      return res.status(404).json({ error: 'Product not found. Please add the product first.' });
    }
    
    // Use environment variable for production URL, fallback to localhost for development
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:8081';
    const productUrl = `${baseUrl}/status/${code}`;
    
    // Generate QR code as data URL
    const qrDataUrl = await QRCode.toDataURL(productUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    res.json({ 
      qrCode: qrDataUrl,
      url: productUrl,
      productCode: code,
      productStatus: product.status
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API test: http://localhost:${PORT}/api/test-supabase`);
}); 