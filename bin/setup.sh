#!/usr/bin/env bash

## bash bin/setup.sh

set -e

echo "== MedFlow Setup =="

cd backend

#create .venv 
if [! -d ".venv"]; then
    echo "Creating Virtual Environment..."
    python -m venv .venv
fi

source .venv/Scripts/activate
pip install -r requirements.txt

#create .env 
if [! -f ".env"]; then
    echo "No .env found - copying from .env.example."
    echo "Fill in real values in backend/.env before running the app."
    cp .env.example .env
fi

#Frontend setup
cd ../frontend
npm install

echo "Setup complete"