// Get references to DOM elements
const saveBookBtn = document.getElementById('save-book-btn');
const addBookForm = document.getElementById('add-book-form');
let editingIndex = null;

// Events added to the main cards container to handle dynamic content (event delegation)
document.querySelector('.main-cards').addEventListener('click', function (event) {
  if (event.target.classList.contains('remove-book-btn')) {
    const index = event.target.getAttribute('data-index');
    removeBookFromLibrary(index);
  }
});

// Event delegation for read status toggle
document.addEventListener('change', (event) => {
  if (event.target.classList.contains('toggle-checkbox')) {
    const checkbox = event.target;

    const card = checkbox.closest('.card');
    const text = card.querySelector('.toggle-check');

    text.textContent = checkbox.checked
      ? 'Read'
      : 'Not Read';
  }
});

// Reset form and validation state when modal is closed
const modalEl = document.getElementById('exampleModal');

modalEl.addEventListener('hidden.bs.modal', () => {
  addBookForm.reset();
  addBookForm.classList.remove('was-validated');
});

// Change Event listener functionality for saving a new book
saveBookBtn.addEventListener('click', function (event) {
  event.preventDefault();

  if (!addBookForm.checkValidity()) {
    addBookForm.classList.add('was-validated');
    return;
  }

  const title = document.getElementById('book-title').value;
  const author = document.getElementById('book-author').value;
  const description = document.getElementById('book-description').value;
  const pages = document.getElementById('book-pages').value;
  const read = document.getElementById('book-read').checked;

  // EDIT MODE
  if (editingIndex !== null) {
    myLibrary[editingIndex].title = title;
    myLibrary[editingIndex].author = author;
    myLibrary[editingIndex].description = description;
    myLibrary[editingIndex].pages = pages;
    myLibrary[editingIndex].read = read;

    editingIndex = null;
  }

  // ADD MODE
  else {
    const newBook = new Book(
      title,
      author,
      description,
      pages,
      read
    );

    addBookToLibrary(newBook);
  }

  displayBooks();

  const modal =
    bootstrap.Modal.getInstance(
      document.getElementById('exampleModal')
    );
  document.getElementById('add-book-form').reset();
  modal.hide();
});

// Books Array
let myLibrary = [];

// Book Constructor
function Book(title, author, description, pages, read) {
  this.uniqueID = crypto.randomUUID();
  this.title = title;
  this.author = author;
  this.description = description;
  this.pages = pages;
  this.read = read;
}

// Add Book to Library
function addBookToLibrary(book) {
  myLibrary.push(book);
}

//removes book from library
function removeBookFromLibrary(index) {
  myLibrary.splice(index, 1);
  displayBooks(); // Refresh the displayed books after removal
}

//  Create a book manually with a form/modal or with a API call and add it to the library
const book1 = new Book('The Great Gatsby', 'F. Scott Fitzgerald', 'A classic American novel', 180, true);
const book2 = new Book('1984', 'George Orwell', 'A dystopian social science fiction novel', 328, false);
addBookToLibrary(book1);
addBookToLibrary(book2);
console.log(myLibrary);

// Dynamically create cards for each book in the library
function displayBooks() {
  const mainCards = document.querySelector('.main-cards');
  mainCards.innerHTML = ''; // Clear existing cards
  myLibrary.forEach((book, index) => {
    console.log(index);
    const card = document.createElement('div');
    card.classList.add('col');
    card.innerHTML = `
      <div class="card shadow-sm">
        <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"></rect><text x="50%" y="50%" fill="#eceeef" dy=".3em" text-anchor="middle">Thumbnail</text></svg>
        <div class="card-body">
          <h4 class="card-title">${book.title}</h4>
          <h6 class="card-subtitle mb-2 text-muted">${book.author}</h6>
          <p class="card-text">${book.description}</p>
          <div class="d-flex justify-content-between align-items-center">
            <div class="btn-group">
              <input type="checkbox" class="btn-check toggle-checkbox" id="btn-check-outlined${index}" autocomplete="off" ${book.read ? 'checked' : ''}>
              <label class="btn btn-outline-success toggle-check" for="btn-check-outlined${index}">${book.read ? 'Read' : 'Not Read'}</label><br>
              <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
              <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button>
              <button type="button" class="btn btn-sm btn-outline-secondary remove-book-btn" data-index="${index}">Delete</button>
              </div>
              <small class="text-muted mx-auto ps-2">${book.pages ? `${book.pages} pages` : '? pages'}</small>
          </div>
        </div>
      </div>
      </div>
    `;
    mainCards.appendChild(card);
  });
}

displayBooks(); // Initial display of books


// edit book details
// add event listener to edit buttons (event delegation)
document.querySelector('.main-cards').addEventListener('click', function (event) {
  if (event.target.classList.contains('btn-outline-secondary') && event.target.textContent === 'Edit') {
    editingIndex = true;
    const index = event.target.closest('.card').querySelector('.remove-book-btn').getAttribute('data-index');
    const book = myLibrary[index];
    // Populate the form with existing book details
    document.getElementById('book-title').value = book.title;
    document.getElementById('book-author').value = book.author;
    document.getElementById('book-description').value = book.description;
    document.getElementById('book-pages').value = book.pages;
    document.getElementById('book-read').checked = book.read;
    // Show the modal
    const addBookModal = new bootstrap.Modal(document.getElementById('exampleModal'));
    addBookModal.show();

    // Update the save button to handle editing
    saveBookBtn.addEventListener('click', function (event) {
      event.preventDefault();
      // check form validity
      if (!addBookForm.checkValidity()) {
        addBookForm.classList.add('was-validated');
        return;
      }
      // Update book details
      book.title = document.getElementById('book-title').value;
      book.author = document.getElementById('book-author').value;
      book.description = document.getElementById('book-description').value;
      book.pages = document.getElementById('book-pages').value;
      book.read = document.getElementById('book-read').checked;
      // Refresh the displayed books
      displayBooks();
      // Close the modal
      addBookModal.hide();
      // Reset editing index
      editingIndex = null;
    });
  }
});



