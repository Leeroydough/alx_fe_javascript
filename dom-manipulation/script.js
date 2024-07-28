document.addEventListener('DOMContentLoaded', () => {
  let quotes = JSON.parse(localStorage.getItem('quotes') || '[]');
  let selectedCategory = localStorage.getItem('selectedCategory') || 'all';

  const quoteDisplay = document.getElementById('quoteDisplay');
  const newQuoteBtn = document.getElementById('newQuote');
  const exportQuotesBtn = document.getElementById('exportQuotes');
  const importFileInput = document.getElementById('importFile');
  const categoryFilter = document.getElementById('categoryFilter');

  const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';

  function showRandomQuote() {
    let filteredQuotes = quotes;
    if (selectedCategory !== 'all') {
      filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
    }
    if (filteredQuotes.length === 0) {
      quoteDisplay.innerHTML = "No quotes available for this category.";
      return;
    }
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];
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
      const newQuote = { text, category };
      quotes.push(newQuote);
      newQuoteText.value = '';
      newQuoteCategory.value = '';
      saveQuotes();
      populateCategories(); // Update the category filter
      alert('Quote added successfully!');
      sendQuoteToServer(newQuote); // Send the new quote to the server
    } else {
      alert('Please enter both a quote and a category.');
    }
  }

  function sendQuoteToServer(quote) {
    fetch(SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(quote)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Quote sent to server:', data);
    })
    .catch(error => {
      console.error('Error sending quote to server:', error);
    });
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

  function populateCategories() {
    const categories = [...new Set(quotes.map(quote => quote.category))];
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
    categoryFilter.value = selectedCategory;
  }

  function filterQuotes() {
    selectedCategory = categoryFilter.value;
    localStorage.setItem('selectedCategory', selectedCategory);
    showRandomQuote();
  }

  function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const exportFileDefaultName = 'quotes.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', url);
    linkElement.setAttribute('download', exportFileDefaultName);
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
  }

  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes = [...quotes, ...importedQuotes];
      saveQuotes();
      populateCategories(); // Update the category filter
      alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
  }

  async function fetchQuotesFromServer() {
    try {
      const response = await fetch(SERVER_URL);
      const serverQuotes = await response.json();
      if (response.ok) {
        // Simulate conflict resolution by merging and giving precedence to server data
        quotes = [...serverQuotes, ...quotes];
        saveQuotes();
        populateCategories();
        showRandomQuote();
        alert('Quotes synced with server successfully!');
      } else {
        console.error('Failed to fetch quotes from server.');
      }
    } catch (error) {
      console.error('Error fetching quotes from server:', error);
    }
  }

  async function syncQuotes() {
    // Send all local quotes to the server
    for (const quote of quotes) {
      await sendQuoteToServer(quote);
    }
    // Fetch updated quotes from the server
    await fetchQuotesFromServer();
    console.log('Quotes synced with server!');
  }

  function periodicDataSync() {
    syncQuotes();
    setInterval(syncQuotes, 60000); // Sync every 60 seconds
  }

  newQuoteBtn.addEventListener('click', showRandomQuote);
  exportQuotesBtn.addEventListener('click', exportToJsonFile);
  importFileInput.addEventListener('change', importFromJsonFile);
  categoryFilter.addEventListener('change', filterQuotes);

  // Initialize the form for adding new quotes
  createAddQuoteForm();

  // Populate category filter and set the last selected category
  populateCategories();

  // Show a random quote on initial load
  showRandomQuote();

  // Start periodic data sync with server
  periodicDataSync();
});





