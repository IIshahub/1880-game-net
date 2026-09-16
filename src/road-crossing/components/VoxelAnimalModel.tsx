'use client';

import type { ReactNode } from 'react';

function Vox({
  position,
  size,
  color,
  roughness = 0.62,
  metalness = 0.04,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: number | string;
  roughness?: number;
  metalness?: number;
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        flatShading
        roughness={roughness}
        metalness={metalness}
      />
    </mesh>
  );
}

/** Soft rounded look via overlapping boxes */
function SoftBody({
  position = [0, 0, 12] as [number, number, number],
  w = 14,
  d = 14,
  h = 14,
  color,
}: {
  position?: [number, number, number];
  w?: number;
  d?: number;
  h?: number;
  color: number;
}) {
  const [x, y, z] = position;
  return (
    <group>
      <Vox position={[x, y, z]} size={[w, d, h]} color={color} />
      <Vox position={[x, y, z]} size={[w * 0.86, d * 0.86, h * 1.08]} color={color} roughness={0.7} />
      <Vox position={[x, y, z]} size={[w * 1.06, d * 0.82, h * 0.82]} color={color} roughness={0.68} />
    </group>
  );
}

type Colors = Record<string, number>;

function EyePair({
  z = 17,
  y = 7,
  spread = 4,
  size = 2.4,
  white = true,
}: {
  z?: number;
  y?: number;
  spread?: number;
  size?: number;
  white?: boolean;
}) {
  return (
    <>
      {white && (
        <>
          <Vox position={[-spread, y, z - 0.5]} size={[size + 1.4, size + 0.6, size]} color={0xffffff} />
          <Vox position={[spread, y, z - 0.5]} size={[size + 1.4, size + 0.6, size]} color={0xffffff} />
        </>
      )}
      <Vox position={[-spread, y, z + 0.6]} size={[size, size, size]} color={0x111111} />
      <Vox position={[spread, y, z + 0.6]} size={[size, size, size]} color={0x111111} />
    </>
  );
}

function Legs({
  color,
  spread = 4.5,
  thick = 2.8,
  height = 7,
}: {
  color: number;
  spread?: number;
  thick?: number;
  height?: number;
}) {
  return (
    <>
      <Vox position={[-spread, 2, height * 0.35]} size={[thick, thick, height * 0.55]} color={color} />
      <Vox position={[spread, 2, height * 0.35]} size={[thick, thick, height * 0.55]} color={color} />
      <Vox position={[-spread, 3.2, 1.2]} size={[thick + 1.5, thick + 0.8, 2]} color={color} />
      <Vox position={[spread, 3.2, 1.2]} size={[thick + 1.5, thick + 0.8, 2]} color={color} />
    </>
  );
}

function Chicken({ colors }: { colors: Colors }) {
  const body = colors.body ?? 0xffffff;
  const comb = colors.accent ?? 0xe53935;
  const beak = colors.beak ?? 0xffc107;
  const legs = colors.legs ?? 0xff9800;
  return (
    <group>
      <SoftBody color={body} w={15} d={15} h={15} />
      {/* chest puff */}
      <Vox position={[0, 5, 10]} size={[10, 6, 8]} color={body} roughness={0.7} />
      {/* comb */}
      <Vox position={[0, 0, 21.5]} size={[3.2, 6, 5]} color={comb} />
      <Vox position={[0, 0, 24]} size={[2.4, 3.5, 3]} color={comb} />
      {/* wattle */}
      <Vox position={[0, 7.2, 12]} size={[2.4, 2.4, 3.5]} color={comb} />
      {/* beak */}
      <Vox position={[0, 8.8, 14.5]} size={[3.2, 4, 2.6]} color={beak} />
      <Vox position={[0, 10.5, 14.5]} size={[2, 2.2, 1.8]} color={0xffa000} />
      <EyePair y={6.5} z={16.5} spread={4} />
      {/* wings */}
      <Vox position={[-8.5, 0, 12]} size={[3, 7, 8]} color={0xf5f5f5} />
      <Vox position={[8.5, 0, 12]} size={[3, 7, 8]} color={0xf5f5f5} />
      {/* tail */}
      <Vox position={[0, -8, 14]} size={[4, 5, 6]} color={body} />
      <Legs color={legs} />
    </group>
  );
}

