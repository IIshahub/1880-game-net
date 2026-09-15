'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import { getAllThemes, getCurrentThemeName } from '../themeManager';
import { prefersReducedMotion } from '../road-crossing/motion/playerHop';

gsap.registerPlugin(useGSAP);

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onThemeChange: (themeName: string) => void;
}

export default function ThemeModal({ isOpen, onClose, onThemeChange }: ThemeModalProps) {
  const themes = getAllThemes();
  const currentTheme = getCurrentThemeName();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useGSAP(
    () => {
      const el = contentRef.current;
      if (!el || !isOpen) return;
      if (prefersReducedMotion()) {
        gsap.set(el, { autoAlpha: 1, y: 0, scale: 1 });
        return;
      }
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 16, scale: 0.96 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.28, ease: 'power2.out' },
      );
    },
    { dependencies: [isOpen] },
  );

  if (!isOpen) return null;

  return (
    <div className="theme-modal active">
      <div className="theme-modal-overlay" onClick={onClose} />
      <div className="theme-modal-content" ref={contentRef}>
        <div className="theme-modal-header">
          <h2 className="theme-modal-title">
            <span className="theme-icon">🎨</span>
            <span>Select Theme</span>
          </h2>
          <button type="button" className="theme-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="theme-buttons">
          {themes.map((theme) => (
            <button
              key={theme.key}
              type="button"
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
