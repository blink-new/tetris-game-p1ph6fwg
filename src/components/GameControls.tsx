import React from 'react';
import { Button } from './ui/button';
import { Play, Pause, RotateCcw, Square } from 'lucide-react';

interface GameControlsProps {
  isPlaying: boolean;
  isPaused: boolean;
  gameOver: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export function GameControls({
  isPlaying,
  isPaused,
  gameOver,
  onStart,
  onPause,
  onReset
}: GameControlsProps) {
  return (
    <div className="space-y-3">
      <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50 backdrop-blur-sm">
        <h3 className="text-sm font-medium text-slate-300 mb-3">Controls</h3>
        
        <div className="space-y-2">
          {!isPlaying || gameOver ? (
            <Button 
              onClick={onStart} 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Play className="w-4 h-4 mr-2" />
              {gameOver ? 'New Game' : 'Start'}
            </Button>
          ) : (
            <Button 
              onClick={onPause} 
              variant="outline" 
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              <Pause className="w-4 h-4 mr-2" />
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
          )}
          
          <Button 
            onClick={onReset} 
            variant="outline"
            className="w-full border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>
      
      <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50 backdrop-blur-sm">
        <h3 className="text-sm font-medium text-slate-300 mb-3">Keys</h3>
        <div className="space-y-2 text-xs text-slate-400">
          <div className="flex justify-between">
            <span>Move</span>
            <span>← →</span>
          </div>
          <div className="flex justify-between">
            <span>Rotate</span>
            <span>↑ / Z / X</span>
          </div>
          <div className="flex justify-between">
            <span>Soft Drop</span>
            <span>↓</span>
          </div>
          <div className="flex justify-between">
            <span>Hard Drop</span>
            <span>Space</span>
          </div>
          <div className="flex justify-between">
            <span>Pause</span>
            <span>P</span>
          </div>
        </div>
      </div>
    </div>
  );
}