function Chick({ colors }: { colors: Colors }) {
  const body = colors.body ?? 0xffeb3b;
  const beak = colors.beak ?? 0xff9800;
  const legs = colors.legs ?? 0xff9800;
  return (
    <group>
      <SoftBody color={body} w={13} d={13} h={13} position={[0, 0, 11]} />
      <Vox position={[0, 4, 9]} size={[8, 5, 6]} color={body} />
      <Vox position={[0, 7.5, 12]} size={[2.8, 3.2, 2.4]} color={beak} />
      <Vox position={[0, 0, 18.5]} size={[2.5, 3, 3]} color={0xffc107} />
      <EyePair y={5.5} z={14.5} spread={3.4} size={2.1} />
      <Vox position={[-7, 0, 11]} size={[2.5, 5, 6]} color={0xffe082} />
      <Vox position={[7, 0, 11]} size={[2.5, 5, 6]} color={0xffe082} />
      <Legs color={legs} spread={3.8} thick={2.2} height={6} />
    </group>
  );
}

function Elephant({ colors }: { colors: Colors }) {
  const body = colors.body ?? 0x9e9e9e;
  const dark = colors.accent ?? 0x757575;
  const tusks = colors.tusks ?? 0xfafafa;
  return (
    <group>
      <SoftBody color={body} w={16} d={16} h={15} />
      {/* head */}
      <Vox position={[0, 5, 15]} size={[12, 10, 10]} color={body} />
      {/* ears */}
      <Vox position={[-11, 1, 15]} size={[4, 12, 11]} color={dark} />
      <Vox position={[11, 1, 15]} size={[4, 12, 11]} color={dark} />
      <Vox position={[-12.5, 1, 15]} size={[2, 8, 7]} color={0xbdbdbd} />
      <Vox position={[12.5, 1, 15]} size={[2, 8, 7]} color={0xbdbdbd} />
      {/* trunk segments */}
      <Vox position={[0, 10, 12]} size={[4.5, 4.5, 5]} color={body} />
      <Vox position={[0, 11, 8]} size={[3.8, 3.8, 5]} color={dark} />
      <Vox position={[0, 11.5, 4.5]} size={[3.2, 3.2, 4]} color={body} />
      {/* tusks */}
      <Vox position={[-3.5, 9, 11]} size={[2, 2.5, 5]} color={tusks} />
      <Vox position={[3.5, 9, 11]} size={[2, 2.5, 5]} color={tusks} />
      <EyePair y={7} z={18} spread={4.2} />
      <Legs color={dark} spread={5.5} thick={4} height={8} />
      <Vox position={[0, -9, 11]} size={[4, 5, 6]} color={dark} />
    </group>
  );
}

function Penguin({ colors }: { colors: Colors }) {
  const body = colors.body ?? 0x212121;
  const belly = colors.belly ?? 0xffffff;
  const beak = colors.beak ?? 0xffc107;
  const feet = colors.feet ?? 0xff9800;
  return (
    <group>
      <SoftBody color={body} w={14} d={14} h={17} />
      <Vox position={[0, 5.5, 12]} size={[10, 3.5, 13]} color={belly} />
      <Vox position={[0, 4, 16]} size={[9, 2.5, 6]} color={belly} />
      {/* beak */}
      <Vox position={[0, 8.2, 16]} size={[3.5, 4, 2.5]} color={beak} />
      <Vox position={[0, 9.8, 16]} size={[2, 2, 1.6]} color={0xffa000} />
      <EyePair y={6.5} z={18} spread={3.6} size={2.2} />
      {/* flippers */}
      <Vox position={[-9, 0, 12]} size={[2.8, 6, 9]} color={body} />
      <Vox position={[9, 0, 12]} size={[2.8, 6, 9]} color={body} />
      {/* feet */}
      <Vox position={[-4, 3, 2]} size={[4, 5.5, 2.5]} color={feet} />
      <Vox position={[4, 3, 2]} size={[4, 5.5, 2.5]} color={feet} />
      <Vox position={[0, -7.5, 10]} size={[3.5, 4, 5]} color={body} />
    </group>
  );
}

