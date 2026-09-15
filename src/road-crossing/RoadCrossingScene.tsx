'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import * as THREE from 'three';
import { ChainLink } from './chain/ChainLink';
import { isWithinChain, teamScore } from './chain/chainRules';
import { checkChainVehicleCollision, checkVehicleCollision } from './collision';
import {
  CAMERA_VIEW_SIZE,
  CHAIN_HEIGHT_Z,
  CHAIN_MAX_TILE_DISTANCE,
  MOVE_STEP_TIME,
  ROWS_BUFFER,
  ROWS_PER_BATCH,
  minTileIndex,
  maxTileIndex,
  tileSize,
  type PlayerSlot,
} from './constants';
import { generateRows } from './generateRows';
import { useRoadCrossingControls } from './GameContext';
import { endsUpInValidPosition, positionAfterMoves } from './validation';
import { GameLighting } from './components/GameLighting';
import { GameMap } from './components/GameMap';
import {
  PlayerCharacter,
  type PlayerCharacterHandle,
} from './components/PlayerCharacter';
import { LandDust } from './fx/LandDust';
import {
  createShakeOffset,
  playCameraPunch,
  playHitShake,
} from './motion/cameraJuice';
import { playHopJuice, playLandSquash } from './motion/playerHop';
import type { Direction, PlayerPosition, RowMetadata } from './types';

interface PlayerRuntime {
  position: PlayerPosition;
  moves: Direction[];
  clock: THREE.Clock;
  hopStarted: boolean;
  handle: RefObject<PlayerCharacterHandle | null>;
}

interface RoadCrossingSceneProps {
  characterKey: string;
  onScoreChange: (score: number) => void;
  onGameOver: (score: number) => void;
  gameOver: boolean;
  chainedMode?: boolean;
  /** Orthographic zoom factor (1 = default). Higher = closer. */
  cameraZoom?: number;
}

function createPlayer(
  handle: RefObject<PlayerCharacterHandle | null>,
  tile: number,
): PlayerRuntime {
  return {
    position: { currentRow: 0, currentTile: tile },
    moves: [],
    clock: new THREE.Clock(false),
    hopStarted: false,
    handle,
  };
}

