'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { checkVehicleCollision } from './collision';
import {
  CAMERA_VIEW_SIZE,
  MOVE_STEP_TIME,
  ROWS_BUFFER,
  ROWS_PER_BATCH,
  minTileIndex,
  maxTileIndex,
  tileSize,
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
import type { Direction, PlayerPosition, RowMetadata } from './types';

interface RoadCrossingSceneProps {
  characterKey: string;
  onScoreChange: (score: number) => void;
  onGameOver: (score: number) => void;
  gameOver: boolean;
}

export function RoadCrossingScene({
  characterKey,
  onScoreChange,
  onGameOver,
  gameOver,
}: RoadCrossingSceneProps) {
  const { registerQueueMove } = useRoadCrossingControls();
  const { camera, size } = useThree();
  const playerHandleRef = useRef<PlayerCharacterHandle>(null);
  const [rows, setRows] = useState<RowMetadata[]>(() => generateRows(ROWS_PER_BATCH));
  const rowsRef = useRef(rows);
  rowsRef.current = rows;
  const positionRef = useRef<PlayerPosition>({ currentRow: 0, currentTile: 0 });
  const movesQueueRef = useRef<Direction[]>([]);
  const moveClockRef = useRef(new THREE.Clock(false));
  const vehicleClockRef = useRef(new THREE.Clock());
  const gameOverRef = useRef(false);
  const bestScoreRef = useRef(0);

  useEffect(() => {
    gameOverRef.current = gameOver;
  }, [gameOver]);

  const addRows = useCallback(() => {
    setRows((prev) => [...prev, ...generateRows(ROWS_PER_BATCH, prev.length)]);
  }, []);

  const stepCompleted = useCallback(() => {
    const direction = movesQueueRef.current.shift();
    if (!direction) return;

    if (direction === 'forward') positionRef.current.currentRow += 1;
    if (direction === 'backward') positionRef.current.currentRow -= 1;
    if (direction === 'left') positionRef.current.currentTile -= 1;
    if (direction === 'right') positionRef.current.currentTile += 1;

    const score = positionRef.current.currentRow;
    bestScoreRef.current = Math.max(bestScoreRef.current, score);
    onScoreChange(score);

    if (positionRef.current.currentRow > rowsRef.current.length - ROWS_BUFFER) {
      addRows();
    }
  }, [addRows, onScoreChange]);

  const queueMove = useCallback(
    (direction: Direction) => {
      if (gameOverRef.current) return;

      const queue = movesQueueRef.current;

      if (queue.length === 0) {
        if (!endsUpInValidPosition(positionRef.current, [direction], rowsRef.current)) return;
        queue.push(direction);
        return;
      }

      // Validate next hop from where the player lands after the current move
      const afterCurrent = positionAfterMoves(positionRef.current, [queue[0]]);

      if (queue.length === 1) {
        if (!endsUpInValidPosition(afterCurrent, [direction], rowsRef.current)) return;
        queue.push(direction);
        return;
      }

      // Replace pre-queued hop so direction changes apply immediately
      if (!endsUpInValidPosition(afterCurrent, [direction], rowsRef.current)) return;
      queue[1] = direction;
    },
    [],
  );

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

    const container = playerHandleRef.current?.container;
    const model = playerHandleRef.current?.model;
    if (!container || !model) return;

    if (movesQueueRef.current.length > 0) {
      if (!moveClockRef.current.running) moveClockRef.current.start();

      const progress = Math.min(1, moveClockRef.current.getElapsedTime() / MOVE_STEP_TIME);
      const startX = positionRef.current.currentTile * tileSize;
      const startY = positionRef.current.currentRow * tileSize;
      let endX = startX;
      let endY = startY;
      const direction = movesQueueRef.current[0];

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
        stepCompleted();
        if (movesQueueRef.current.length > 0) {
          moveClockRef.current.start();
        } else {
          moveClockRef.current.stop();
        }
      }
    }

    if (checkVehicleCollision(container, positionRef.current.currentRow, rowsRef.current)) {
      gameOverRef.current = true;
      movesQueueRef.current = [];
      onGameOver(bestScoreRef.current);
    }

    if (camera instanceof THREE.OrthographicCamera) {
      const viewSize = CAMERA_VIEW_SIZE;
      const viewRatio = size.width / size.height;
      const width = viewRatio < 1 ? viewSize : viewSize * viewRatio;
      const height = viewRatio < 1 ? viewSize / viewRatio : viewSize;
      camera.up.set(0, 0, 1);
      camera.left = width / -2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = height / -2;
      camera.position.set(
        container.position.x + 300,
        container.position.y - 300,
        container.position.z + 300,
      );
      camera.lookAt(container.position.x, container.position.y, 0);
      camera.updateProjectionMatrix();
    }
  });

  return (
    <>
      <GameLighting />
      <GameMap rows={rows} />
      <PlayerCharacter key={characterKey} ref={playerHandleRef} />
    </>
  );
}
