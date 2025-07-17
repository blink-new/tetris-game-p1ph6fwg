import React from 'react';
import { GameStats as GameStatsType } from '../types/tetris';

interface GameStatsProps {
  stats: GameStatsType;
}

export function GameStats({ stats }: GameStatsProps) {
  return (
    <div className="space-y-4">
      <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50 backdrop-blur-sm">
        <h3 className="text-sm font-medium text-slate-300 mb-3">Score</h3>
        <div className="text-2xl font-bold text-white">
          {stats.score.toLocaleString()}
        </div>
      </div>
      
      <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50 backdrop-blur-sm">
        <h3 className="text-sm font-medium text-slate-300 mb-3">Level</h3>
        <div className="text-2xl font-bold text-primary">
          {stats.level}
        </div>
      </div>
      
      <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50 backdrop-blur-sm">
        <h3 className="text-sm font-medium text-slate-300 mb-3">Lines</h3>
        <div className="text-2xl font-bold text-accent">
          {stats.lines}
        </div>
      </div>
    </div>
  );
}