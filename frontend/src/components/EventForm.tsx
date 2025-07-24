import { useState } from 'react';
import type { EventFormData } from '../types';
import { CATEGORIES } from '../types';
import { Image as ImageIcon, Calendar, Clock, MapPin, FileText, Ticket, Users, Tag, Layers, Lock } from 'lucide-react';
import { FormInput, FormTextArea, FormSelect, ToggleSwitch } from './FormControls';
import axios from 'axios';

interface EventFormProps {
  onSubmit: (formData: EventFormData) => void;
}

export const EventForm = ({ onSubmit }: EventFormProps) => {
  const [form, setForm] = useState<EventFormData>({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    capacity: 0,
    category: CATEGORIES[1],
    price: 0,
    isOnline: false,
    tags: '',
    requireApproval: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleToggle = (name: keyof EventFormData, checked: boolean) => {
    setForm(prev => ({ ...prev, [name]: checked as any }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.time) {
      alert('Please fill in the event title, date, and time.');
      return;
    }
    setIsSubmitting(true);

    const formData = new FormData();
    // Append all form fields to formData
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      // Replace with your backend API endpoint
      const response = await axios.post('http://localhost:5000/api/events', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Event created:', response.data);
      onSubmit(form); // Pass the original form data to the parent
      alert('Event created successfully!');
    } catch (error) {
      console.error('Failed to create event:', error);
      alert('Error creating event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-sky-50/70 backdrop-blur-lg p-4 sm:p-8 rounded-2xl border border-sky-100">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-1">
          <label htmlFor="image-upload" className="cursor-pointer group">
            <div className="aspect-square rounded-2xl flex items-center justify-center border-2 border-dashed border-sky-300/70 group-hover:border-sky-400 transition-colors overflow-hidden bg-sky-200/50">
              {imagePreview ? (
                <img src={imagePreview} alt="Event preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center text-sky-600">
                  <ImageIcon className="mx-auto h-12 w-12 opacity-50 group-hover:opacity-75 transition-opacity" />
                  <p className="mt-2 font-medium">Upload Event Image</p>
                </div>
              )}
            </div>
            <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="sr-only" />
          </label>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <input
            name="title"
            placeholder="Event Title"
            value={form.title}
            onChange={handleInput}
            required
            className="w-full text-3xl sm:text-4xl font-bold bg-transparent border-b-2 border-gray-200 focus:border-blue-500 focus:ring-0 text-gray-800 placeholder-gray-400 p-2 transition"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput name="date" type="date" value={form.date} onChange={handleInput} required icon={Calendar} />
            <FormInput name="time" type="time" value={form.time} onChange={handleInput} required icon={Clock} />
          </div>

          <div className="space-y-4">
            <FormInput name="location" placeholder="Location or virtual link" value={form.location} onChange={handleInput} icon={MapPin} />
            <FormTextArea name="description" placeholder="Event Description" value={form.description} onChange={handleInput} icon={FileText} rows={3} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-2 ml-1">EVENT DETAILS</h3>
            <div className="bg-white/50 backdrop-blur-sm p-2 rounded-lg shadow-sm divide-y divide-gray-200/70 border border-white">
              <FormSelect name="category" value={form.category} onChange={handleInput} icon={Layers}>
                {CATEGORIES.filter(c => c !== 'all').map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </FormSelect>
              <FormInput name="tags" placeholder="Tags (comma-separated)" value={form.tags} onChange={handleInput} icon={Tag} />
              <FormInput name="price" type="number" placeholder="Price (0 for free)" value={form.price || ''} onChange={handleInput} icon={Ticket} />
              <FormInput name="capacity" type="number" placeholder="Capacity (0 for unlimited)" value={form.capacity || ''} onChange={handleInput} icon={Users} />
              <ToggleSwitch label="Require Approval" icon={Lock} checked={!!form.requireApproval} onChange={(checked) => handleToggle('requireApproval', checked)} />
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-blue-400 disabled:cursor-not-allowed">
            {isSubmitting ? 'Creating Event...' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
};