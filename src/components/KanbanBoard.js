import React, { useState, useEffect } from 'react';
import './KanbanBoard.css';

 
import addIcon from '../assets/add.svg';
import displayIcon from '../assets/Display.svg';
import highPriorityIcon from '../assets/Img - High Priority.svg';
import mediumPriorityIcon from '../assets/Img - Medium Priority.svg';
import lowPriorityIcon from '../assets/Img - Low Priority.svg';
import threeDotMenuIcon from '../assets/3 dot menu.svg';  

 
const groupBy = (array = [], key) => {
  return array.reduce((result, item) => {
    (result[item[key]] = result[item[key]] || []).push(item);
    return result;
  }, {});
};

 
const loadViewState = () => {
  return {
    groupBy: localStorage.getItem('groupBy') || 'status',
    sortBy: localStorage.getItem('sortBy') || 'priority',
  };
};

const saveViewState = (state) => {
  localStorage.setItem('groupBy', state.groupBy);
  localStorage.setItem('sortBy', state.sortBy);
};

 
const sortByPriority = (tickets) => {
  return tickets.sort((a, b) => a.priority - b.priority);
};

const sortByTitle = (tickets) => {
  return tickets.sort((a, b) => a.title.localeCompare(b.title));
};

 
const priorityLabels = {
  1: { label: 'Low', icon: lowPriorityIcon },
  2: { label: 'Medium', icon: mediumPriorityIcon },
  3: { label: 'High', icon: highPriorityIcon },
};

const KanbanBoard = ({ tickets = [], users }) => {
  const [groupByState, setGroupBy] = useState('status'); 
  const [sortBy, setSortBy] = useState('priority'); 
  const [isDropdownOpen, setDropdownOpen] = useState(false);  

 
  useEffect(() => {
    const savedState = loadViewState();
    if (savedState.groupBy) setGroupBy(savedState.groupBy);
    if (savedState.sortBy) setSortBy(savedState.sortBy);
  }, []);

  
  useEffect(() => {
    saveViewState({ groupBy: groupByState, sortBy });
  }, [groupByState, sortBy]);
 
  const getUserNameById = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown';
  };

 
  const groupedTickets = groupByState === 'status'
    ? groupBy(tickets, 'status')
    : groupByState === 'user'
      ? groupBy(tickets, 'userId')
      : groupBy(tickets, 'priority');

 
  const sortedGroupedTickets = Object.entries(groupedTickets).map(([key, tickets]) => {
    const sortedTickets = sortBy === 'priority'
      ? sortByPriority(tickets)
      : sortByTitle(tickets);
    return [key, sortedTickets];
  });

   
  const handleSelectChange = (event, type) => {
    if (type === 'group') {
      setGroupBy(event.target.value);
    } else if (type === 'sort') {
      setSortBy(event.target.value);
    }
    setDropdownOpen(false);  
  };

  return (
    <div>
      { }
      <div className="controls">
        <div className="dropdown">
          <button
            className="dropbtn"
            onClick={() => setDropdownOpen(!isDropdownOpen)}
          >
            <img src={displayIcon} alt="Display" className="icon" />
            Display
          </button>

          {isDropdownOpen && (
            <div className="dropdown-content">
              <label>Group by:</label>
              <select value={groupByState} onChange={(e) => handleSelectChange(e, 'group')}>
                <option value="status">Status</option>
                <option value="user">User</option>
                <option value="priority">Priority</option>
              </select>

              <label>Sort by:</label>
              <select value={sortBy} onChange={(e) => handleSelectChange(e, 'sort')}>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>
            </div>
          )}
        </div>

        <button className="add-ticket-btn">
          <img src={addIcon} alt="Add" className="icon" />
          Add Ticket
        </button>
      </div>

 
      <div className="kanban-board">
        {sortedGroupedTickets.map(([key, tickets]) => (
          <div key={key} className="kanban-column">
            <div className="user-header">
              <span>{groupByState === 'user' ? getUserNameById(key) : key}</span>
              <div className="user-icons">
                <img src={addIcon} alt="Add" className="icon" />
                <img src={threeDotMenuIcon} alt="Menu" className="icon" />
              </div>
            </div>
            {tickets.map(ticket => {
              const priorityLabel = priorityLabels[ticket.priority] || { label: 'Unknown', icon: '' }; // Fallback for missing priority
              return (
                <div key={ticket.id} className="kanban-card">
                  <h4>{ticket.id}: {ticket.title}</h4> {/* Updated to display ID and Title */}
                  <p>
                    Priority:
                    {priorityLabel.icon ? (
                      <img src={priorityLabel.icon} alt={priorityLabel.label} className="priority-icon" />
                    ) : null}
                    {priorityLabel.label}
                  </p>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
