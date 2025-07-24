import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, LogOut, Calendar, MapPin, X } from 'lucide-react';
import type { Event } from '../types';

interface AccountTabProps {
  registeredEvents: Event[];
  onUnregister: (eventId: string) => void;
}

export const AccountTab = ({ registeredEvents, onUnregister }: AccountTabProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return <div>Loading account details...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Your Account
        </h1>
        <p className="mt-3 text-lg text-gray-600">
          Manage your account details and registered events.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Account Details</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <User className="w-6 h-6 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Username</p>
                <p className="text-lg font-medium text-gray-900">{user.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Mail className="w-6 h-6 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-lg font-medium text-gray-900">{user.email}</p>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t pt-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-red-700 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-300"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Registered Events</h2>
          {registeredEvents.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No registered events yet.</p>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {registeredEvents.map(event => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{event.title}</h3>
                    <button
                      onClick={() => onUnregister(event.id.toString())}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Unregister from event"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date} at {event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location || 'Online Event'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};