import React, { useState, useEffect } from 'react';
import KanbanBoard from './components/KanbanBoard';
import './App.css';

// Import SVGs
import DisplayIcon from '../src/assets/Display.svg';

function App() {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
        if (!response.ok) throw new Error('Failed to fetch tickets: ' + response.statusText);

        const data = await response.json();
        console.log(data); // Log the data to check the structure
        setTickets(data.tickets || []);
        setUsers(data.users || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="app">
      <header>
        <h1>Interactive Kanban Board</h1>
        <div className="header-icons">
          <img src={DisplayIcon} alt="Display Options" className="icon display-icon" />
        </div>
      </header>
      
      <main>
        {tickets.length > 0 ? (
          <KanbanBoard tickets={tickets} users={users} />
        ) : (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading tickets...</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
