import React from 'react';
import { GameBoard } from './components/GameBoard';
import { NextPiece } from './components/NextPiece';
import { GameStats } from './components/GameStats';
import { GameControls } from './components/GameControls';
import { useGameLogic } from './hooks/useGameLogic';

function App() {
  const { gameState, startGame, pauseGame, resetGame } = useGameLogic();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-inter">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Tetris
          </h1>
          <p className="text-slate-400 text-lg">
            Classic puzzle game - Arrange blocks to clear lines!
          </p>
        </div>

        {/* Game Layout */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_300px] gap-6 items-start">
            {/* Left Panel - Stats */}
            <div className="order-2 lg:order-1">
              <GameStats stats={{
                score: gameState.score,
                level: gameState.level,
                lines: gameState.lines
              }} />
            </div>

            {/* Center - Game Board */}
            <div className="order-1 lg:order-2 flex flex-col items-center">
              <GameBoard gameState={gameState} />
              
              {/* Game Status */}
              {gameState.gameOver && (
                <div className="mt-4 text-center">
                  <div className="bg-destructive/20 border border-destructive/50 rounded-lg p-4 backdrop-blur-sm">
                    <h2 className="text-xl font-bold text-destructive mb-2">Game Over!</h2>
                    <p className="text-slate-300">Final Score: {gameState.score.toLocaleString()}</p>
                  </div>
                </div>
              )}
              
              {gameState.isPaused && gameState.isPlaying && (
                <div className="mt-4 text-center">
                  <div className="bg-accent/20 border border-accent/50 rounded-lg p-4 backdrop-blur-sm">
                    <h2 className="text-xl font-bold text-accent">Paused</h2>
                    <p className="text-slate-300">Press P to resume</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel - Controls & Next Piece */}
            <div className="order-3 space-y-4">
              <NextPiece nextPiece={gameState.nextPiece} />
              <GameControls
                isPlaying={gameState.isPlaying}
                isPaused={gameState.isPaused}
                gameOver={gameState.gameOver}
                onStart={startGame}
                onPause={pauseGame}
                onReset={resetGame}
              />
            </div>
          </div>
        </div>

        {/* Mobile Instructions */}
        <div className="lg:hidden mt-8 text-center">
          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50 backdrop-blur-sm max-w-md mx-auto">
            <h3 className="text-sm font-medium text-slate-300 mb-2">Mobile Controls</h3>
            <p className="text-xs text-slate-400">
              Use the on-screen controls or connect a keyboard for the best experience
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;