'use client';

import { useEffect } from 'react';
import { getAllThemes, getCurrentThemeName } from '../themeManager';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onThemeChange: (themeName: string) => void;
}

export default function ThemeModal({ isOpen, onClose, onThemeChange }: ThemeModalProps) {
  const themes = getAllThemes();
  const currentTheme = getCurrentThemeName();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="theme-modal active">
      <div className="theme-modal-overlay" onClick={onClose}></div>
      <div className="theme-modal-content">
        <div className="theme-modal-header">
          <h2 className="theme-modal-title">
            <span className="theme-icon">🎨</span>
            <span>Select Theme</span>
          </h2>
          <button className="theme-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="theme-buttons">
          {themes.map((theme) => (
            <button
              key={theme.key}
              className={`theme-button ${theme.key === currentTheme ? 'active' : ''}`}
              onClick={() => onThemeChange(theme.key)}
            >
              <span className="theme-button-icon">{theme.icon}</span>
              <span className="theme-button-name">{theme.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