export function RoadCrossingScene({
  characterKey,
  onScoreChange,
  onGameOver,
  gameOver,
  chainedMode = false,
  cameraZoom = 1,
}: RoadCrossingSceneProps) {
  const { registerQueueMove } = useRoadCrossingControls();
  const { camera, size } = useThree();
  const p1Handle = useRef<PlayerCharacterHandle>(null);
  const p2Handle = useRef<PlayerCharacterHandle>(null);
  const [rows, setRows] = useState<RowMetadata[]>(() => generateRows(ROWS_PER_BATCH));
  const rowsRef = useRef(rows);
  rowsRef.current = rows;

  const playersRef = useRef<PlayerRuntime[]>([
    createPlayer(p1Handle, 0),
    createPlayer(p2Handle, 1),
  ]);
  const vehicleClockRef = useRef(new THREE.Clock());
  const gameOverRef = useRef(false);
  const bestScoreRef = useRef(0);
  const shakeRef = useRef(createShakeOffset());
  const dustOrigin = useRef(new THREE.Vector3());
  const [dustBurst, setDustBurst] = useState(0);
  const placedRef = useRef(false);

  const chainedModeRef = useRef(chainedMode);
  chainedModeRef.current = chainedMode;

  useEffect(() => {
    gameOverRef.current = gameOver;
  }, [gameOver]);

  useEffect(() => {
    playersRef.current = [
      createPlayer(p1Handle, 0),
      createPlayer(p2Handle, 1),
    ];
    placedRef.current = false;
    bestScoreRef.current = 0;
  }, [chainedMode, characterKey]);

  const addRows = useCallback(() => {
    setRows((prev) => [...prev, ...generateRows(ROWS_PER_BATCH, prev.length)]);
  }, []);

  const syncScore = useCallback(() => {
    const [p1, p2] = playersRef.current;
    const chained = chainedModeRef.current;
    const score = chained ? teamScore(p1.position, p2.position) : p1.position.currentRow;
    bestScoreRef.current = Math.max(bestScoreRef.current, score);
    onScoreChange(score);

    const leadRow = chained
      ? Math.max(p1.position.currentRow, p2.position.currentRow)
      : p1.position.currentRow;
    if (leadRow > rowsRef.current.length - ROWS_BUFFER) {
      addRows();
    }
  }, [addRows, onScoreChange]);

  const stepCompleted = useCallback(
    (slot: PlayerSlot) => {
      const player = playersRef.current[slot];
      const direction = player.moves.shift();
      if (!direction) return;

      if (direction === 'forward') player.position.currentRow += 1;
      if (direction === 'backward') player.position.currentRow -= 1;
      if (direction === 'left') player.position.currentTile -= 1;
      if (direction === 'right') player.position.currentTile += 1;

      const model = player.handle.current?.model;
      const container = player.handle.current?.container;
      playLandSquash(model);
      if (container) {
        dustOrigin.current.set(container.position.x, container.position.y, 0);
        setDustBurst((n) => n + 1);
      }
      playCameraPunch(shakeRef.current, 5);
      syncScore();
    },
    [syncScore],
  );

  const queueMove = useCallback((direction: Direction, playerSlot: PlayerSlot = 0) => {
    if (gameOverRef.current) return;
    const chained = chainedModeRef.current;
    const slot: PlayerSlot = chained ? playerSlot : 0;
    const player = playersRef.current[slot];
    if (!player) return;
    const other = playersRef.current[slot === 0 ? 1 : 0];
    const queue = player.moves;

    const tryPush = (from: typeof player.position, dir: Direction) => {
      if (!endsUpInValidPosition(from, [dir], rowsRef.current)) return false;
      if (chained && other) {
        const after = positionAfterMoves(from, [dir]);
        const otherLogical =
          other.moves.length > 0
            ? positionAfterMoves(other.position, [other.moves[0]])
            : other.position;
        if (!isWithinChain(after, otherLogical, CHAIN_MAX_TILE_DISTANCE)) return false;
      }
      return true;
    };

    if (queue.length === 0) {
      if (!tryPush(player.position, direction)) return;
      queue.push(direction);
      return;
    }

    const afterCurrent = positionAfterMoves(player.position, [queue[0]]);

    if (queue.length === 1) {
      if (!tryPush(afterCurrent, direction)) return;
      queue.push(direction);
      return;
    }

    if (!tryPush(afterCurrent, direction)) return;
    queue[1] = direction;
  }, []);

  useEffect(() => {
    registerQueueMove(queueMove);
  }, [registerQueueMove, queueMove]);

  useFrame(() => {
    if (gameOverRef.current) return;

    const delta = vehicleClockRef.current.getDelta();
    const beginningOfRow = (minTileIndex - 2) * tileSize;
    const endOfRow = (maxTileIndex + 2) * tileSize;

    rowsRef.current.forEach((rowData) => {
      if (rowData.type !== 'car' && rowData.type !== 'truck') return;
      rowData.vehicles.forEach((vehicle) => {
        if (!vehicle.ref) return;
        if (rowData.direction) {
          vehicle.ref.position.x =
            vehicle.ref.position.x > endOfRow
              ? beginningOfRow
              : vehicle.ref.position.x + rowData.speed * delta;
        } else {
          vehicle.ref.position.x =
            vehicle.ref.position.x < beginningOfRow
              ? endOfRow
              : vehicle.ref.position.x - rowData.speed * delta;
        }
      });
    });

    const activeSlots: PlayerSlot[] = chainedMode ? [0, 1] : [0];

    if (!placedRef.current) {
      let allReady = true;
      for (const slot of activeSlots) {
        const player = playersRef.current[slot];
        const container = player.handle.current?.container;
        if (!container) {
          allReady = false;
          continue;
        }
        container.position.x = player.position.currentTile * tileSize;
        container.position.y = player.position.currentRow * tileSize;
        container.position.z = 0;
      }
      if (!allReady) {
        // Keep trying next frame; still run the rest for whoever is ready
      } else {
        placedRef.current = true;
      }
    }

    let focusX = 0;
    let focusY = 0;
    let focusZ = 0;
    let focusCount = 0;

    for (const slot of activeSlots) {
      const player = playersRef.current[slot];
      const container = player.handle.current?.container;
      const model = player.handle.current?.model;
      if (!container || !model) continue;

      if (player.moves.length > 0) {
        if (!player.clock.running) {
          player.clock.start();
          player.hopStarted = false;
        }

        const progress = Math.min(1, player.clock.getElapsedTime() / MOVE_STEP_TIME);

        if (!player.hopStarted && progress > 0) {
          player.hopStarted = true;
          playHopJuice(model);
          playCameraPunch(shakeRef.current, 4);
        }

        const startX = player.position.currentTile * tileSize;
        const startY = player.position.currentRow * tileSize;
        let endX = startX;
        let endY = startY;
        const direction = player.moves[0];

        if (direction === 'left') endX -= tileSize;
        if (direction === 'right') endX += tileSize;
        if (direction === 'forward') endY += tileSize;
        if (direction === 'backward') endY -= tileSize;

        container.position.x = THREE.MathUtils.lerp(startX, endX, progress);
        container.position.y = THREE.MathUtils.lerp(startY, endY, progress);
        model.position.z = Math.sin(progress * Math.PI) * 8;

        let endRotation = 0;
        if (direction === 'forward') endRotation = 0;
        if (direction === 'left') endRotation = Math.PI / 2;
        if (direction === 'right') endRotation = -Math.PI / 2;
        if (direction === 'backward') endRotation = Math.PI;
        model.rotation.z = THREE.MathUtils.lerp(model.rotation.z, endRotation, progress);

        if (progress >= 1) {
          player.hopStarted = false;
          stepCompleted(slot);
          if (player.moves.length > 0) player.clock.start();
          else player.clock.stop();
        }
      }

      if (checkVehicleCollision(container, player.position.currentRow, rowsRef.current)) {
        gameOverRef.current = true;
        playersRef.current.forEach((p) => {
          p.moves = [];
        });
        playHitShake(shakeRef.current);
        onGameOver(bestScoreRef.current);
        return;
      }

      focusX += container.position.x;
      focusY += container.position.y;
      focusZ += container.position.z;
      focusCount += 1;
    }

    if (
      chainedMode &&
      p1Handle.current?.container &&
      p2Handle.current?.container
    ) {
      const a = p1Handle.current.container.position;
      const b = p2Handle.current.container.position;
      if (
        checkChainVehicleCollision(
          a.x,
          a.y,
          a.z + CHAIN_HEIGHT_Z,
          b.x,
          b.y,
          b.z + CHAIN_HEIGHT_Z,
          rowsRef.current,
        )
      ) {
        gameOverRef.current = true;
        playersRef.current.forEach((p) => {
          p.moves = [];
        });
        playHitShake(shakeRef.current);
        onGameOver(bestScoreRef.current);
        return;
      }
    }

    if (focusCount === 0) return;
    focusX /= focusCount;
    focusY /= focusCount;
    focusZ /= focusCount;

    const shake = shakeRef.current;
    if (camera instanceof THREE.OrthographicCamera) {
      const zoom = Math.max(0.35, cameraZoom);
      const viewSize = CAMERA_VIEW_SIZE / zoom;
      const viewRatio = size.width / size.height;
      const width = viewRatio < 1 ? viewSize : viewSize * viewRatio;
      const height = viewRatio < 1 ? viewSize / viewRatio : viewSize;
      camera.up.set(0, 0, 1);
      camera.left = width / -2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = height / -2;
      camera.position.set(focusX + 300 + shake.x, focusY - 300 + shake.y, focusZ + 300 + shake.z);
      camera.lookAt(focusX, focusY, 0);
      camera.updateProjectionMatrix();
    }
  });

  return (
    <>
      <GameLighting />
      <GameMap rows={rows} />
      <PlayerCharacter key={`p1-${characterKey}`} ref={p1Handle} slot={0} />
      {chainedMode && (
        <>
          <PlayerCharacter key={`p2-${characterKey}`} ref={p2Handle} slot={1} />
          <ChainLink playerA={p1Handle} playerB={p2Handle} />
        </>
      )}
      <LandDust burstId={dustBurst} origin={dustOrigin.current} />
    </>
  );
}
