# Node.js Database Integration Project

This project facilitates seamless data transfer and processing between databases using Node.js, PostgreSQL, and Supabase. It includes various scripts to clean, transfer, and manage data efficiently.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Documentation](#-documentation)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Scripts Overview](#scripts-overview)
- [Contributing](#contributing)
- [License](#license)

---

## 🏗 **Project Structure**

```
nodejs_db/
├── _docs/               # Documentation files
├── src/                 # Application source code
│   ├── scripts/         # Contains various data processing scripts
│   │   ├── IHD_nudge.js
│   │   ├── cleancsv.js
│   │   ├── db1todb2.js
│   │   ├── deleteDuplicates.js
│   │   ├── jsonimage.js
│   │   ├── kxdaNudges.js
│   │   ├── mydbtodatamart.js
│   │   ├── sendDatatodb.js
│   │   ├── sendJsonCsvFiles.js
│   │   ├── test.js
│   │   ├── updateLeads.js
├── .env.example         # Example environment configuration file
├── .gitignore           # Git ignored files
├── .prettierignore      # Prettier ignored files
├── .prettierrc.json     # Prettier formatting config
├── package.json         # Node.js dependencies and metadata
├── package-lock.json    # Dependency lock file
└── README.md            # Project documentation
```

---

## 📚 Documentation

For additional resources and setup guides, refer to:

- [Git Command Guide](_docs/Git%20Command.md) – Useful Git commands for managing the project.
- [Ngrok Setup Guide](_docs/ngrok.md) – Instructions for setting up ngrok to expose local servers.

---

## ✅ **Prerequisites**

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14.x or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

---

## 🛠 **Installation**

### 1. Clone the Repository

```bash
git clone https://github.com/Ujjwal-invact/nodejs_db.git
cd nodejs_db
```

### 2. Install Dependencies

```bash
npm install
```

---

## ⚙ **Configuration**

1. Create an `.env` file by copying `.env.example`:

   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your environment-specific values, such as database credentials and API keys.

---

## 🚀 **Usage**

### 1. Start the Application

```bash
npm start
```

The application will run on `http://localhost:8000` (default port).

### 2. Running in Development Mode

For live-reloading during development, use:

```bash
npm run dev
```

---

## 📜 **Scripts Overview** (Located in `/src/scripts/`)

### **1️⃣ IHD_nudge.js**
- Sends automated nudges (email reminders) using **PostgreSQL** and **Axios** for API calls.
- Uses **IHDEmailTemplate** to format email content.

### **2️⃣ cleancsv.js**
- Reads a CSV file and cleans the data.
- Uses **Papaparse** to parse the CSV file while skipping empty lines.

### **3️⃣ db1todb2.js**
- Transfers data from `db1.leads_collection_2` to `db2.leads_collection` in batches using PostgreSQL.

### **4️⃣ deleteDuplicates.js**
- Identifies and removes duplicate entries from **Supabase** table `leads_collection`.

### **5️⃣ jsonimage.js**
- Generates images from JSON data using **Canvas** and **Node.js**.
- Reads input from a PostgreSQL database.

### **6️⃣ kxdaNudges.js**
- Similar to `IHD_nudge.js` but uses **kxdaEmailTemplate**.
- Sends email nudges with custom templates.

### **7️⃣ mydbtodatamart.js**
- Transfers data from `db1.leads_collection_2` to a data mart database.

### **8️⃣ sendDatatodb.js**
- Reads a CSV file and uploads the data to **Supabase**.
- Cleans and formats the data before insertion.

### **9️⃣ sendJsonCsvFiles.js**
- Reads data from `leads.json` and uploads it to **Supabase**.
- Handles JSON parsing and formatting.

### **🔟 test.js**
- A simple script that logs PostgreSQL connection details from `.env`.

### **1️⃣1️⃣ updateLeads.js**
- Updates the `is_converted` column in `db1.leads_collection_google_form` based on matching email/phone from `students` table.

---

## 🛠 **Contributing**

We welcome contributions! To contribute:

1. Fork the repository.
2. Create a new branch:  
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes:  
   ```bash
   git commit -m "Add your feature"
   ```
4. Push to your branch:  
   ```bash
   git push origin feature/your-feature
   ```
5. Create a Pull Request.

---

## 📜 **License**

This project is licensed under the [MIT License](LICENSE).

---

## 📞 **Contact**

For questions or discussions, feel free to reach out or open an issue.

---
