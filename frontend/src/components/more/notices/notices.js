import React, { useEffect, useState } from 'react';
import './notices.css';

export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('title');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.error("User ID not found");
      return;
    }

    fetch(`${process.env.REACT_APP_FETCH}/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setNotices(data.notices);
      })
      .catch((error) => console.error("Error", error));
  }, []);

  const findNotice = (id) => {
    setSelectedId(id)
  }

  const filteredNotices = notices.filter((notice) => {
    const fieldToSearch = notice[filterType]?.toLowerCase() || '';
    const searchMatch = fieldToSearch.includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter ? notice.status === statusFilter : true;
    const selectedMatch = selectedId ? notice._id === selectedId : true;
    return searchMatch && statusMatch && selectedMatch;
  });

  return (
    <div className='notices'>
      <div className="noticesFilter">
        <input
          type="search"
          placeholder='Search'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="title">title</option>
          <option value="by">by</option>
          <option value="date">date</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">all</option>
          <option value="positive">positive</option>
          <option value="negative">negative</option>
          <option value="info">info</option>
        </select>
      </div>

      <div className="noticesBox">
        <div className="noticesLeft">
          {notices.map((not) => (
            <div key={not._id} className="noticeLeft" onClick={() => findNotice(not._id)}>
              <p style={{
                color:
                  not.status === "positive" ? "green" :
                  not.status === "negative" ? "red" :
                  not.status === "info" ? "blue" : "black"
              }}>
                {not.title} | {not.by}
              </p>
            </div>
          ))}
        </div>

        <div className="noticesRight">
          {filteredNotices.map((notice, index) => (
            <div key={index} className={`notice ${notice.status}`}>
              <h1>{notice.title}</h1>
              <p>{notice.desc}</p>
              <p className='by'>{notice.by}</p>
              <p className='date'>{notice.date}</p>
            </div>
          ))}
          {selectedId && (
            <button className='noticesShowAllNoticesButton' onClick={() => setSelectedId(null)}>Show all notices</button>
          )}
        </div>
      </div>
    </div>
  );
}
