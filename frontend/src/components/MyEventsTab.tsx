import type { Event } from '../types';
import { EventCard } from './EventCard';

interface MyEventsTabProps {
  events: Event[];
  registrations: number[];
}

export const MyEventsTab = ({ events, registrations }: MyEventsTabProps) => {
  const registeredEvents = registrations.map(id => events.find(e => e.id === id)).filter(Boolean) as Event[];

  return (
    <div className="my-events-tab">
      <div className="page-header">
        <h1>My Events</h1>
        <p>Events you've registered for</p>
      </div>

      <div className="registered-events-section">
        <div className="events-timeline">
          {registeredEvents.length === 0 ? (
            <div className="no-events">
              <p>You haven't registered for any events yet.</p>
              <p>Browse the <strong>Discover</strong> tab to find events to attend.</p>
            </div>
          ) : (
            registeredEvents.map(event => (
              <EventCard 
                key={event.id} 
                event={event}
                showActions={false}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}; 