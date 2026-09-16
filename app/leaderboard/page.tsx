'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Tab = 'score' | 'coins';

type ScoreEntry = { rank: number; username: string; value: number };
type CoinEntry = { rank: number; username: string; value: number; coinsCollected: number };

export default function LeaderboardPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('score');
  const [scoreRows, setScoreRows] = useState<ScoreEntry[]>([]);
  const [coinRows, setCoinRows] = useState<CoinEntry[]>([]);
  const [myStats, setMyStats] = useState<{
    username: string;
    roadBestScore: number;
    totalCoinPoints: number;
    totalCoinsCollected: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [scoreRes, coinRes, statsRes] = await Promise.all([
          fetch('/api/leaderboard/score'),
          fetch('/api/leaderboard/coin-points'),
          fetch('/api/player/stats'),
        ]);
        if (cancelled) return;
        if (scoreRes.ok) {
          const data = await scoreRes.json();
          setScoreRows(data.entries ?? []);
        }
        if (coinRes.ok) {
          const data = await coinRes.json();
          setCoinRows(data.entries ?? []);
        }
        if (statsRes.ok) {
          const data = await statsRes.json();
          setMyStats(data.stats ?? null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const rows = tab === 'score' ? scoreRows : coinRows;

  return (
    <div className="leaderboard-screen">
      <div className="leaderboard-card">
        <div className="leaderboard-top">
          <button type="button" className="leaderboard-back" onClick={() => router.push('/')}>
            ← Menu
          </button>
          <h1>Leaderboards</h1>
        </div>

        {myStats ? (
          <div className="leaderboard-you">
            <span>@{myStats.username}</span>
            <span>Best run: {myStats.roadBestScore}</span>
            <span>Coin points: {myStats.totalCoinPoints}</span>
          </div>
        ) : null}

        <div className="leaderboard-tabs" role="tablist">
          <button
            type="button"
            className={tab === 'score' ? 'active' : ''}
            onClick={() => setTab('score')}
          >
            Best score
          </button>
          <button
            type="button"
            className={tab === 'coins' ? 'active' : ''}
            onClick={() => setTab('coins')}
          >
            Coin points
          </button>
        </div>

        <p className="leaderboard-hint">
          {tab === 'score'
            ? 'Highest row score from Road Crossing (one best run per player).'
            : 'Total coin points from all runs (10 points per coin).'}
        </p>

        {loading ? (
          <p className="leaderboard-empty">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="leaderboard-empty">No entries yet — play Road Crossing and collect coins!</p>
        ) : (
          <ol className="leaderboard-list">
            {tab === 'score'
              ? scoreRows.map((row) => (
                  <li key={row.username} className={row.rank <= 3 ? `rank-${row.rank}` : ''}>
                    <span className="lb-rank">#{row.rank}</span>
                    <span className="lb-name">@{row.username}</span>
                    <span className="lb-value">{row.value}</span>
                  </li>
                ))
              : coinRows.map((row) => (
                  <li key={row.username} className={row.rank <= 3 ? `rank-${row.rank}` : ''}>
                    <span className="lb-rank">#{row.rank}</span>
                    <span className="lb-name">@{row.username}</span>
                    <span className="lb-value">
                      {row.value} <span className="lb-sub">({row.coinsCollected} coins)</span>
                    </span>
                  </li>
                ))}
          </ol>
        )}
      </div>
    </div>
  );
}
