#!/bin/bash

echo "=== Quick Admin Setup ==="
echo "This script will create an admin user directly in the database"
echo ""

# Default values
DEFAULT_EMAIL="admin@company.com"
DEFAULT_PASSWORD="admin123"

echo "Enter admin email (or press Enter for default: $DEFAULT_EMAIL):"
read -r EMAIL
EMAIL=${EMAIL:-$DEFAULT_EMAIL}

echo "Enter admin password (or press Enter for default: $DEFAULT_PASSWORD):"
read -s PASSWORD
PASSWORD=${PASSWORD:-$DEFAULT_PASSWORD}

echo ""
echo "Enter admin name (optional, press Enter to skip):"
read -r NAME

echo ""
echo "Creating admin user..."
echo "Email: $EMAIL"
echo "Name: ${NAME:-"Not provided"}"

if [ -n "$NAME" ]; then
    node create-admin.js "$EMAIL" "$PASSWORD" "$NAME"
else
    node create-admin.js "$EMAIL" "$PASSWORD"
fi

echo ""
echo "=== Setup Complete ==="
echo "You can now login at: http://localhost:3000/admin/login"