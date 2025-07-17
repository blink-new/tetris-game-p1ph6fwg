import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Tetromino } from '../types/tetris';
import {
  createInitialGameState,
  isValidPosition,
  placeTetromino,
  clearLines,
  calculateScore,
  calculateLevel,
  getDropSpeed
} from '../utils/gameLogic';
import { createRandomTetromino, rotateTetromino, moveTetromino } from '../utils/tetrominos';

export function useGameLogic() {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState);
  const gameLoopRef = useRef<number>();
  const lastDropTimeRef = useRef<number>(0);

  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...createInitialGameState(),
      isPlaying: true,
      currentPiece: prev.currentPiece || createRandomTetromino(),
      nextPiece: prev.nextPiece || createRandomTetromino()
    }));
    lastDropTimeRef.current = Date.now();
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPaused: !prev.isPaused
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState(createInitialGameState());
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
  }, []);

  const spawnNewPiece = useCallback(() => {
    setGameState(prev => {
      const newPiece = prev.nextPiece || createRandomTetromino();
      
      // Check if new piece can be placed - only check the parts that would be on the visible board
      let canPlace = true;
      for (let y = 0; y < newPiece.shape.length; y++) {
        for (let x = 0; x < newPiece.shape[y].length; x++) {
          if (newPiece.shape[y][x]) {
            const boardX = newPiece.position.x + x;
            const boardY = newPiece.position.y + y;
            
            // Only check collision for pieces that would appear on the visible board
            if (boardY >= 0 && boardY < 20 && boardX >= 0 && boardX < 10) {
              if (prev.board[boardY][boardX]) {
                canPlace = false;
                break;
              }
            }
          }
        }
        if (!canPlace) break;
      }
      
      if (!canPlace) {
        return {
          ...prev,
          gameOver: true,
          isPlaying: false
        };
      }
      
      return {
        ...prev,
        currentPiece: newPiece,
        nextPiece: createRandomTetromino()
      };
    });
  }, []);

  const dropPiece = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.gameOver || prev.isPaused || !prev.isPlaying) {
        return prev;
      }

      const movedPiece = moveTetromino(prev.currentPiece, 0, 1);
      
      if (isValidPosition(prev.board, movedPiece)) {
        return {
          ...prev,
          currentPiece: movedPiece
        };
      } else {
        // Piece has landed
        const newBoard = placeTetromino(prev.board, prev.currentPiece);
        const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
        
        const newLines = prev.lines + linesCleared;
        const newLevel = calculateLevel(newLines);
        const newScore = prev.score + calculateScore(linesCleared, prev.level);
        
        return {
          ...prev,
          board: clearedBoard,
          currentPiece: null,
          score: newScore,
          level: newLevel,
          lines: newLines
        };
      }
    });
  }, []);

  const movePiece = useCallback((dx: number, dy: number) => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.gameOver || prev.isPaused || !prev.isPlaying) {
        return prev;
      }

      const movedPiece = moveTetromino(prev.currentPiece, dx, dy);
      
      if (isValidPosition(prev.board, movedPiece)) {
        return {
          ...prev,
          currentPiece: movedPiece
        };
      }
      
      return prev;
    });
  }, []);

  const rotatePiece = useCallback((clockwise: boolean = true) => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.gameOver || prev.isPaused || !prev.isPlaying) {
        return prev;
      }

      const rotatedPiece = rotateTetromino(prev.currentPiece, clockwise);
      
      if (isValidPosition(prev.board, rotatedPiece)) {
        return {
          ...prev,
          currentPiece: rotatedPiece
        };
      }
      
      // Try wall kicks
      const wallKicks = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: -1 },
        { x: 1, y: -1 },
        { x: -1, y: -1 }
      ];
      
      for (const kick of wallKicks) {
        const kickedPiece = moveTetromino(rotatedPiece, kick.x, kick.y);
        if (isValidPosition(prev.board, kickedPiece)) {
          return {
            ...prev,
            currentPiece: kickedPiece
          };
        }
      }
      
      return prev;
    });
  }, []);

  const hardDrop = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.gameOver || prev.isPaused || !prev.isPlaying) {
        return prev;
      }

      let droppedPiece = prev.currentPiece;
      
      // Drop until collision
      while (isValidPosition(prev.board, moveTetromino(droppedPiece, 0, 1))) {
        droppedPiece = moveTetromino(droppedPiece, 0, 1);
      }
      
      // Place the piece
      const newBoard = placeTetromino(prev.board, droppedPiece);
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
      
      const newLines = prev.lines + linesCleared;
      const newLevel = calculateLevel(newLines);
      const newScore = prev.score + calculateScore(linesCleared, prev.level);
      
      return {
        ...prev,
        board: clearedBoard,
        currentPiece: null,
        score: newScore,
        level: newLevel,
        lines: newLines
      };
    });
  }, []);

  // Game loop
  useEffect(() => {
    if (!gameState.isPlaying || gameState.isPaused || gameState.gameOver) {
      return;
    }

    const gameLoop = () => {
      const now = Date.now();
      const dropSpeed = getDropSpeed(gameState.level);
      
      if (now - lastDropTimeRef.current > dropSpeed) {
        dropPiece();
        lastDropTimeRef.current = now;
      }
      
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.isPlaying, gameState.isPaused, gameState.gameOver, gameState.level, dropPiece]);

  // Spawn new piece when current piece is null
  useEffect(() => {
    if (gameState.isPlaying && !gameState.gameOver && !gameState.currentPiece) {
      const timer = setTimeout(spawnNewPiece, 100);
      return () => clearTimeout(timer);
    }
  }, [gameState.isPlaying, gameState.gameOver, gameState.currentPiece, spawnNewPiece]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!gameState.isPlaying || gameState.gameOver) {
        return;
      }

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          movePiece(-1, 0);
          break;
        case 'ArrowRight':
          event.preventDefault();
          movePiece(1, 0);
          break;
        case 'ArrowDown':
          event.preventDefault();
          movePiece(0, 1);
          break;
        case 'ArrowUp':
        case 'z':
        case 'Z':
          event.preventDefault();
          rotatePiece(true);
          break;
        case 'x':
        case 'X':
          event.preventDefault();
          rotatePiece(false);
          break;
        case ' ':
          event.preventDefault();
          hardDrop();
          break;
        case 'p':
        case 'P':
          event.preventDefault();
          pauseGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.isPlaying, gameState.gameOver, movePiece, rotatePiece, hardDrop, pauseGame]);

  return {
    gameState,
    startGame,
    pauseGame,
    resetGame,
    movePiece,
    rotatePiece,
    hardDrop
  };
}