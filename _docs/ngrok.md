# Ngrok Installation and Setup Guide

## What is Ngrok?
Ngrok is a reverse proxy tool that allows you to expose local servers to the public internet securely. It is widely used for testing webhooks, debugging APIs, and remote access to local applications.

---

## Step 1: Install Ngrok
### **For Windows:**
1. Download Ngrok from the official website: [https://ngrok.com/download](https://ngrok.com/download)
2. Extract the downloaded ZIP file.
3. Move the `ngrok.exe` file to a directory (e.g., `C:\ngrok`).
4. Open **Command Prompt** and navigate to the ngrok directory:
   ```sh
   cd C:\ngrok
   ```

### **For macOS & Linux:**
1. Open a terminal and run:
   ```sh
   brew install ngrok/ngrok/ngrok  # macOS (Homebrew)
   ```
   ```sh
   sudo snap install ngrok  # Linux (Snap)
   ```
2. Alternatively, download the binary from the [official website](https://ngrok.com/download) and move it to `/usr/local/bin`.

### **For Debian-based Systems (Ubuntu, etc.):**
```sh
wget https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-linux-amd64.zip
unzip ngrok-stable-linux-amd64.zip
sudo mv ngrok /usr/local/bin/
```

---

## Step 2: Setup Ngrok Authentication
Before using Ngrok, you must authenticate your account.
1. Sign up on [https://dashboard.ngrok.com/signup](https://dashboard.ngrok.com/signup)
2. Log in and get your authentication token from [https://dashboard.ngrok.com/get-started/your-authtoken](https://dashboard.ngrok.com/get-started/your-authtoken)
3. Run the following command to add your auth token:
   ```sh
   ngrok config add-authtoken YOUR_AUTH_TOKEN
   ```

---

## Step 3: Create an Ngrok Tunnel
To expose a local server (e.g., running on port 8000), run:
```sh
ngrok http 8000
```
This will generate a public URL that forwards requests to your local machine.

### **Common Use Cases:**
- **Expose a local web server:**
  ```sh
  ngrok http 8080
  ```
- **Expose an HTTPS server:**
  ```sh
  ngrok http --url=camel-honest-adder.ngrok-free.app 8000

  <!-- https://camel-honest-adder.ngrok-free.app/ -->
  ```
- **Expose a TCP server (useful for SSH):**
  ```sh
  ngrok tcp 22
  ```

---

## Step 4: Use the Public URL
After running Ngrok, you will see an output like:
```
Forwarding    http://randomsubdomain.ngrok.io -> http://localhost:8000
```
Use this public URL to test webhooks, remote access, or API calls.

---

## Step 5: Stop the Tunnel
To stop Ngrok, simply press `CTRL + C` in the terminal.

---

## Additional Features
- **Custom Subdomains (for paid users)**
  ```sh
  ngrok http -subdomain=mycustomname 8000
  ```
- **View Traffic Requests**
  Open `http://127.0.0.1:4040` in your browser to inspect traffic logs.

---

## Troubleshooting
1. **Command not found?** Ensure Ngrok is installed and in your system’s PATH.
2. **Tunnel fails to start?** Check if your local service is running and listening on the specified port.
3. **403 Forbidden?** Some websites block Ngrok domains; try a custom subdomain or paid plan.

---

## Conclusion
Ngrok is a powerful tool for developers to expose local applications securely to the internet. Follow the steps above to set up and start using Ngrok efficiently!