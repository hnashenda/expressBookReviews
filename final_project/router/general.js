const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//let users = []

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Check if the user with the given username and password exists
const authenticatedUser = (username, password) => {
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});

});

// Get the book list available in the shop
/*public_users.get('/',function (req, res) {  
   res.send(JSON.stringify(books, null, 2)); // Neat JSON output
});*/


// Function to get books data as a Promise
function getBooks() {
    return new Promise((resolve, reject) => {
        if (books) {
            resolve(books);
        } else {
            reject("Books data not found");
        }
    });
}

// Get the book list available in the shop using Promises
public_users.get('/', (req, res) => {
    getBooks()
        .then(data => {
            res.send(JSON.stringify(data, null, 2)); // Neat JSON output
        })
        .catch(error => {
            res.status(500).json({ message: "Error fetching books data", error: error });
        });
});



// Get book details based on ISBN
/*public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    res.send(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
 });*/
 
 // Function to get a book by ISBN as a Promise
function getBookByISBN(isbn) {
    return new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
            resolve(book);
        } else {
            reject("Book not found");
        }
    });
}

// Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    
    getBookByISBN(isbn)
        .then(book => {
            res.send(book);
        })
        .catch(error => {
            res.status(404).json({ message: error });
        });
});
 
 
 
 
  
// Get book details based on author
/*public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author.toLowerCase();
  const filteredBooks = Object.values(books).filter(book => book.author.toLowerCase() === author);

  if (filteredBooks.length) {
    res.send(filteredBooks);
  } else {
    res.status(404).json({ message: "Books not found for this author" });
  }
});
*/

// Function to get books by author as a Promise
function getBooksByAuthor(author) {
    return new Promise((resolve, reject) => {
        const filteredBooks = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());
        if (filteredBooks.length) {
            resolve(filteredBooks);
        } else {
            reject("Books not found for this author");
        }
    });
}

// Get book details based on author using Promises
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author;

    getBooksByAuthor(author)
        .then(filteredBooks => {
            res.send(filteredBooks);
        })
        .catch(error => {
            res.status(404).json({ message: error });
        });
});




// Get all books based on title
/*public_users.get('/title/:title',function (req, res) {
  //Write your code here
  //http://localhost:5000/title/Pride%20and%20Prejudice
  const title = req.params.title.toLowerCase();
  const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase() === title);

  if (filteredBooks.length) {
    res.send(filteredBooks);
  } else {
    res.status(404).json({ message: "Books not found with this title" });
  }
});*/


// Function to get books by title as a Promise
function getBooksByTitle(title) {
    return new Promise((resolve, reject) => {
        const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());
        if (filteredBooks.length) {
            resolve(filteredBooks);
        } else {
            reject("Books not found with this title");
        }
    });
}

// Get book details based on title using Promises
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title;

    getBooksByTitle(title)
        .then(filteredBooks => {
            res.send(filteredBooks);
        })
        .catch(error => {
            res.status(404).json({ message: error });
        });
});



//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    res.send(book.reviews);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
