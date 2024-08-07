
function addBook(event) {
    event.preventDefault();

    // Fetch form data
    const bookName = document.getElementById('bookName').value;
    const authors = document.getElementById('authors').value;
    const isbn = document.getElementById('isbn').value;
    const price = document.getElementById('price').value;
    const description = document.getElementById('description').value;
    const image = document.getElementById('image').files[0];

    // You can perform validation here if needed

    // Simulated server interaction (replace with actual AJAX call)
    console.log("Adding book:", { bookName, authors, isbn, price, description, image });
    alert('Book added successfully!'); // Replace with appropriate feedback to the user

    // Clear the form after submission
    document.getElementById('addBookForm').reset();

}