function Cardinal({ colors }: { colors: Colors }) {
  const body = colors.body ?? 0xe53935;
  const mask = colors.mask ?? 0x111111;
  const beak = colors.beak ?? 0xffc107;
  const crest = colors.crest ?? 0xc62828;
  return (
    <group>
      <SoftBody color={body} w={14} d={14} h={14} />
      <Vox position={[0, 4, 10]} size={[9, 5, 7]} color={body} />
      {/* black mask */}
      <Vox position={[0, 5.5, 15]} size={[12, 7, 7]} color={mask} />
      <Vox position={[0, 8.5, 15]} size={[3.4, 4, 2.6]} color={beak} />
      {/* crest */}
      <Vox position={[0, 0, 21]} size={[4, 7, 5]} color={crest} />
      <Vox position={[0, 0, 24]} size={[2.8, 4, 3.5]} color={body} />
      <EyePair y={6} z={17} spread={3.5} size={2.2} white={false} />
      <Vox position={[-3.5, 6.2, 17.8]} size={[2, 2, 2]} color={0xffffff} />
      <Vox position={[3.5, 6.2, 17.8]} size={[2, 2, 2]} color={0xffffff} />
      <Vox position={[-8, 0, 12]} size={[2.8, 6, 7]} color={0xc62828} />
      <Vox position={[8, 0, 12]} size={[2.8, 6, 7]} color={0xc62828} />
      <Vox position={[0, -7.5, 13]} size={[4, 5, 6]} color={crest} />
      <Legs color={body} spread={3.8} thick={2.2} height={6} />
    </group>
  );
}

function Panda({ colors }: { colors: Colors }) {
  const body = colors.body ?? 0xffffff;
  const black = colors.black ?? 0x212121;
  return (
    <group>
      <SoftBody color={body} w={15} d={15} h={15} />
      {/* ears */}
      <Vox position={[-7, 0, 20.5]} size={[5.5, 5.5, 5.5]} color={black} />
      <Vox position={[7, 0, 20.5]} size={[5.5, 5.5, 5.5]} color={black} />
      <Vox position={[-7, 0, 20.5]} size={[3, 3, 3]} color={0x424242} />
      <Vox position={[7, 0, 20.5]} size={[3, 3, 3]} color={0x424242} />
      {/* eye patches */}
      <Vox position={[-5, 6, 16.5]} size={[5.5, 4.5, 4.5]} color={black} />
      <Vox position={[5, 6, 16.5]} size={[5.5, 4.5, 4.5]} color={black} />
      <EyePair y={6} z={17.5} spread={4.2} size={2.3} white={false} />
      <Vox position={[-4.2, 6.2, 18.2]} size={[1.8, 1.8, 1.8]} color={0xffffff} />
      <Vox position={[4.2, 6.2, 18.2]} size={[1.8, 1.8, 1.8]} color={0xffffff} />
      {/* snout */}
      <Vox position={[0, 8, 13]} size={[5, 4, 4]} color={0xfafafa} />
      <Vox position={[0, 9.5, 14]} size={[2.2, 2, 2]} color={black} />
      {/* limbs */}
      <Vox position={[-7, 0, 4]} size={[5, 5, 8]} color={black} />
      <Vox position={[7, 0, 4]} size={[5, 5, 8]} color={black} />
      <Vox position={[-6, -2, 8]} size={[4, 4, 5]} color={black} />
      <Vox position={[6, -2, 8]} size={[4, 4, 5]} color={black} />
      <Vox position={[0, -8, 10]} size={[4.5, 5.5, 6]} color={black} />
    </group>
  );
}

function Moose({ colors }: { colors: Colors }) {
  const body = colors.body ?? 0xa1887f;
  const antler = colors.antler ?? 0x8d6e63;
  const nose = colors.nose ?? 0x3e2723;
  return (
    <group>
      <SoftBody color={body} w={15} d={16} h={15} />
      <Vox position={[0, 5, 14]} size={[11, 9, 9]} color={body} />
      <Vox position={[0, 9, 13]} size={[4, 4, 3.5]} color={nose} />
      <EyePair y={7} z={17} spread={4} />
      {/* antler trunks */}
      <Vox position={[-5.5, 0, 21]} size={[3, 3, 7]} color={antler} />
      <Vox position={[5.5, 0, 21]} size={[3, 3, 7]} color={antler} />
      {/* palm */}
      <Vox position={[-9.5, 0, 24]} size={[10, 3, 3.5]} color={antler} />
      <Vox position={[9.5, 0, 24]} size={[10, 3, 3.5]} color={antler} />
      {/* tines */}
      <Vox position={[-12, 0, 26.5]} size={[2.5, 2.5, 6]} color={antler} />
      <Vox position={[-8, 2, 27]} size={[2.2, 2.2, 5]} color={antler} />
      <Vox position={[12, 0, 26.5]} size={[2.5, 2.5, 6]} color={antler} />
      <Vox position={[8, 2, 27]} size={[2.2, 2.2, 5]} color={antler} />
      <Vox position={[-5, -1, 25]} size={[2, 2, 4]} color={antler} />
      <Vox position={[5, -1, 25]} size={[2, 2, 4]} color={antler} />
      <Legs color={0x6d4c41} spread={5} thick={3.5} height={8} />
      <Vox position={[0, -8.5, 11]} size={[4, 5, 6]} color={0x6d4c41} />
    </group>
  );
}

