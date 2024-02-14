const express = require('express');
const BOOKS = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
    //Write your code here
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    if (isValid(username)) {
        return res.status(409).json({ message: "Username already exists. Choose a different username." });
    }

    // Add the new user to the users list
    users.push({ username, password });

    return res.status(201).json({ message: "User registered successfully." });
    // return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    //Write your code here

    // const books = bookList;
    const books = BOOKS;

    // Display the book list using JSON.stringify for neat formatting
    const formattedBooks = JSON.stringify(books, null, 2); // 2 spaces for indentation

    res.setHeader('Content-Type', 'application/json');
    // return res.status(200).json({ message: "Books returned", books: formattedBooks });
    return res.status(200).json({ books: formattedBooks });
});

// Get the book list available in the shop using async-await with Axios
public_users.get('/async', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5000/');
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books from the API', error: error.message });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    // Retrieve ISBN from the request parameters
    const isbn = req.params.isbn;

    // Find the book with the matching ISBN
    const book = Object.values(BOOKS).find(book => book.isbn === isbn);

    if (!book) {
        // If no book is found, return a 404 Not Found response
        return res.status(404).json({ message: 'Book not found for the given ISBN' });
    }

    // Display the book details using JSON.stringify for neat formatting
    const formattedBookDetails = JSON.stringify(book, null, 2); // 2 spaces for indentation

    // Send the formatted book details as a JSON response
    return res.status(200).json({ book: formattedBookDetails });
});

// Get book details based on ISBN using async-await with Axios
public_users.get('/async/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(404).json({ message: 'Book not found', error: error.message });
    }
});

// Get the book list available in the shop using Promise callbacks
public_users.get('/async/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  axios.get(`http://localhost:5000/isbn/${isbn}`)
      .then(response => {
          res.status(200).json(response.data);
      })
      .catch(error => {
          res.status(500).json({ message: 'Error fetching book details', error: error.message });
      });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    // Retrieve author from the request parameters
    const author = req.params.author;

    const bookList = BOOKS;

    // Find books with the matching author
    const matchingBooks = Object.values(bookList).find(book => book.author === author);

    if (!matchingBooks) {
        // If no books are found, return a 404 Not Found response
        return res.status(404).json({ message: 'No books found for the given author' });
    }

    // Display the matching books' details using JSON.stringify for neat formatting
    const formattedMatchingBooks = JSON.stringify(matchingBooks, null, 2); // 2 spaces for indentation

    // Send the formatted matching books' details as a JSON response
    return res.status(200).json({ books: formattedMatchingBooks });
});

// Get book details based on author using async-await with Axios
public_users.get('/async/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(404).json({ message: 'No books found for the given author', error: error.message });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    // Retrieve author from the request parameters
    const title = req.params.title;
    const bookList = BOOKS;

    // Find books with the matching title
    const matchingBooks = Object.values(bookList).find(book => book.title === title);

    if (!matchingBooks) {
        // If no books are found, return a 404 Not Found response
        return res.status(404).json({ message: 'No books found having given title' });
    }

    // Display the matching books' details using JSON.stringify for neat formatting
    const formattedMatchingBooks = JSON.stringify(matchingBooks, null, 2); // 2 spaces for indentation

    // Send the formatted matching books' details as a JSON response
    return res.status(200).json({ books: formattedMatchingBooks });
});

// Get all books based on title using async-await with Axios
public_users.get('/async/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(404).json({ message: 'No books found with the given title', error: error.message });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    // Retrieve ISBN from the request parameters
    const isbn = req.params.isbn;
    const bookList = BOOKS;

    // Find the book with the matching ISBN
    const matchingBooks = Object.values(bookList).find(book => book.isbn === isbn);

    if (!matchingBooks) {
        // If no book is found, return a 404 Not Found response
        return res.status(404).json({ message: 'Book not found for the given ISBN' });
    }

    // Display the reviews using JSON.stringify for neat formatting
    const formattedReviews = JSON.stringify(matchingBooks.reviews, null, 2); // 2 spaces for indentation

    // Send the formatted reviews as a JSON response
    return res.status(200).json({ reviews: formattedReviews });
});

module.exports.general = public_users;
