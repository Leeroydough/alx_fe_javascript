document.addEventListener('DOMContentLoaded', () => {
  const quotes = JSON.parse(localStorage.getItem('quotes') || '[]');

  const quoteDisplay = document.getElementById('quoteDisplay');
  const newQuoteBtn = document.getElementById('newQuote');

  function showRandomQuote() {
    if (quotes.length === 0) {
      quoteDisplay.innerHTML = "No quotes available.";
      return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteDisplay.innerHTML = `"${randomQuote.text}" - <em>${randomQuote.category}</em>`;
  }

  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }

  function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText');
    const newQuoteCategory = document.getElementById('newQuoteCategory');
    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim();
    if (text && category) {
      quotes.push({ text, category });
      newQuoteText.value = '';
      newQuoteCategory.value = '';
      saveQuotes();
      alert('Quote added successfully!');
    } else {
      alert('Please enter both a quote and a category.');
    }
  }

  function createAddQuoteForm() {
    const formContainer = document.createElement('div');
    
    const quoteInput = document.createElement('input');
    quoteInput.id = 'newQuoteText';
    quoteInput.type = 'text';
    quoteInput.placeholder = 'Enter a new quote';
    formContainer.appendChild(quoteInput);
    
    const categoryInput = document.createElement('input');
    categoryInput.id = 'newQuoteCategory';
    categoryInput.type = 'text';
    categoryInput.placeholder = 'Enter quote category';
    formContainer.appendChild(categoryInput);
    
    const addButton = document.createElement('button');
    addButton.id = 'addQuoteBtn';
    addButton.textContent = 'Add Quote';
    addButton.addEventListener('click', addQuote);
    formContainer.appendChild(addButton);
    
    document.body.appendChild(formContainer);
  }

  newQuoteBtn.addEventListener('click', showRandomQuote);

  // Initialize the form for adding new quotes
  createAddQuoteForm();

  // Show a random quote on initial load
  showRandomQuote();
});

