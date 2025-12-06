'use client';

import { useEffect } from 'react';
import { getAllCharacters, getCurrentCharacterId } from '../characterManager';

interface CharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCharacterChange: (characterId: string) => void;
}

export default function CharacterModal({ isOpen, onClose, onCharacterChange }: CharacterModalProps) {
  const characters = getAllCharacters();
  const currentCharacter = getCurrentCharacterId();

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
            <span className="theme-icon">👤</span>
            <span>Select Character</span>
          </h2>
          <button className="theme-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="theme-buttons">
          {characters.map((character) => (
            <button
              key={character.key}
              className={`theme-button ${character.key === currentCharacter ? 'active' : ''}`}
              onClick={() => onCharacterChange(character.key)}
            >
              <span className="theme-button-icon">{character.icon}</span>
              <span className="theme-button-name">{character.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

