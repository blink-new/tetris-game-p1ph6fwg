import React from 'react';
import { Tetromino } from '../types/tetris';
import { getTetrominoColor } from '../utils/tetrominos';

interface NextPieceProps {
  nextPiece: Tetromino | null;
}

export function NextPiece({ nextPiece }: NextPieceProps) {
  if (!nextPiece) return null;

  const color = getTetrominoColor(nextPiece.type);
  
  // Create a 4x4 grid for displaying the piece
  const displayGrid = Array(4).fill(null).map(() => Array(4).fill(false));
  
  // Center the piece in the grid
  const offsetX = Math.floor((4 - nextPiece.shape[0].length) / 2);
  const offsetY = Math.floor((4 - nextPiece.shape.length) / 2);
  
  for (let y = 0; y < nextPiece.shape.length; y++) {
    for (let x = 0; x < nextPiece.shape[y].length; x++) {
      if (nextPiece.shape[y][x]) {
        const gridX = x + offsetX;
        const gridY = y + offsetY;
        if (gridX >= 0 && gridX < 4 && gridY >= 0 && gridY < 4) {
          displayGrid[gridY][gridX] = true;
        }
      }
    }
  }

  return (
    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50 backdrop-blur-sm">
      <h3 className="text-sm font-medium text-slate-300 mb-3 text-center">Next</h3>
      <div className="grid grid-cols-4 gap-0.5 w-16 h-16 mx-auto">
        {displayGrid.map((row, y) =>
          row.map((filled, x) => (
            <div
              key={`${y}-${x}`}
              className={`w-3 h-3 rounded-sm ${
                filled 
                  ? 'border border-slate-600/50 shadow-sm' 
                  : 'bg-slate-800/20'
              }`}
              style={filled ? { backgroundColor: color } : {}}
            />
          ))
        )}
      </div>
    </div>
  );
}