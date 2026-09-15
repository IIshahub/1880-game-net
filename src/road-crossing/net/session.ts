/**
 * Session adapter for Road Crossing multiplayer.
 * LocalSession powers 2P on one device today.
 * OnlineSession (future) will sync two devices over WebSocket / rooms.
 */

export type SessionKind = 'solo' | 'local-chain' | 'online-chain';

export interface SessionPlayer {
  slot: 0 | 1;
  displayName: string;
  /** true when this client owns input for the slot */
  isLocal: boolean;
}

export interface GameSession {
  kind: SessionKind;
  roomId: string | null;
  players: SessionPlayer[];
  maxPlayers: number;
}

export function createSoloSession(): GameSession {
  return {
    kind: 'solo',
    roomId: null,
    players: [{ slot: 0, displayName: 'Player 1', isLocal: true }],
    maxPlayers: 1,
  };
}

export function createLocalChainSession(): GameSession {
  return {
    kind: 'local-chain',
    roomId: null,
    players: [
      { slot: 0, displayName: 'Player 1', isLocal: true },
      { slot: 1, displayName: 'Player 2', isLocal: true },
    ],
    maxPlayers: 2,
  };
}

/** Placeholder for future online rooms (2 devices). */
export function createOnlineChainSessionStub(roomId: string): GameSession {
  return {
    kind: 'online-chain',
    roomId,
    players: [
      { slot: 0, displayName: 'Host', isLocal: true },
      { slot: 1, displayName: 'Guest', isLocal: false },
    ],
    maxPlayers: 2,
  };
}
