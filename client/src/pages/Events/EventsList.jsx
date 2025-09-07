import React, { useState, useEffect } from 'react';
import './event.css';
const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchEvents();
    setIsLoggedIn(false); 
  }, []);

   const fetchEvents = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/events/"
        );
         if (!response.ok) {
      console.error("Failed to fetch events:", response.statusText);
      return;
    }

    const data = await response.json();
    if (Array.isArray(data.events)) {
      setEvents(data.events);
    } else {
      console.warn("No events field in response", data);
      setEvents([]);
    }
      } catch (err) {
        console.error("Error while fecthing events: ", err);
      }
    };

  // const fetchEvents = async () => {
  //   try {
  //      const response = await fetch('/api/events');
  //      const data = await response.json();
  //      if(!data){
         
  //      }
  //     // Mock data for demonstration - replace with actual API call
  //     const mockData = [
  //       {
  //         _id: '1',
  //         title: 'Community Clean-up Drive',
  //         description: 'Join us for a neighborhood clean-up initiative to make our community cleaner and greener.',
  //         category: 'environment',
  //         dateStart: new Date('2025-09-15T09:00:00'),
  //         dateEnd: new Date('2025-09-15T16:00:00'),
  //         isOnline: false,
  //         location: { text: 'Central Park', city: 'Bhubaneswar', state: 'Odisha', country: 'India' },
  //         maxCapacity: 50,
  //         status: 'PUBLISHED',
  //         coverImage: null,
  //         ngo: { name: 'Green Earth NGO' },
  //         createdBy: { name: 'John Doe', email: 'john@example.com' },
  //         tags: ['environment', 'community', 'cleanup']
  //       },
  //       {
  //         _id: '2',
  //         title: 'Education for All Workshop',
  //         description: 'Teaching underprivileged children basic literacy and numeracy skills.',
  //         category: 'education',
  //         dateStart: new Date('2025-09-20T10:00:00'),
  //         dateEnd: new Date('2025-09-20T15:00:00'),
  //         isOnline: true,
  //         location: { text: 'Online Event' },
  //         maxCapacity: 30,
  //         status: 'PUBLISHED',
  //         coverImage: null,
  //         ngo: { name: 'Bright Futures NGO' },
  //         createdBy: { name: 'Jane Smith', email: 'jane@example.com' },
  //         tags: ['education', 'children', 'teaching']
  //       },
  //       {
  //         _id: '3',
  //         title: 'Food Distribution Drive',
  //         description: 'Helping distribute meals to homeless individuals in the city center.',
  //         category: 'social',
  //         dateStart: new Date('2025-09-10T08:00:00'),
  //         dateEnd: new Date('2025-09-10T18:00:00'),
  //         isOnline: false,
  //         location: { text: 'City Center', city: 'Bhubaneswar', state: 'Odisha', country: 'India' },
  //         maxCapacity: 25,
  //         status: 'PUBLISHED',
  //         coverImage: null,
  //         ngo: { name: 'Helping Hands NGO' },
  //         createdBy: { name: 'Mike Johnson', email: 'mike@example.com' },
  //         tags: ['food', 'homeless', 'social']
  //       }
  //     ];
      
  //     setEvents(mockData);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error('Failed to fetch events:', error);
  //     setLoading(false);
  //   }
  // };

  const getCurrentDate = () => new Date();

  const categorizeEvents = () => {
    const now = getCurrentDate();
    const ongoing = events.filter(event => {
      const start = new Date(event.dateStart);
      const end = event.dateEnd ? new Date(event.dateEnd) : new Date(start.getTime() + 24*60*60*1000);
      return start <= now && end >= now;
    });
    
    const upcoming = events.filter(event => {
      const start = new Date(event.dateStart);
      return start > now;
    });

    return { ongoing, upcoming };
  };

  const { ongoing, upcoming } = categorizeEvents();

  const getDisplayEvents = () => {
    if (filter === 'ongoing') return ongoing;
    if (filter === 'upcoming') return upcoming;
    return [...ongoing, ...upcoming];
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isEventOngoing = (event) => {
    const now = getCurrentDate();
    const start = new Date(event.dateStart);
    const end = event.dateEnd ? new Date(event.dateEnd) : new Date(start.getTime() + 24*60*60*1000);
    return start <= now && end >= now;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      environment: '🌱',
      education: '📚',
      social: '🤝',
      health: '🏥',
      other: '📋'
    };
    return icons[category] || icons.other;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <style jsx>{`
          .loading-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #25274D 0%, #464866 50%, #AAABB8 100%);
            color: #AAABB8;
            font-family: 'Arial', sans-serif;
          }
          .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(46, 156, 202, 0.3);
            border-top: 4px solid #2E9CCA;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <div className="events-page">
        <div className="events-container">
          <div className="page-header">
            <h1 className="page-title">Available Events</h1>
            <p className="page-subtitle">
              Discover meaningful opportunities to make a difference in your community. 
              Join ongoing events or register for upcoming volunteer activities.
            </p>
          </div>

          <div className="filter-tabs">
            <button 
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Events ({ongoing.length + upcoming.length})
            </button>
            <button 
              className={`filter-tab ${filter === 'ongoing' ? 'active' : ''}`}
              onClick={() => setFilter('ongoing')}
            >
              Ongoing ({ongoing.length})
            </button>
            <button 
              className={`filter-tab ${filter === 'upcoming' ? 'active' : ''}`}
              onClick={() => setFilter('upcoming')}
            >
              Upcoming ({upcoming.length})
            </button>
          </div>

          <div className="events-stats">
            <div className="stat-item">
              <div className="stat-number">{ongoing.length}</div>
              <div className="stat-label">Ongoing</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{upcoming.length}</div>
              <div className="stat-label">Upcoming</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{events.length}</div>
              <div className="stat-label">Total Events</div>
            </div>
          </div>

          {getDisplayEvents().length === 0 ? (
            <div className="no-events">
              <div className="no-events-icon">📅</div>
              <h3>No events found</h3>
              <p>Check back later for new volunteer opportunities!</p>
            </div>
          ) : (
            <div className="events-grid">
              {getDisplayEvents().map((event) => (
                <div key={event._id} className="event-card">
                  <div className="event-header">
                    <div className={`event-status ${isEventOngoing(event) ? 'status-ongoing' : 'status-upcoming'}`}>
                      {isEventOngoing(event) ? 'Live Now' : 'Upcoming'}
                    </div>
                    
                    <div className="event-category">
                      <span>{getCategoryIcon(event.category)}</span>
                      <span>{event.category.charAt(0).toUpperCase() + event.category.slice(1)}</span>
                    </div>

                    <h3 className="event-title">{event.title}</h3>
                    <p className="event-description">{event.description}</p>

                    <div className="event-details">
                      <div className="detail-item">
                        <div className="detail-icon">📅</div>
                        <span>{formatDate(event.dateStart)}</span>
                      </div>
                      
                      {event.dateEnd && (
                        <div className="detail-item">
                          <div className="detail-icon">⏰</div>
                          <span>Ends: {formatDate(event.dateEnd)}</span>
                        </div>
                      )}

                      <div className="detail-item">
                        <div className="detail-icon">{event.isOnline ? '💻' : '📍'}</div>
                        <span>
                          {event.isOnline 
                            ? 'Online Event' 
                            : `${event.location?.text || 'TBD'}, ${event.location?.city || ''}`
                          }
                        </span>
                      </div>

                      {event.maxCapacity && (
                        <div className="detail-item">
                          <div className="detail-icon">👥</div>
                          <span>{event.maxCapacity} volunteers needed</span>
                        </div>
                      )}
                    </div>

                    {event.tags && event.tags.length > 0 && (
                      <div className="event-tags">
                        {event.tags.map((tag, index) => (
                          <span key={index} className="tag">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="event-footer">
                    <div className="ngo-info">
                      <div className="ngo-avatar">
                        {event.ngo?.name?.charAt(0) || 'N'}
                      </div>
                      <div className="ngo-details">
                        <div className="ngo-name">{event.ngo?.name || 'Unknown NGO'}</div>
                        <div className="ngo-type">Organizing NGO</div>
                      </div>
                    </div>

                    {isLoggedIn ? (
                      <button className="register-btn btn-register">
                        Register Now
                      </button>
                    ) : (
                      <button 
                        className="register-btn btn-login"
                        onClick={() => {
                          // Redirect to login page - replace with your auth logic
                          console.log('Redirecting to login...');
                        }}
                      >
                        Login to Register
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EventsPage;