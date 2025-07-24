import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import type { Event } from './types';
import { Header } from './components/Header';
import { DiscoverPage } from './components/Discover';
import { EventsTab } from './components/EventsTab';
import { AccountTab } from './components/AccountTab';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import axios from 'axios';
import './App.css';

const AppContent = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<string[]>([]);
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Fetch all events from the server on initial load
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events');
        // Map MongoDB's _id to the id field used in the frontend type
        const fetchedEvents = response.data.map((event: any) => ({
          ...event,
          id: event._id, 
        }));
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserRegistrations();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Fetch user registrations from the server
  const fetchUserRegistrations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/registrations/user');
      const registeredEventIds = response.data.map((reg: any) => reg.event._id);
      const registeredEventsData = response.data.map((reg: any) => ({
        ...reg.event,
        id: reg.event._id
      }));
      setRegistrations(registeredEventIds);
      setRegisteredEvents(registeredEventsData);
    } catch (error) {
      console.error("Failed to fetch registrations:", error);
    }
  };

  // Handle event creation using data returned from the server
  const handleCreateEvent = (newEventData: any) => {
    const newEvent: Event = {
      ...newEventData,
      id: newEventData._id,
      organizer: 'You',
      status: 'upcoming',
      registeredUsers: 0,
    };

    setEvents(prev => [newEvent, ...prev]);
    setUserEvents(prev => [newEvent, ...prev]);
  };

  const handleRegister = async (eventId: number) => {
    try {
      await axios.post(`http://localhost:5000/api/registrations/${eventId}`);
      await fetchUserRegistrations();
      setEvents(prev => prev.map(event => 
        event.id.toString() === eventId.toString()
          ? { ...event, registeredUsers: (event.registeredUsers || 0) + 1 }
          : event
      ));
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
    }
  };

  const handleUnregister = async (eventId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/registrations/${eventId}`);
      await fetchUserRegistrations();
      setEvents(prev => prev.map(event => 
        event.id.toString() === eventId 
          ? { ...event, registeredUsers: Math.max((event.registeredUsers || 0) - 1, 0) }
          : event
      ));
    } catch (error) {
      console.error("Unregistration failed:", error);
      alert("Failed to unregister. Please try again.");
    }
  };

  const handleDeleteEvent = (eventId: number) => {
    setUserEvents(prev => prev.filter(event => event.id.toString() !== eventId.toString()));
    setEvents(prev => prev.filter(event => event.id.toString() !== eventId.toString()));
  };

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/discover" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/discover"
            element={
              <DiscoverPage
                events={events}
                registrations={registrations}
                onRegister={handleRegister}
              />
            }
          />
          <Route
            path="/events"
            element={
              isAuthenticated ? (
                <EventsTab
                  userEvents={userEvents}
                  onCreateEvent={handleCreateEvent}
                  onDeleteEvent={handleDeleteEvent}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/account"
            element={
              isAuthenticated ? (
                <AccountTab 
                  registeredEvents={registeredEvents}
                  onUnregister={handleUnregister}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </main>
    </div>
  );
};

// Create a new root component that provides the context
const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
