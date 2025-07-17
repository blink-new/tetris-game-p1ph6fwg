import { GameState, Tetromino, TetrominoType } from '../types/tetris';
import { createRandomTetromino } from './tetrominos';

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export function createEmptyBoard(): (TetrominoType | null)[][] {
  return Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null));
}

export function isValidPosition(
  board: (TetrominoType | null)[][],
  tetromino: Tetromino
): boolean {
  for (let y = 0; y < tetromino.shape.length; y++) {
    for (let x = 0; x < tetromino.shape[y].length; x++) {
      if (tetromino.shape[y][x]) {
        const boardX = tetromino.position.x + x;
        const boardY = tetromino.position.y + y;
        
        // Check horizontal boundaries
        if (boardX < 0 || boardX >= BOARD_WIDTH) {
          return false;
        }
        
        // Check bottom boundary
        if (boardY >= BOARD_HEIGHT) {
          return false;
        }
        
        // Check collision with existing pieces (only for visible board area)
        if (boardY >= 0 && board[boardY][boardX]) {
          return false;
        }
      }
    }
  }
  return true;
}

export function placeTetromino(
  board: (TetrominoType | null)[][],
  tetromino: Tetromino
): (TetrominoType | null)[][] {
  const newBoard = board.map(row => [...row]);
  
  for (let y = 0; y < tetromino.shape.length; y++) {
    for (let x = 0; x < tetromino.shape[y].length; x++) {
      if (tetromino.shape[y][x]) {
        const boardX = tetromino.position.x + x;
        const boardY = tetromino.position.y + y;
        
        if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
          newBoard[boardY][boardX] = tetromino.type;
        }
      }
    }
  }
  
  return newBoard;
}

export function clearLines(board: (TetrominoType | null)[][]): {
  newBoard: (TetrominoType | null)[][];
  linesCleared: number;
} {
  const fullLines: number[] = [];
  
  // Find full lines
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    if (board[y].every(cell => cell !== null)) {
      fullLines.push(y);
    }
  }
  
  if (fullLines.length === 0) {
    return { newBoard: board, linesCleared: 0 };
  }
  
  // Remove full lines and add empty lines at the top
  const newBoard = board.filter((_, index) => !fullLines.includes(index));
  const emptyLines = Array(fullLines.length).fill(null).map(() => Array(BOARD_WIDTH).fill(null));
  
  return {
    newBoard: [...emptyLines, ...newBoard],
    linesCleared: fullLines.length
  };
}

export function calculateScore(linesCleared: number, level: number): number {
  const baseScores = [0, 40, 100, 300, 1200];
  return baseScores[linesCleared] * (level + 1);
}

export function calculateLevel(totalLines: number): number {
  return Math.floor(totalLines / 10);
}

export function getDropSpeed(level: number): number {
  // Speed in milliseconds - gets faster with each level
  return Math.max(50, 1000 - (level * 50));
}

export function getGhostPosition(
  board: (TetrominoType | null)[][],
  tetromino: Tetromino
): Tetromino {
  let ghostPiece = { ...tetromino };
  
  // Move down until collision
  while (isValidPosition(board, { ...ghostPiece, position: { ...ghostPiece.position, y: ghostPiece.position.y + 1 } })) {
    ghostPiece.position.y++;
  }
  
  return ghostPiece;
}

export function createInitialGameState(): GameState {
  return {
    board: createEmptyBoard(),
    currentPiece: createRandomTetromino(),
    nextPiece: createRandomTetromino(),
    score: 0,
    level: 0,
    lines: 0,
    isPlaying: false,
    isPaused: false,
    gameOver: false
  };
}