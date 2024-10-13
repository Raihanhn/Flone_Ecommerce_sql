const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const WebSocket = require("ws");
const http = require("http");
const bodyParser = require("body-parser");
const app = express();
const port = 3001;

const bcrypt = require("bcrypt");

app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Create connection to the MySQL database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "flone",
});

db.connect();

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Create a new product
app.post("/api/product", upload.single("image"), (req, res) => {
  const { name, categories, price, details } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  const query =
    "INSERT INTO product (name, categories, image, price, details) VALUES (?, ?, ?, ?, ?)";
  const values = [name, categories, image, price, details];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error creating product:", err);
      res.status(500).send("Error creating product");
      return;
    }
    res.status(201).send("Product created successfully");
    broadcastData(); // Broadcast data after creating a product
  });
});

// Get all categories
app.get("/api/categories", (req, res) => {
  const sql = "SELECT * FROM cat";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching categories:", err);
      res.status(500).send("Server error");
      return;
    }
    res.json(results);
    broadcastData(); // Broadcast data after fetching categories
  });
});

// Get products by category
app.get("/api/products/:categoryId", (req, res) => {
  const categoryId = req.params.categoryId;
  db.query(
    "SELECT * FROM product WHERE categories = ?",
    [categoryId],
    (err, results) => {
      if (err) {
        console.error("Error fetching products:", err);
        res.status(500).send("Error fetching products");
        return;
      }
      res.json(results);
      broadcastData(); // Broadcast data after fetching products by category
    }
  );
});

// Get a single product by ID
app.get("/api/product/:productId", (req, res) => {
  const productId = req.params.productId;
  db.query(
    "SELECT * FROM product WHERE ID = ?",
    [productId],
    (err, results) => {
      if (err) {
        console.error("Error fetching product:", err);
        res.status(500).send("Error fetching product");
        return;
      }
      if (results.length === 0) {
        res.status(404).send("Product not found");
        return;
      }
      res.json(results[0]);
      broadcastData(); // Broadcast data after fetching all products
    }
  );
});

// Get all products
app.get("/api/products", (req, res) => {
  db.query("SELECT * FROM product", (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      res.status(500).send("Server error");
      return;
    }
    res.json(results);
    broadcastData(); // Broadcast data after fetching all products
  });
});

// User registration
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;

  // Check if the email is already registered
  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.error("Error checking for existing user:", err);
        res.status(500).send("Server error");
        return;
      }

      if (results.length > 0) {
        res.status(400).send("User already exists");
        return;
      }

      // Hash the password before storing
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert the new user into the database
      db.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword],
        (err, result) => {
          if (err) {
            console.error("Error registering user:", err);
            res.status(500).send("Error registering user");
            return;
          }
          res.status(201).send("User registered successfully");
        }
      );
    }
  );
});

// User login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.error("Error fetching user:", err);
        res.status(500).send("Server error");
        return;
      }

      if (results.length === 0) {
        res.status(400).send("User not found");
        return;
      }

      const user = results[0];

      // Compare the provided password with the hashed password in the database
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        res.status(400).send("Incorrect password");
        return;
      }

      res
        .status(200)
        .json({ userId: user.ID, name: user.name, email: user.email });
    }
  );
});

app.get("/api/user/:userId", (req, res) => {
  const userId = req.params.userId;

  db.query(
    "SELECT ID, name, email FROM users WHERE id = ?",
    [userId],
    (err, results) => {
      if (err) {
        console.error("Error fetching user:", err);
        res.status(500).send("Server error");
        return;
      }

      if (results.length === 0) {
        res.status(404).send("User not found");
        return;
      }

      const user = results[0];
      res.status(200).json(user);
    }
  );
});

// Update user details
app.put("/api/user/:userId", (req, res) => {
  const { userId } = req.params;
  const { name, email } = req.body;
  const query = "UPDATE users SET name = ?, email = ? WHERE ID = ?";
  db.query(query, [name, email, userId], (err) => {
    if (err) {
      console.error("Error updating user data:", err);
      res.status(500).send("Error updating user data");
      return;
    }
    res.status(200).send("User data updated successfully");
  });
});

// Get cart items for a user
app.get("/api/cart/:userId", (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT p.*, c.quantity FROM product p
    JOIN cart c ON p.ID = c.product_id
    WHERE c.user_id = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching cart items:", err);
      res.status(500).send("Server error");
      return;
    }
    res.json(results);
  });
});

// Clear all cart items for a specific user
app.delete("/api/cart/:userId", (req, res) => {
  const userId = req.params.userId;

  const query = `
    DELETE FROM cart WHERE user_id = ?
  `;

  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Error clearing cart:", err);
      res.status(500).send("Error clearing cart");
      return;
    }
    res.status(200).send("Cart cleared successfully");
  });
});

// Add to cart
app.post("/api/cart", (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  const query = `
    INSERT INTO cart (user_id, product_id, quantity)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE quantity = quantity + ?
  `;

  db.query(query, [user_id, product_id, quantity, quantity], (err, result) => {
    if (err) {
      console.error("Error adding to cart:", err);
      res.status(500).send("Error adding to cart");
      return;
    }
    res.status(200).send("Product added to cart");
  });
});

