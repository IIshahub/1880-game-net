import * as THREE from "three";
import { tileSize } from "../constants";
import { Wheel } from "./Wheel";
import { getCurrentTheme } from "../themeManager";

export function Truck(initialTileIndex, direction, color) {
  const truck = new THREE.Group();
  truck.position.x = initialTileIndex * tileSize;
  if (!direction) truck.rotation.z = Math.PI;

  const theme = getCurrentTheme();

  const cargo = new THREE.Mesh(
    new THREE.BoxGeometry(70, 35, 35),
    new THREE.MeshLambertMaterial({
      color: theme.colors.truckCargo,
      flatShading: true,
    })
  );
  cargo.position.x = -15;
  cargo.position.z = 25;
  cargo.castShadow = true;
  cargo.receiveShadow = true;
  truck.add(cargo);

  // استفاده از رنگ تم
  const finalColor = color || theme.colors.truckColors[0];

  const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(30, 30, 30),
    new THREE.MeshLambertMaterial({ color: finalColor, flatShading: true })
  );
  cabin.position.x = 35;
  cabin.position.z = 20;
  cabin.castShadow = true;
  cabin.receiveShadow = true;
  truck.add(cabin);

  const frontWheel = Wheel(37);
  truck.add(frontWheel);

  const middleWheel = Wheel(5);
  truck.add(middleWheel);

  const backWheel = Wheel(-35);
  truck.add(backWheel);

  return truck;
}