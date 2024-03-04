import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./App.css"

const API_URL = 'https://www.googleapis.com/books/v1/volumes';

const App = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    if (query !== '') {
      setLoading(true);
      axios.get(`${API_URL}?q=${query}&startIndex=${startIndex}&maxResults=10`)
        .then(response => {
          setBooks(prevBooks => [...prevBooks, ...response.data.items]);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching books:', error);
          setLoading(false);
        });
    }
  }, [query, startIndex]);

  const handleSearch = (event) => {
    setQuery(event.target.value);
    setBooks([]);
    setStartIndex(0);
  };

  const loadMore = () => {
    setStartIndex(startIndex + 10);
  };

  return (
    <div className="container mx-auto my-4">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search for books..."
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400"
      />
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {books.map(book => (
          <div key={book.id} className="bg-white rounded-md shadow-md p-4">
            <img
              src={book.volumeInfo.imageLinks?.thumbnail}
              alt={book.volumeInfo.title}
              className="w-full h-40 object-cover mb-4"
            />
            <h3 className="text-lg font-semibold mb-2">{book.volumeInfo.title}</h3>
            <p className="text-sm text-gray-700">{book.volumeInfo.authors?.join(', ')}</p>
          </div>
        ))}
      </div>
      {loading && <p className="mt-4 text-center">Loading...</p>}
      {!loading && books.length === 0 && <p className="mt-4 text-center">No books found.</p>}
      {!loading && books.length > 0 && (
        <div className="mt-4 text-center">
          <button
            onClick={loadMore}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
