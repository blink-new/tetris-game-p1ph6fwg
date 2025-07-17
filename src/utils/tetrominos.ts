import { TetrominoType, Tetromino, Position } from '../types/tetris';

export const TETROMINO_SHAPES: Record<TetrominoType, number[][][]> = {
  I: [
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0]
    ]
  ],
  O: [
    [
      [1, 1],
      [1, 1]
    ]
  ],
  T: [
    [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 1, 0]
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0]
    ],
    [
      [0, 1, 0],
      [1, 1, 0],
      [0, 1, 0]
    ]
  ],
  S: [
    [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ],
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 0, 1]
    ]
  ],
  Z: [
    [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ],
    [
      [0, 0, 1],
      [0, 1, 1],
      [0, 1, 0]
    ]
  ],
  J: [
    [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    [
      [0, 1, 1],
      [0, 1, 0],
      [0, 1, 0]
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 1]
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0]
    ]
  ],
  L: [
    [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1]
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [1, 0, 0]
    ],
    [
      [1, 1, 0],
      [0, 1, 0],
      [0, 1, 0]
    ]
  ]
};

export const TETROMINO_TYPES: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

export function createRandomTetromino(): Tetromino {
  const type = TETROMINO_TYPES[Math.floor(Math.random() * TETROMINO_TYPES.length)];
  const shape = TETROMINO_SHAPES[type][0];
  
  // Calculate starting position - center horizontally and start above the board
  const startX = Math.floor((10 - shape[0].length) / 2);
  const startY = -shape.length; // Start above the visible board
  
  return {
    type,
    shape,
    position: { x: startX, y: startY },
    rotation: 0
  };
}

export function rotateTetromino(tetromino: Tetromino, clockwise: boolean = true): Tetromino {
  const shapes = TETROMINO_SHAPES[tetromino.type];
  const rotationCount = shapes.length;
  
  let newRotation;
  if (clockwise) {
    newRotation = (tetromino.rotation + 1) % rotationCount;
  } else {
    newRotation = (tetromino.rotation - 1 + rotationCount) % rotationCount;
  }
  
  return {
    ...tetromino,
    rotation: newRotation,
    shape: shapes[newRotation]
  };
}

export function moveTetromino(tetromino: Tetromino, dx: number, dy: number): Tetromino {
  return {
    ...tetromino,
    position: {
      x: tetromino.position.x + dx,
      y: tetromino.position.y + dy
    }
  };
}

export function getTetrominoColor(type: TetrominoType): string {
  const colors: Record<TetrominoType, string> = {
    I: 'hsl(var(--tetris-i))',
    O: 'hsl(var(--tetris-o))',
    T: 'hsl(var(--tetris-t))',
    S: 'hsl(var(--tetris-s))',
    Z: 'hsl(var(--tetris-z))',
    J: 'hsl(var(--tetris-j))',
    L: 'hsl(var(--tetris-l))'
  };
  return colors[type];
}