# AI Integration Setup Guide 🤖

## Overview
ChatBuddy includes AI-powered study assistance using OpenAI models.  
This guide explains how to configure and safely use the AI features.

---

## Prerequisites
- Node.js installed
- OpenAI account
- OpenAI API key (from the OpenAI dashboard)

---

## Setup Steps

### 1. Install Dependencies
All required AI-related packages are already installed in the project.

---

### 2. Get an OpenAI API Key
1. Visit the OpenAI platform dashboard
2. Sign up or log in to your account
3. Go to the **API Keys** section
4. Create a new API key
5. Copy the generated key and keep it secure

---

### 3. Environment Configuration
Create a `.env` file in the root directory of your project:

```bash
# OpenAI API Configuration
VITE_OPENAI_API_KEY=YOUR_OPENAI_API_KEY_HERE