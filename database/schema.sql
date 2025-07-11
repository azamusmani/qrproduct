-- Drop existing table to ensure clean schema
DROP TABLE IF EXISTS products;

-- Create simplified Products Table with only code and status
CREATE TABLE products (
  code TEXT PRIMARY KEY,
  status TEXT NOT NULL
);

-- Insert sample data
INSERT INTO products (code, status) VALUES
  ('BC12345', 'In Warehouse'),
  ('BC67890', 'Shipped'),
  ('BC54321', 'Delivered')
ON CONFLICT (code) DO NOTHING; 