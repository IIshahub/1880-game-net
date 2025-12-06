// XOPieces.js - ایجاد مهره‌های X و O

import * as THREE from "three";
import { getCellPosition, LINE_HEIGHT } from "./XOBoard";

const PIECE_HEIGHT = 3;
const PIECE_THICKNESS = 0.8;

/**
 * ایجاد مهره X
 */
export function createX(row, col) {
  const group = new THREE.Group();
  const color = 0xe74c3c; // قرمز
  
  // خط اول (از چپ بالا به راست پایین)
  const line1 = new THREE.Mesh(
    new THREE.BoxGeometry(PIECE_THICKNESS, PIECE_HEIGHT, PIECE_THICKNESS),
    new THREE.MeshLambertMaterial({ color, flatShading: true })
  );
  line1.rotation.z = Math.PI / 4;
  line1.position.set(0, PIECE_HEIGHT / 2, 0);
  line1.castShadow = true;
  group.add(line1);
  
  // خط دوم (از راست بالا به چپ پایین)
  const line2 = new THREE.Mesh(
    new THREE.BoxGeometry(PIECE_THICKNESS, PIECE_HEIGHT, PIECE_THICKNESS),
    new THREE.MeshLambertMaterial({ color, flatShading: true })
  );
  line2.rotation.z = -Math.PI / 4;
  line2.position.set(0, PIECE_HEIGHT / 2, 0);
  line2.castShadow = true;
  group.add(line2);
  
  // پایه
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(2, 2, 0.3, 16),
    new THREE.MeshLambertMaterial({ color: 0x34495e, flatShading: true })
  );
  base.position.y = 0.15;
  base.receiveShadow = true;
  group.add(base);
  
  const position = getCellPosition(row, col);
  group.position.set(position.x, position.y, position.z);
  
  group.userData = { type: 'X', row, col };
  return group;
}

/**
 * ایجاد مهره O
 */
export function createO(row, col) {
  const group = new THREE.Group();
  const color = 0x3498db; // آبی
  
  // حلقه بیرونی
  const outerRing = new THREE.Mesh(
    new THREE.TorusGeometry(2.5, PIECE_THICKNESS / 2, 16, 32),
    new THREE.MeshLambertMaterial({ color, flatShading: true })
  );
  outerRing.rotation.x = Math.PI / 2;
  outerRing.position.y = PIECE_HEIGHT / 2;
  outerRing.castShadow = true;
  group.add(outerRing);
  
  // حلقه داخلی (برای ضخامت بیشتر)
  const innerRing = new THREE.Mesh(
    new THREE.TorusGeometry(2.2, PIECE_THICKNESS / 2, 16, 32),
    new THREE.MeshLambertMaterial({ color, flatShading: true })
  );
  innerRing.rotation.x = Math.PI / 2;
  innerRing.position.y = PIECE_HEIGHT / 2;
  innerRing.castShadow = true;
  group.add(innerRing);
  
  // پایه
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(2, 2, 0.3, 16),
    new THREE.MeshLambertMaterial({ color: 0x34495e, flatShading: true })
  );
  base.position.y = 0.15;
  base.receiveShadow = true;
  group.add(base);
  
  const position = getCellPosition(row, col);
  group.position.set(position.x, position.y, position.z);
  
  group.userData = { type: 'O', row, col };
  return group;
}

