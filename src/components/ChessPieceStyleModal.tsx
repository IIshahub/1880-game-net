'use client';

import { useEffect } from 'react';
import { getAllPieceStyles, getCurrentPieceStyle } from '../chessPieceStyles';

interface ChessPieceStyleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStyleChange: (styleId: string) => void;
}

export default function ChessPieceStyleModal({ isOpen, onClose, onStyleChange }: ChessPieceStyleModalProps) {
  const styles = getAllPieceStyles();
  const currentStyle = getCurrentPieceStyle();

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
            <span className="theme-icon">♟️</span>
            <span>Select Piece Style</span>
          </h2>
          <button className="theme-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="theme-buttons">
          {styles.map((style) => (
            <button
              key={style.id}
              className={`theme-button ${style.id === currentStyle.id ? 'active' : ''}`}
              onClick={() => {
                onStyleChange(style.id);
                onClose();
              }}
            >
              <span className="theme-button-icon">{style.icon}</span>
              <span className="theme-button-name">{style.name}</span>
              <span className="theme-button-description" style={{ fontSize: '12px', opacity: 0.7 }}>
                {style.description}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