function Rhino({ colors }: { colors: Colors }) {
  const body = colors.body ?? 0x90a4ae;
  const horn = colors.horn ?? 0xcfd8dc;
  return (
    <group>
      <SoftBody color={body} w={16} d={16} h={15} />
      <Vox position={[0, 5, 14]} size={[12, 11, 10]} color={body} />
      {/* snout + horn */}
      <Vox position={[0, 9, 13]} size={[6, 6, 6]} color={0x78909c} />
      <Vox position={[0, 11.5, 15]} size={[3, 3, 7]} color={horn} />
      <Vox position={[0, 11.5, 18]} size={[2.2, 2.2, 3]} color={0xeceff1} />
      <Vox position={[0, 10, 12]} size={[2.5, 2.5, 3.5]} color={horn} />
      <EyePair y={7} z={17.5} spread={4.5} />
      {/* ears */}
      <Vox position={[-6, 0, 20]} size={[3, 2.5, 4]} color={body} />
      <Vox position={[6, 0, 20]} size={[3, 2.5, 4]} color={body} />
      <Legs color={0x607d8b} spread={5.5} thick={4} height={8} />
      <Vox position={[0, -9, 10]} size={[4.5, 5.5, 6]} color={0x607d8b} />
    </group>
  );
}

function Frog({ colors }: { colors: Colors }) {
  const body = colors.body ?? 0x66bb6a;
  const belly = colors.belly ?? 0xc5e1a5;
  return (
    <group>
      <SoftBody color={body} w={16} d={16} h={11} position={[0, 0, 10]} />
      <Vox position={[0, 5, 9]} size={[11, 4, 7]} color={belly} />
      {/* bulging eyes */}
      <Vox position={[-5.5, 5, 16]} size={[6, 6, 6]} color={body} />
      <Vox position={[5.5, 5, 16]} size={[6, 6, 6]} color={body} />
      <Vox position={[-5.5, 6.5, 18]} size={[3.2, 3.2, 3.2]} color={0xffffff} />
      <Vox position={[5.5, 6.5, 18]} size={[3.2, 3.2, 3.2]} color={0xffffff} />
      <Vox position={[-5.5, 6.8, 19]} size={[2, 2, 2]} color={0x111111} />
      <Vox position={[5.5, 6.8, 19]} size={[2, 2, 2]} color={0x111111} />
      {/* mouth */}
      <Vox position={[0, 8, 11]} size={[8, 2, 2]} color={0x43a047} />
      {/* legs */}
      <Vox position={[-8, 2, 4]} size={[5, 6, 6]} color={body} />
      <Vox position={[8, 2, 4]} size={[5, 6, 6]} color={body} />
      <Vox position={[-9, 5, 2]} size={[4, 6, 2.5]} color={0x43a047} />
      <Vox position={[9, 5, 2]} size={[4, 6, 2.5]} color={0x43a047} />
    </group>
  );
}

function Pig({ colors }: { colors: Colors }) {
  const body = colors.body ?? 0xf8bbd0;
  const snout = colors.snout ?? 0xf48fb1;
  return (
    <group>
      <SoftBody color={body} w={15} d={15} h={14} />
      <Vox position={[0, 5, 12]} size={[10, 8, 8]} color={body} />
      {/* snout */}
      <Vox position={[0, 9.5, 13]} size={[7, 5, 5.5]} color={snout} />
      <Vox position={[-2, 11.2, 14]} size={[1.8, 1.8, 1.8]} color={0x880e4f} />
      <Vox position={[2, 11.2, 14]} size={[1.8, 1.8, 1.8]} color={0x880e4f} />
      <EyePair y={7} z={16.5} spread={4} />
      {/* ears */}
      <Vox position={[-6.5, 1, 19]} size={[4.5, 2.5, 5]} color={snout} />
      <Vox position={[6.5, 1, 19]} size={[4.5, 2.5, 5]} color={snout} />
      <Legs color={body} spread={5} thick={3.2} height={7} />
      <Vox position={[0, -8, 11]} size={[3, 5, 4]} color={snout} />
    </group>
  );
}

