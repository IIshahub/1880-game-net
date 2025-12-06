'use client';

import { useEffect } from 'react';
import { getAllXOThemes, getCurrentXOTheme } from '../xoThemes';

interface XOThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onThemeChange: (themeId: string) => void;
}

export default function XOThemeModal({ isOpen, onClose, onThemeChange }: XOThemeModalProps) {
  const themes = getAllXOThemes();
  const currentTheme = getCurrentXOTheme();

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
            <span>Select Board Theme</span>
          </h2>
          <button className="theme-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="theme-buttons">
          {themes.map((theme) => (
            <button
              key={theme.id}
              className={`theme-button ${theme.id === currentTheme.id ? 'active' : ''}`}
              onClick={() => {
                onThemeChange(theme.id);
                onClose();
              }}
              style={{
                backgroundColor: `#${theme.boardColor.toString(16).padStart(6, '0')}`,
                borderColor: `#${theme.lineColor.toString(16).padStart(6, '0')}`,
              }}
            >
              <span className="theme-button-icon">🎯</span>
              <span className="theme-button-name">{theme.name}</span>
              <span className="theme-button-description" style={{ fontSize: '12px', opacity: 0.7 }}>
                {theme.description}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