// Update cart quantity
app.put("/api/cart", (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  const query = `
    UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?
  `;

  db.query(query, [quantity, user_id, product_id], (err, result) => {
    if (err) {
      console.error("Error updating cart quantity:", err);
      res.status(500).send("Error updating cart quantity");
      return;
    }
    res.status(200).send("Cart quantity updated");
  });
});

// Remove from cart
app.delete("/api/cart", (req, res) => {
  const { user_id, product_id } = req.body;

  const query = `
    DELETE FROM cart WHERE user_id = ? AND product_id = ?
  `;

  db.query(query, [user_id, product_id], (err, result) => {
    if (err) {
      console.error("Error removing from cart:", err);
      res.status(500).send("Error removing from cart");
      return;
    }
    res.status(200).send("Product removed from cart");
  });
});

//Individual user myorder page
app.get("/api/orders/:userId", (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT 
        u.name AS userName,
        u.address,
        u.city,
        u.zip,
        u.country,
        p.name AS productName,
        c.quantity,
        c.oid,
        c.payment_type,
        (p.price * c.quantity) AS total
    FROM 
        users u
    JOIN 
        cart c ON u.ID = c.user_id
    JOIN 
        product p ON c.product_id = p.ID
    WHERE 
        c.status = 2 AND u.ID = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching orders:", err);
      res.status(500).send("Server error");
      return;
    }
    res.json(results);
  });
});

// Get specific order for a user by order ID
app.get("/api/orders/:userId/:oid", (req, res) => {
  const { userId, oid } = req.params;

  const query = `
    SELECT 
        u.name AS userName,
        u.address,
        u.city,
        u.zip,
        u.country,
        p.name AS productName,
        c.quantity,
        c.oid,
        c.payment_type,
        (p.price * c.quantity) AS total
    FROM 
        users u
    JOIN 
        cart c ON u.ID = c.user_id
    JOIN 
        product p ON c.product_id = p.ID
    WHERE 
        c.status = 2 AND u.ID = ? AND c.oid = ?
  `;

  db.query(query, [userId, oid], (err, results) => {
    if (err) {
      console.error("Error fetching order:", err);
      res.status(500).send("Server error");
      return;
    }
    if (results.length === 0) {
      res.status(404).send("Order not found");
      return;
    }
    res.json(results[0]);
  });
});

app.post("/api/checkout", (req, res) => {
  const { userId, address, city, zip, country, paymentMethod } = req.body;

  // Update user details
  const updateUserQuery = `
    UPDATE users
    SET address = ?, city = ?, zip = ?, country = ?
    WHERE ID = ?
  `;

  db.query(
    updateUserQuery,
    [address, city, zip, country, userId],
    (err, result) => {
      if (err) {
        console.error("Error updating user details:", err);
        res.status(500).send("Error updating user details");
        return;
      }

      // Generate order ID
      const orderId = `${userId}-${Date.now()}`;

      // Update cart status and set order ID and payment type
      const updateCartQuery = `
      UPDATE cart
      SET status = 2, oid = ?, payment_type = ?
      WHERE user_id = ? AND status = 1
    `;

      db.query(
        updateCartQuery,
        [orderId, paymentMethod, userId],
        (err, result) => {
          if (err) {
            console.error("Error updating cart:", err);
            res.status(500).send("Error updating cart");
            return;
          }

          res.status(200).send("Order placed successfully");
        }
      );
    }
  );
});

// Get all users
app.get("/api/users", (req, res) => {
  db.query("SELECT ID, name, email FROM users", (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      res.status(500).send("Server error");
      return;
    }
    res.json(results);
  });
});

// Get all orders
app.get("/api/orders", (req, res) => {
  const query = `
    SELECT 
        u.name AS userName,
        u.address,
        u.city,
        u.zip,
        u.country,
        p.name AS productName,
        c.quantity,
        c.oid,
        c.payment_type,
        (p.price * c.quantity) AS total
    FROM 
        users u
    JOIN 
        cart c ON u.ID = c.user_id
    JOIN 
        product p ON c.product_id = p.ID
    WHERE 
        c.status = 2
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching orders:", err);
      res.status(500).send("Server error");
      return;
    }
    res.json(results);
  });
});

//Live update from database
const broadcastData = () => {
  const queries = ["SELECT * FROM cat", "SELECT * FROM product"];

  Promise.all(
    queries.map(
      (query) =>
        new Promise((resolve, reject) => {
          db.query(query, (error, result) => {
            if (error) return reject(error);
            resolve(result);
          });
        })
    )
  )
    .then(([cats, products]) => {
      const combinedResult = { cats, products };
      const jsonData = JSON.stringify(combinedResult);

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(jsonData);
        }
      });
    })
    .catch((error) => {
      console.error("Error querying the database:", error);
    });
};

// Periodically broadcast data to all connected clients
setInterval(broadcastData, 10000); // Adjust the interval as needed

// Start the server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
