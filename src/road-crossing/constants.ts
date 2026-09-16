export const minTileIndex = -28;
export const maxTileIndex = 28;
export const tilesPerRow = maxTileIndex - minTileIndex + 1;
export const tileSize = 44;

export const INITIAL_GRASS_ROWS = 8;
export const ROWS_PER_BATCH = 28;
export const ROWS_BUFFER = 15;
export const MOVE_STEP_TIME = 0.16;
export const MAX_PENDING_MOVES = 2;
/** Orthographic base frustum (larger = more ground visible at zoom 1). */
export const CAMERA_VIEW_SIZE = 340;
export const CAMERA_ZOOM_DEFAULT = 1;
export const CAMERA_ZOOM_MIN = 0.5;
export const CAMERA_ZOOM_MAX = 2.4;
export const CAMERA_ZOOM_STEP = 0.15;

/** Chained Crossing (local now, online later) */
/** Max gap on each axis (row + tile) — vertical/forward can be up to 4. */
export const CHAIN_MAX_TILE_DISTANCE = 4;
/** World Z height where the chain hangs between players. */
export const CHAIN_HEIGHT_Z = 18;
export const MAX_CHAIN_PLAYERS = 2;
export type PlayerSlot = 0 | 1;

export const COIN_POINTS_VALUE = 10;
