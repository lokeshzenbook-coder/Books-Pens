# Deploy Google AI Studio App on an Ubuntu EC2 Instance

This guide explains how to deploy and run a **Google AI Studio** application on an **Ubuntu EC2 instance**.

## Prerequisites

Before you begin, ensure you have:

- An AWS account
- An Ubuntu 22.04 LTS EC2 instance
- An SSH key pair (`.pem` file)
- A GitHub repository containing your AI Studio application
- A Google Gemini API Key

---

# Step 1: Launch an Ubuntu EC2 Instance

### Recommended Configuration

| Setting | Value |
|----------|-------|
| AMI | Ubuntu 22.04 LTS |
| Instance Type | t2.micro (Testing) |
| Storage | 20 GB |
| Public IP | Enabled |

### Security Group

Allow the following inbound rules:

| Type | Port | Purpose |
|------|------|---------|
| SSH | 22 | Remote Access |
| HTTP | 80 | Web Traffic |
| HTTPS | 443 | Secure Web Traffic |
| Custom TCP | 3000 | Node.js Development Server |

---

# Step 2: Connect to the EC2 Instance

```bash
ssh -i mykey.pem ubuntu@<EC2-Public-IP>
```

Example:

```bash
ssh -i aws.pem ubuntu@54.xxx.xxx.xxx
```

---

# Step 3: Update Ubuntu

Update the package repository and upgrade installed packages.

```bash
sudo apt update
sudo apt upgrade -y
```

---

# Step 4: Install Git

Install Git:

```bash
sudo apt install git -y
```

Verify the installation:

```bash
git --version
```

---

# Step 5: Install Node.js (LTS)

Install the latest Node.js LTS version.

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

Verify:

```bash
node -v
npm -v
```

Example:

```text
v22.x.x
10.x.x
```

---

# Step 6: Clone Your AI Studio Project

Clone your GitHub repository.

```bash
git clone https://github.com/<your-username>/<repository>.git
```

Example:

```bash
git clone https://github.com/lokeshzenbook/ai-bookstore.git
```

Move into the project directory.

```bash
cd ai-bookstore
```

---

# Step 7: Install Project Dependencies

Install all required packages.

```bash
npm install
```

This installs all dependencies listed in `package.json`.

---

# Step 8: Configure the Gemini API Key

Create the environment file.

```bash
nano .env.local
```

Add your Gemini API key.

```env
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXX
```

Save the file.

```
CTRL + O
ENTER
CTRL + X
```

Verify the contents.

```bash
cat .env.local
```

---

# Step 9: Start the Application

Run the development server.

```bash
npm run dev
```

Expected output:

```text
Ready in 2.5s

Local: http://localhost:3000
```

---

# Access the Application

If you're connected directly to the EC2 instance:

```
http://localhost:3000
```

If you're accessing the application from your local machine, open:

```
http://<EC2-Public-IP>:3000
```

Example:

```
http://13.xxx.xxx.xxx:3000
```

---

# Troubleshooting

## Port 3000 Not Accessible

Ensure your EC2 Security Group allows inbound traffic on port **3000**.

## Application Not Running

Verify that the Node.js process is running.

```bash
ps -ef | grep node
```

## Check Listening Ports

```bash
sudo ss -tulpn
```

You should see:

```text
0.0.0.0:3000
```

If the application is only listening on `127.0.0.1`, start it using:

```bash
npm run dev -- --host 0.0.0.0
```

---

# Verify Node.js Installation

```bash
node -v
npm -v
```

---

# Project Structure

```text
project/
├── src/
├── public/
├── package.json
├── package-lock.json
├── .env.local
└── README.md
```

---

# Useful Commands

Update Ubuntu

```bash
sudo apt update && sudo apt upgrade -y
```

Install Git

```bash
sudo apt install git -y
```

Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

Clone Repository

```bash
git clone https://github.com/<your-username>/<repository>.git
```

Install Dependencies

```bash
npm install
```

Run Development Server

```bash
npm run dev
```

Check Node Version

```bash
node -v
```

Check NPM Version

```bash
npm -v
```

---

# License

This project is intended for educational and learning purposes. Modify and use it according to your project requirements.
