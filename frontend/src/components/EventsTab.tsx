import type { Event, EventFormData } from '../types';
import { EventForm } from './EventForm';

interface EventsTabProps {
  userEvents: Event[];
  onCreateEvent: (formData: EventFormData) => void;
  onDeleteEvent: (eventId: number) => void;
}

export const EventsTab = ({ onCreateEvent }: EventsTabProps) => {
 
  

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Create new Events
        </h1>
        <p className="mt-3 text-lg text-gray-600">
          Use the form below to create a new event, or manage your existing events.
        </p>
      </div>

      <EventForm onSubmit={onCreateEvent} />

    </div>
  );
};