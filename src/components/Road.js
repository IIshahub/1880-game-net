import * as THREE from "three";
import { tilesPerRow, tileSize } from "../constants";
import { getCurrentTheme } from "../themeManager";

export function Road(rowIndex) {
  const road = new THREE.Group();
  road.position.y = rowIndex * tileSize;

  const theme = getCurrentTheme();
  const foundation = new THREE.Mesh(
    new THREE.PlaneGeometry(tilesPerRow * tileSize, tileSize),
    new THREE.MeshLambertMaterial({ color: theme.colors.road })
  );
  foundation.receiveShadow = true;
  road.add(foundation);

  return road;
}