import { useState } from 'react';
import type { Event } from '../types';
import { CATEGORIES } from '../types';
import { EventCard } from './EventCard';
import { Code, Briefcase, GraduationCap, Palette, Leaf, Bitcoin, HeartPulse, Dumbbell, Search } from 'lucide-react';

interface DiscoverPageProps {
  events: Event[];
  registrations: string[];
  onRegister: (eventId: number) => void;
}

const categoryDetails: { 
  [key: string]: { 
    icon: React.ElementType;
    iconBg: string; 
    iconColor: string;
    selectedBg: string;
    selectedBorder: string;
  } 
} = {
  Technology: { icon: Code, iconBg: 'bg-blue-100', iconColor: 'text-blue-600', selectedBg: 'bg-blue-50', selectedBorder: 'border-blue-500' },
  Business: { icon: Briefcase, iconBg: 'bg-green-100', iconColor: 'text-green-600', selectedBg: 'bg-green-50', selectedBorder: 'border-green-500' },
  Education: { icon: GraduationCap, iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600', selectedBg: 'bg-indigo-50', selectedBorder: 'border-indigo-500' },
  'Arts & Culture': { icon: Palette, iconBg: 'bg-purple-100', iconColor: 'text-purple-600', selectedBg: 'bg-purple-50', selectedBorder: 'border-purple-500' },
  Climate: { icon: Leaf, iconBg: 'bg-teal-100', iconColor: 'text-teal-600', selectedBg: 'bg-teal-50', selectedBorder: 'border-teal-500' },
  Crypto: { icon: Bitcoin, iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600', selectedBg: 'bg-yellow-50', selectedBorder: 'border-yellow-500' },
  Wellness: { icon: HeartPulse, iconBg: 'bg-pink-100', iconColor: 'text-pink-600', selectedBg: 'bg-pink-50', selectedBorder: 'border-pink-500' },
  Fitness: { icon: Dumbbell, iconBg: 'bg-red-100', iconColor: 'text-red-600', selectedBg: 'bg-red-50', selectedBorder: 'border-red-500' },
};

export const DiscoverPage = ({ events, registrations, onRegister }: DiscoverPageProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (event.tags && event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const eventCounts = events.reduce((acc, event) => {
    if (event.category) {
      acc[event.category] = (acc[event.category] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-gray-50 min-h-screen -m-8 p-8">
      <main className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Discover Events
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Explore popular events near you, browse by category, or check out some of the great community calendars.
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.filter(c => c !== 'all' && categoryDetails[c]).map(category => {
              const details = categoryDetails[category];
              const Icon = details.icon;
              const isSelected = selectedCategory === category;

              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(isSelected ? 'all' : category)}
                  className={`group p-4 rounded-xl border-2 transition-all duration-200 text-left flex items-center gap-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isSelected
                      ? `${details.selectedBg} ${details.selectedBorder}`
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md hover:-translate-y-px'
                  }`}
                >
                  <div className={`p-3 rounded-lg transition-colors duration-200 ${isSelected ? 'bg-white' : details.iconBg}`}>
                    <Icon className={`w-6 h-6 transition-colors duration-200 ${details.iconColor}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-lg text-gray-900">{category}</p>
                    <p className="text-sm text-gray-500">
                      {eventCounts[category] || 0} Events
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-8 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search events by title, description, or tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        <div className="space-y-4">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-xl border border-gray-200">
              <h3 className="text-xl font-medium text-gray-800">No events found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search or category filters.</p>
            </div>
          ) : (
            filteredEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onRegister={onRegister}
                isRegistered={registrations.includes(event.id.toString())}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};