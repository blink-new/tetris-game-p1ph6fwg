import React from 'react';
import { GameState, TetrominoType } from '../types/tetris';
import { getTetrominoColor } from '../utils/tetrominos';
import { getGhostPosition, placeTetromino } from '../utils/gameLogic';

interface GameBoardProps {
  gameState: GameState;
}

export function GameBoard({ gameState }: GameBoardProps) {
  const { board, currentPiece } = gameState;
  
  // Create display board with current piece and ghost piece
  const displayBoard = board.map(row => [...row]);
  
  // Add ghost piece
  if (currentPiece) {
    const ghostPiece = getGhostPosition(board, currentPiece);
    for (let y = 0; y < ghostPiece.shape.length; y++) {
      for (let x = 0; x < ghostPiece.shape[y].length; x++) {
        if (ghostPiece.shape[y][x]) {
          const boardX = ghostPiece.position.x + x;
          const boardY = ghostPiece.position.y + y;
          
          if (boardY >= 0 && boardY < 20 && boardX >= 0 && boardX < 10 && !displayBoard[boardY][boardX]) {
            displayBoard[boardY][boardX] = 'GHOST' as TetrominoType;
          }
        }
      }
    }
    
    // Add current piece
    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x]) {
          const boardX = currentPiece.position.x + x;
          const boardY = currentPiece.position.y + y;
          
          if (boardY >= 0 && boardY < 20 && boardX >= 0 && boardX < 10) {
            displayBoard[boardY][boardX] = currentPiece.type;
          }
        }
      }
    }
  }
  
  const getCellStyle = (cell: TetrominoType | null | 'GHOST') => {
    if (!cell) {
      return 'bg-slate-800/30 border border-slate-700/50';
    }
    
    if (cell === 'GHOST') {
      return 'bg-slate-500/20 border border-slate-400/30';
    }
    
    const color = getTetrominoColor(cell);
    return `border border-slate-600/50 shadow-sm`;
  };
  
  const getCellColor = (cell: TetrominoType | null | 'GHOST') => {
    if (!cell || cell === 'GHOST') return {};
    
    const color = getTetrominoColor(cell);
    return { backgroundColor: color };
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-10 gap-0 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50 backdrop-blur-sm">
        {displayBoard.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              className={`w-6 h-6 ${getCellStyle(cell)} transition-all duration-75`}
              style={getCellColor(cell)}
            />
          ))
        )}
      </div>
      
      {/* Grid overlay for better visibility */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="grid grid-cols-10 gap-0 p-4 h-full">
          {Array(200).fill(null).map((_, i) => (
            <div key={i} className="border-r border-b border-slate-800/20 last:border-r-0" />
          ))}
        </div>
      </div>
    </div>
  );
}