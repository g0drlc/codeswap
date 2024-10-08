#!/bin/bash

# Navigate to the project directory
cd /var/www/swap.code0x.io

# Pull the latest changes from the repository
git pull origin main

# Install dependencies and build the project
yarn install
yarn run build

# Restart your application (assuming you're using PM2)
pm2 restart codeswap
