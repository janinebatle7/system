-- Database for Pinoy Kakanin Reservation and Ordering System
CREATE DATABASE IF NOT EXISTS kakanin_db;
USE kakanin_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role ENUM('admin', 'customer') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Kakanin Products Table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    category VARCHAR(50),
    stock INT DEFAULT 0
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'preparing', 'delivered', 'cancelled') DEFAULT 'pending',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,
    price_at_time DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Reservations Table
CREATE TABLE IF NOT EXISTS reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    pax INT NOT NULL,
    special_requests TEXT,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Seed Data for Kakanin
INSERT INTO products (name, description, price, image_url, category) VALUES
('Bibingka Special', 'Rice cake topped with salted egg and cheese.', 120.00, 'https://images.unsplash.com/photo-1621245033771-e14766e413ee?q=80&w=500', 'Baked'),
('Puto Bumbong', 'Purple rice cake steamed in bamboo tubes.', 85.00, 'https://images.unsplash.com/photo-1601050633722-6fb68202d090?q=80&w=500', 'Steamed'),
('Sapin-Sapin', 'Layered glutinous rice and coconut milk cake.', 150.00, 'https://images.unsplash.com/photo-1596797038530-2c39da82b641?q=80&w=500', 'Sticky Rice'),
('Kutsinta', 'Brown rice cake served with grated coconut.', 60.00, 'https://images.unsplash.com/photo-1621245033771-e14766e413ee?q=80&w=500', 'Steamed'),
('Cassava Cake', 'Baked cassava with creamy custard topping.', 180.00, 'https://images.unsplash.com/photo-1596797038530-2c39da82b641?q=80&w=500', 'Baked');
