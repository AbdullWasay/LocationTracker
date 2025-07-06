#!/usr/bin/env node

// Railway-specific startup script
const fs = require('fs');
const path = require('path');

// Ensure tmp directory exists for production database
if (process.env.NODE_ENV === 'production') {
    const tmpDir = '/tmp';
    if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
        console.log('Created /tmp directory for production database');
    }
}

// Start the main server
require('./server.js');
