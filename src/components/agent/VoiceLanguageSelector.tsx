import React from 'react';
import { ChevronDown } from 'lucide-react';
import { languages } from '../../config/languages';

interface Voice {
  voice_id: string;
  voice_name: string;
  provider: string;
  accent: string;
  gender: string;
  age: string;
  preview_audio_url: string;
}

interface VoiceLanguageSelectorProps {
  voices: Voice[];
  selectedVoiceId: string;
  selectedLanguage: string;
  onVoiceChange: (voiceId: string) => void;
  onLanguageChange: (language: string) => void;
}

export function VoiceLanguageSelector({
  voices,
  selectedVoiceId,
  selectedLanguage,
  onVoiceChange,
  onLanguageChange,
}: VoiceLanguageSelectorProps) {
  return (
    <div className="flex items-center space-x-4 mb-6">
      <div className="flex-1">
        <div className="relative">
          <div className="flex items-center space-x-2">
            <img 
              src={`https://ui-avatars.com/api/?name=${
                voices.find(v => v.voice_id === selectedVoiceId)?.voice_name || 'Agent'
              }`} 
              className="w-6 h-6 rounded-full" 
              alt="Voice avatar" 
            />
            <select
              value={selectedVoiceId}
              onChange={(e) => onVoiceChange(e.target.value)}
              className="w-full pl-2 pr-8 py-2 border border-gray-200 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500"
            >
              {voices.map((voice) => (
                <option key={voice.voice_id} value={voice.voice_id}>
                  {voice.voice_name} ({voice.accent} {voice.gender})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="relative">
          <div className="flex items-center space-x-2">
            {languages.find(l => l.code === selectedLanguage)?.flag && (
              <span className="text-lg">
                {languages.find(l => l.code === selectedLanguage)?.flag}
              </span>
            )}
            <select
              value={selectedLanguage}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="w-full pl-2 pr-8 py-2 border border-gray-200 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}{lang.region ? ` (${lang.region})` : ''}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>
      </div>
    </div>
  );
}