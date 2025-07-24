import React from 'react';
import { ChevronDown } from 'lucide-react';

// A reusable, styled input component
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ElementType;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ icon: Icon, ...props }, ref) => (
    <div className="group flex items-center gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-sm border border-gray-200/50 hover:border-gray-300 focus-within:border-blue-400 focus-within:shadow-md transition-all duration-200">
      <Icon className="text-gray-400 flex-shrink-0 group-focus-within:text-blue-500 transition-colors" size={20} />
      <input
        ref={ref}
        {...props}
        className="w-full bg-transparent border-none focus:ring-0 p-0 placeholder-gray-500 text-gray-800"
      />
    </div>
  )
);

// A reusable, styled toggle switch
interface ToggleSwitchProps {
  label: string;
  icon: React.ElementType;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const ToggleSwitch = ({ label, icon: Icon, checked, onChange }: ToggleSwitchProps) => (
  <div className="flex justify-between items-center py-2 px-3">
    <div className="flex items-center gap-3">
      <Icon size={20} className="text-gray-400" />
      <span className="font-medium text-gray-700">{label}</span>
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-focus:ring-offset-2 peer-focus:ring-offset-sky-50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
    </label>
  </div>
);

// A reusable, styled text area component
interface FormTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  icon: React.ElementType;
}

export const FormTextArea = React.forwardRef<HTMLTextAreaElement, FormTextAreaProps>(
  ({ icon: Icon, ...props }, ref) => (
    <div className="group flex items-start gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-sm border border-gray-200/50 hover:border-gray-300 focus-within:border-blue-400 focus-within:shadow-md transition-all duration-200">
      <Icon className="text-gray-400 mt-1 flex-shrink-0 group-focus-within:text-blue-500 transition-colors" size={20} />
      <textarea
        ref={ref}
        {...props}
        className="w-full bg-transparent border-none focus:ring-0 p-0 placeholder-gray-500 text-gray-800 resize-none"
      />
    </div>
  )
);

// A reusable, styled select component
interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  icon: React.ElementType;
  children: React.ReactNode;
}

export const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ icon: Icon, children, ...props }, ref) => (
    <div className="group relative flex items-center gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-sm border border-gray-200/50 hover:border-gray-300 focus-within:border-blue-400 focus-within:shadow-md transition-all duration-200">
      <Icon className="text-gray-400 flex-shrink-0 group-focus-within:text-blue-500 transition-colors" size={20} />
      <select
        ref={ref}
        {...props}
        className="w-full bg-transparent border-none focus:ring-0 p-0 text-gray-800 appearance-none"
      >
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
    </div>
  )
);