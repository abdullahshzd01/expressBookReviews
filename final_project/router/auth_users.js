const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    { username: "john_doe", password: "password123" },
    { username: "alice_smith", password: "securePass456" },
    { username: "bob_jenkins", password: "mySecretPwd" },
    { username: "emily_green", password: "hiddenKey789" },
    { username: "mike_wilson", password: "strongPass!23" }
];

const isValid = (username) => { //returns boolean
    // Check if the username exists in the users list
    const userExists = users.some(user => user.username === username);
    return userExists;
}

const authenticatedUser = (username, password) => { //returns boolean
    const user = users.find(user => user.username === username && user.password === password);
    return !!user;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if the user is registered
    if (!isValid(username)) {
        return res.status(401).json({ message: "Invalid username" });
    }

    // Check if the provided credentials are valid
    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ sub: username }, 'SECRET_KEY', { expiresIn: '1h' });

    // Save the token in the session or send it in the response, as per your application's needs
    req.session.token = token;
    req.session.username = username;
    
    // For simplicity, sending it in the response here
    res.status(200).json({ message: "Login successful", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const { review, rating } = req.body;
    const username = req.session.username;

    const book = Object.values(books).find(book => book.isbn === isbn);

    // Check if the ISBN exists in the books database
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user has already posted a review for the same ISBN
    if (book.reviews && book.reviews[username]) {
        // If the user has already reviewed, modify the existing review
        book.reviews[username].comment = review;
    } else {
        // If the user hasn't reviewed, add a new review
        if (!book.reviews) {
            book.reviews = {};
        }

        book.reviews[username] = {user: username, rating: rating,  comment: review };
    }

    return res.status(200).json({ message: `Review for book with ISBN ${isbn} added/modified successfully!` });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn; // ISBN from URL
    const username = req.session.username; // Username from session

    const book = Object.values(books).find(book => book.isbn === isbn);

    // Check if the ISBN exists in the books database
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    // // Find the book by ISBN
    let reviewDeleted = false;

    // Iterate over reviews to find and delete the user's review
    Object.keys(book.reviews).forEach(reviewId => {
        const review = book.reviews[reviewId];
        if (review.user === username) {
            delete book.reviews[reviewId];
            reviewDeleted = true;
        }
    });

    if (!reviewDeleted) {
        res.status(404).send({ success: false, message: "Review not found or you do not have permission to delete this review." });
    }
    
    res.send({ success: true, message: "Review deleted successfully." });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
