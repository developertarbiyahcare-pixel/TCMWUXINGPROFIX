import React from 'react';
import { Language } from '../types';
import { Globe } from 'lucide-react';

interface Props {
  selected: Language;
  onChange: (lang: Language) => void;
}

const LanguagePilihor: React.FC<Props> = ({ selected, onChange }) => {
  return (
    <div className="relative inline-flex items-center">
      <Globe className="w-4 h-4 absolute left-3 text-purple-400 pointer-events-none" />
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value as Language)}
        className="appearance-none bg-white text-purple-900 text-sm pl-9 pr-8 py-2 rounded-lg border border-purple-200 hover:border-tcm-primary focus:outline-none focus:border-tcm-primary transition-colors cursor-pointer shadow-sm"
      >
        {Object.values(Language).map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-purple-400">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};

export default LanguagePilihor;
