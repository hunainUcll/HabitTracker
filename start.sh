#!/bin/bash
echo "Starting Hunain Tracker..."
cd "$(dirname "$0")/backend"
node server.js &
echo "Open http://localhost:3000 in your browser"
