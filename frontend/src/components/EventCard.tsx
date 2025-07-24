import type { EventCardProps } from '../types';
import { useAuth } from '../context/AuthContext';
import { MapPin, Users, Calendar, Trash2, CheckCircle, Clock, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EventCard = ({ 
  event, 
  showActions = true, 
  onRegister, 
  onDelete, 
  isRegistered = false 
}: EventCardProps) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const formatDateTime = (dateString: string, timeString: string) => {
    if (!dateString || !timeString) return 'Date & Time not set';
    
    const date = new Date(`${dateString}T${timeString}`);
    const formattedDate = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const formattedTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    return `${formattedDate} at ${formattedTime}`;
  };

  const getAvailabilityText = () => {
    if (event.capacity > 0 && event.registeredUsers >= event.capacity) return 'Sold out';
    if (event.registeredUsers > 0) return `${event.registeredUsers} going`;
    return 'Be the first to register!';
  };

  const imageUrl = event.imageUrl ? `http://localhost:5000${event.imageUrl}` : null;
  const dateTimeInfo = formatDateTime(event.date, event.time);
  const isOrganizer = isAuthenticated && user?._id === (typeof event.organizer === 'object' ? (event.organizer as any)._id : event.organizer);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row gap-5 transition-all duration-200 hover:shadow-lg hover:border-transparent">
      <div className="flex-shrink-0 w-full sm:w-48 h-40 sm:h-auto">
        {imageUrl ? (
          <img src={imageUrl} alt={event.title} className="w-full h-full object-cover rounded-lg" />
        ) : (
          <div className="w-full h-full rounded-lg flex items-center justify-center bg-gray-100 text-gray-400">
            <Calendar className="w-1/2 h-1/2 opacity-50" />
          </div>
        )}
      </div>

      <div className="flex-grow flex flex-col">
        <p className="text-sm font-semibold text-blue-600 mb-2 flex items-center gap-2">
          <Clock size={16} /> {dateTimeInfo}
        </p>
        
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 leading-tight">
          {event.title}
        </h3>
        
        <div className="flex items-center gap-2 text-gray-600 mb-2 text-sm">
          <Users className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <span>By {typeof event.organizer === 'string' ? event.organizer : (event.organizer as any)?.username || 'Evently'}</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-600 mb-4 text-sm">
          <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <span>{event.location || 'Online Event'}</span>
        </div>

        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {event.tags.slice(0, 3).map(tag => (
              <span key={tag} className="bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Users className="w-4 h-4" />
            <span className="font-medium">{getAvailabilityText()}</span>
          </div>

          {showActions && (
            <div>
              {isOrganizer ? (
                <button 
                  onClick={() => onDelete?.(event.id)}
                  className="flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Event
                </button>
              ) : (
                <button
                  onClick={() => isAuthenticated ? onRegister?.(event.id) : navigate('/login')}
                  disabled={isRegistered}
                  className={`w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                    isRegistered 
                      ? 'bg-green-100 text-green-800 cursor-not-allowed' 
                      : isAuthenticated
                      ? 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                      : 'bg-gray-600 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
                  }`}
                >
                  {isRegistered ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Registered
                    </>
                  ) : isAuthenticated ? 'Register Now' : (<><LogIn className="w-5 h-5" /> Login to Register</>)}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};