function Dog({ colors }: { colors: Colors }) {
  const body = colors.body ?? 0xffcc80;
  const ear = colors.ear ?? 0xef6c00;
  const nose = colors.nose ?? 0x212121;
  return (
    <group>
      <SoftBody color={body} w={14} d={14} h={14} />
      <Vox position={[0, 5, 13]} size={[10, 9, 9]} color={body} />
      {/* floppy ears */}
      <Vox position={[-8, 1, 14]} size={[4, 3.5, 9]} color={ear} />
      <Vox position={[8, 1, 14]} size={[4, 3.5, 9]} color={ear} />
      <Vox position={[-8, 2, 10]} size={[3.5, 3, 5]} color={0xe65100} />
      <Vox position={[8, 2, 10]} size={[3.5, 3, 5]} color={0xe65100} />
      {/* muzzle */}
      <Vox position={[0, 8.5, 12]} size={[6, 5, 5]} color={0xffe0b2} />
      <Vox position={[0, 10.5, 13]} size={[3, 2.5, 2.5]} color={nose} />
      <EyePair y={7} z={16.5} spread={3.8} />
      <Legs color={body} spread={4.8} thick={3} height={7} />
      <Vox position={[0, -8.5, 10]} size={[3.5, 6, 4]} color={ear} />
    </group>
  );
}

function Cow({ colors }: { colors: Colors }) {
  const body = colors.body ?? 0xffffff;
  const spot = colors.spot ?? 0x212121;
  const nose = colors.nose ?? 0xf8bbd0;
  return (
    <group>
      <SoftBody color={body} w={16} d={16} h={15} />
      <Vox position={[-5, -2, 14]} size={[7, 6, 7]} color={spot} />
      <Vox position={[5.5, 3, 10]} size={[6, 6, 6]} color={spot} />
      <Vox position={[2, -4, 8]} size={[5, 5, 5]} color={spot} />
      <Vox position={[0, 6, 14]} size={[11, 9, 9]} color={body} />
      <Vox position={[0, 10, 13]} size={[7, 5, 5]} color={nose} />
      <Vox position={[-2, 11.5, 14]} size={[1.6, 1.6, 1.6]} color={0x880e4f} />
      <Vox position={[2, 11.5, 14]} size={[1.6, 1.6, 1.6]} color={0x880e4f} />
      <EyePair y={7.5} z={17} spread={4.2} />
      {/* horns */}
      <Vox position={[-6, 0, 20.5]} size={[2.5, 2.5, 5]} color={0xfff8e1} />
      <Vox position={[6, 0, 20.5]} size={[2.5, 2.5, 5]} color={0xfff8e1} />
      <Legs color={0xeeeeee} spread={5.2} thick={3.5} height={8} />
      <Vox position={[0, -9, 11]} size={[4, 5, 5]} color={spot} />
    </group>
  );
}

const SPECIES: Record<string, (colors: Colors) => ReactNode> = {
  chicken: (c) => <Chicken colors={c} />,
  chick: (c) => <Chick colors={c} />,
  elephant: (c) => <Elephant colors={c} />,
  penguin: (c) => <Penguin colors={c} />,
  cardinal: (c) => <Cardinal colors={c} />,
  panda: (c) => <Panda colors={c} />,
  moose: (c) => <Moose colors={c} />,
  rhino: (c) => <Rhino colors={c} />,
  frog: (c) => <Frog colors={c} />,
  pig: (c) => <Pig colors={c} />,
  dog: (c) => <Dog colors={c} />,
  cow: (c) => <Cow colors={c} />,
};

interface VoxelAnimalModelProps {
  species: string;
  colors: Colors;
}

export function VoxelAnimalModel({ species, colors }: VoxelAnimalModelProps) {
  const render = SPECIES[species] ?? SPECIES.chicken;
  return <group>{render(colors)}</group>;
}

export function PartnerVoxelModel() {
  return (
    <VoxelAnimalModel
      species="chick"
      colors={{
        body: 0x4fc3f7,
        beak: 0xff7043,
        legs: 0xff7043,
        eyes: 0x1a237e,
      }}
    />
  );
}
