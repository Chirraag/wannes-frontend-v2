interface Language {
  code: string;
  name: string;
  flag: string;
  region?: string;
}

export const languages: Language[] = [
  { code: 'en-US', name: 'English', flag: '🇺🇸', region: 'US' },
  { code: 'en-GB', name: 'English', flag: '🇬🇧', region: 'UK' },
  { code: 'en-IN', name: 'English', flag: '🇮🇳', region: 'India' },
  { code: 'es-ES', name: 'Spanish', flag: '🇪🇸', region: 'Spain' },
  { code: 'es-419', name: 'Spanish', flag: '🇲🇽', region: 'Latin America' },
  { code: 'fr-FR', name: 'French', flag: '🇫🇷' },
  { code: 'de-DE', name: 'German', flag: '🇩🇪' },
  { code: 'it-IT', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt-PT', name: 'Portuguese', flag: '🇵🇹', region: 'Portugal' },
  { code: 'pt-BR', name: 'Portuguese', flag: '🇧🇷', region: 'Brazil' },
  { code: 'nl-NL', name: 'Dutch', flag: '🇳🇱' },
  { code: 'pl-PL', name: 'Polish', flag: '🇵🇱' },
  { code: 'ru-RU', name: 'Russian', flag: '🇷🇺' },
  { code: 'tr-TR', name: 'Turkish', flag: '🇹🇷' },
  { code: 'ar-SA', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳' },
  { code: 'bn-IN', name: 'Bengali', flag: '🇧🇩' },
  { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko-KR', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh-CN', name: 'Chinese', flag: '🇨🇳', region: 'Simplified' },
  { code: 'zh-TW', name: 'Chinese', flag: '🇹🇼', region: 'Traditional' },
  { code: 'vi-VN', name: 'Vietnamese', flag: '🇻🇳' },
  { code: 'th-TH', name: 'Thai', flag: '🇹🇭' },
  { code: 'ro-RO', name: 'Romanian', flag: '🇷🇴' }
];