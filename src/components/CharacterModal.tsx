'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  createCustomCharacter,
  getAllCharacters,
  getCurrentCharacterId,
  isCharacterNameTaken,
} from '../characterManager';
import { cropCharacterPhoto } from '../utils/cropCharacterPhoto';

interface CharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCharacterChange: (characterId: string) => void;
}

export default function CharacterModal({ isOpen, onClose, onCharacterChange }: CharacterModalProps) {
  const [characters, setCharacters] = useState<ReturnType<typeof getAllCharacters>>([]);
  const [currentCharacter, setCurrentCharacter] = useState(getCurrentCharacterId());
  const [newName, setNewName] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  const refreshList = useCallback(() => {
    setCharacters(getAllCharacters());
    setCurrentCharacter(getCurrentCharacterId());
  }, []);

  useEffect(() => {
    if (isOpen) {
      refreshList();
      setError('');
    }
  }, [isOpen, refreshList]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!photoFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(photoFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [photoFile]);

  const handleCreateFromPhoto = async () => {
    setError('');
    const trimmed = newName.trim();

    if (!trimmed) {
      setError('Enter a character name');
      return;
    }
    if (isCharacterNameTaken(trimmed)) {
      setError('This name is already taken — choose another');
      return;
    }
    if (!photoFile) {
      setError('Choose a photo');
      return;
    }

    setCreating(true);
    try {
      const texture = await cropCharacterPhoto(photoFile);
      const id = createCustomCharacter(trimmed, texture);
      refreshList();
      setNewName('');
      setPhotoFile(null);
      onCharacterChange(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create character');
    } finally {
      setCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="theme-modal active">
      <div className="theme-modal-overlay" onClick={onClose}></div>
      <div className="theme-modal-content character-modal-content">
        <div className="theme-modal-header">
          <h2 className="theme-modal-title">
            <span className="theme-icon">👤</span>
            <span>Select Character</span>
          </h2>
          <button className="theme-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="character-upload-panel">
          <h3 className="character-upload-title">Create from photo</h3>
          <p className="character-upload-hint">
            Upload a photo — we crop the face and put it on a cube, like Ali.
          </p>
          <input
            type="text"
            className="character-upload-input"
            placeholder="Character name (must be unique)"
            value={newName}
            maxLength={24}
            onChange={(e) => {
              setNewName(e.target.value);
              setError('');
            }}
          />
          <label className="character-upload-file-label">
            <input
              type="file"
              accept="image/*"
              className="character-upload-file"
              onChange={(e) => {
                setPhotoFile(e.target.files?.[0] ?? null);
                setError('');
              }}
            />
            {photoFile ? photoFile.name : 'Choose photo…'}
          </label>
          {previewUrl && (
            <img src={previewUrl} alt="Preview" className="character-upload-preview" />
          )}
          {error && <p className="character-upload-error">{error}</p>}
          <button
            type="button"
            className="character-upload-submit"
            disabled={creating}
            onClick={handleCreateFromPhoto}
          >
            {creating ? 'Creating…' : 'Create character'}
          </button>
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
