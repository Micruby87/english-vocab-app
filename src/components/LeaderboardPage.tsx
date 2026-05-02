// src/components/LeaderboardPage.tsx

import React, { useEffect, useState } from 'react';
import { ArrowLeft, Crown } from 'lucide-react';
import { getLeaderboard } from '../utils/api';
import type { LeaderboardEntry } from '../utils/api';

interface LeaderboardPageProps {
  onBack: () => void;
}

export default function LeaderboardPage({ onBack }: LeaderboardPageProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      const data = await getLeaderboard();
      setLeaderboard(data);
      setLoading(false);
    };
    fetchLeaderboard();
  }, []);

  return (
    <div style={{ minHeight: '100dvh', background: '#f0f2f5', paddingBottom: 20 }}>
      <div style={{
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        borderRadius: '0 0 28px 28px',
        padding: '48px 20px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 12, padding: '8px 12px' }}>
          <ArrowLeft style={{ width: 20, height: 20, color: '#fff' }} />
        </button>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', margin: 0 }}>🏆 排行榜</h1>
        <div style={{ width: 44, height: 44 }} /> {/* Placeholder for alignment */}
      </div>

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#64748b' }}>加载中...</div>
        ) : leaderboard.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#64748b' }}>暂无数据</div>
        ) : (
          leaderboard.map((entry, index) => (
            <div key={entry.id} style={{
              background: '#fff', borderRadius: 16, padding: '16px 20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', background: index === 0 ? '#fbbf24' : index === 1 ? '#94a3b8' : index === 2 ? '#f59e0b' : '#e2e8f0',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700,
                color: index < 3 ? '#fff' : '#64748b',
              }}>
                {index === 0 ? <Crown size={20} /> : index + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e' }}>{entry.name || '匿名玩家'}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>最高关卡: {entry.level}</div>
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#f59e0b' }}>{entry.score} 💰</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
