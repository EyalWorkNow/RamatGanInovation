
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface DropdownOption {
  key: string;
  label: string;
  icon?: React.ElementType;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon?: React.ElementType;
  className?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ 
  options, 
  value, 
  onChange, 
  placeholder, 
  icon: HeaderIcon,
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.key === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-3 px-6 py-4 bg-white border-2 rounded-[20px] transition-all duration-300 shadow-sm hover:shadow-md hover:border-purple-200 ${
          isOpen ? 'border-[#6a0dad] ring-4 ring-purple-500/10' : 'border-gray-100'
        }`}
      >
        <ChevronDown 
          size={18} 
          className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#6a0dad]' : ''}`} 
        />
        
        <div className="flex items-center gap-3 flex-row-reverse flex-grow">
          {selectedOption?.icon ? (
            <selectedOption.icon size={20} className="text-[#6a0dad]" />
          ) : HeaderIcon ? (
            <HeaderIcon size={20} className="text-gray-400" />
          ) : null}
          <span className={`text-sm font-black tracking-tight ${selectedOption ? 'text-gray-900' : 'text-gray-400'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-3 left-0 right-0 z-[100] bg-white/95 backdrop-blur-xl border border-gray-100 rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top p-2">
          <div className="max-h-64 overflow-y-auto custom-scrollbar">
            {options.map((option) => (
              <button
                key={option.key}
                onClick={() => {
                  onChange(option.key);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-xl transition-all flex-row-reverse mb-1 last:mb-0 ${
                  value === option.key 
                    ? 'bg-purple-50 text-[#6a0dad]' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-4 flex-row-reverse">
                  {option.icon && <option.icon size={20} className={value === option.key ? 'text-[#6a0dad]' : 'text-gray-400'} />}
                  <span className="text-sm font-black">{option.label}</span>
                </div>
                {value === option.key && <Check size={18} className="text-[#6a0dad]" strokeWidth={3} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
