# Espresso Emporium Server

This is the server for the Espresso Emporium application. It is built using Node.js, Express, and MongoDB.

## Prerequisites

- Node.js
- npm (Node Package Manager)
- MongoDB

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/espresso-emporium-server.git
    cd espresso-emporium-server
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add your MongoDB credentials:
    ```env
    PORT=5000
    DB_USER=your_db_user
    DB_PASS=your_db_password
    ```

## Running the Server

To start the server, run:
```sh
npm start