import React, { useState } from 'react';
import './Leaderboard.css';

interface LeaderboardUser {
  id: number;
  username: string;
  stars: number;
  rank: number;
  badge: string;
  level: number;
  itemsSorted: number;
  streak: number;
}

// Sample leaderboard data
const sampleLeaderboard: LeaderboardUser[] = [
  { id: 1, username: 'EcoWarrior2024', stars: 2840, rank: 1, badge: '👑', level: 28, itemsSorted: 284, streak: 15 },
  { id: 2, username: 'GreenThumb', stars: 2650, rank: 2, badge: '🥇', level: 26, itemsSorted: 265, streak: 12 },
  { id: 3, username: 'RecycleMaster', stars: 2420, rank: 3, badge: '🥈', level: 24, itemsSorted: 242, streak: 10 },
  { id: 4, username: 'WasteBuster', stars: 2180, rank: 4, badge: '🥉', level: 21, itemsSorted: 218, streak: 8 },
  { id: 5, username: 'PlanetSaver', stars: 1950, rank: 5, badge: '⭐', level: 19, itemsSorted: 195, streak: 7 },
  { id: 6, username: 'EcoHero', stars: 1720, rank: 6, badge: '⭐', level: 17, itemsSorted: 172, streak: 6 },
  { id: 7, username: 'GreenMachine', stars: 1500, rank: 7, badge: '⭐', level: 15, itemsSorted: 150, streak: 5 },
  { id: 8, username: 'TrashTitan', stars: 1320, rank: 8, badge: '⭐', level: 13, itemsSorted: 132, streak: 4 },
  { id: 9, username: 'EcoChampion', stars: 1150, rank: 9, badge: '⭐', level: 11, itemsSorted: 115, streak: 3 },
  { id: 10, username: 'WasteWarrior', stars: 980, rank: 10, badge: '⭐', level: 9, itemsSorted: 98, streak: 2 },
  { id: 11, username: 'RecycleRookie', stars: 850, rank: 11, badge: '🌱', level: 8, itemsSorted: 85, streak: 2 },
  { id: 12, username: 'GreenNewbie', stars: 720, rank: 12, badge: '🌱', level: 7, itemsSorted: 72, streak: 1 },
  { id: 13, username: 'EcoBeginner', stars: 600, rank: 13, badge: '🌱', level: 6, itemsSorted: 60, streak: 1 },
  { id: 14, username: 'WasteLearner', stars: 480, rank: 14, badge: '🌱', level: 4, itemsSorted: 48, streak: 1 },
  { id: 15, username: 'SortingStar', stars: 350, rank: 15, badge: '🌱', level: 3, itemsSorted: 35, streak: 1 },
];

const Leaderboard: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'top10' | 'friends'>('all');
  const [currentUser] = useState<LeaderboardUser | null>({
    id: 16,
    username: 'You',
    stars: 240,
    rank: 16,
    badge: '🌱',
    level: 2,
    itemsSorted: 24,
    streak: 1,
  });

  const getDisplayData = () => {
    if (selectedFilter === 'top10') {
      return sampleLeaderboard.slice(0, 10);
    }
    return sampleLeaderboard;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return '#ffd700';
    if (rank === 2) return '#c0c0c0';
    if (rank === 3) return '#cd7f32';
    return '#2d5016';
  };

  const getRankGradient = (rank: number) => {
    if (rank === 1) return 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)';
    if (rank === 2) return 'linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%)';
    if (rank === 3) return 'linear-gradient(135deg, #cd7f32 0%, #e6a85c 100%)';
    return 'linear-gradient(135deg, #2d5016 0%, #3d6b1f 100%)';
  };

  const displayData = getDisplayData();

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h1 className="leaderboard-title">🏆 Leaderboard</h1>
        <p className="leaderboard-subtitle">Top Eco Warriors of Dubai</p>
      </div>

      <div className="leaderboard-filters">
        <button
          className={`filter-btn ${selectedFilter === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedFilter('all')}
        >
          All Players
        </button>
        <button
          className={`filter-btn ${selectedFilter === 'top10' ? 'active' : ''}`}
          onClick={() => setSelectedFilter('top10')}
        >
          Top 10
        </button>
        <button
          className={`filter-btn ${selectedFilter === 'friends' ? 'active' : ''}`}
          onClick={() => setSelectedFilter('friends')}
        >
          Friends
        </button>
      </div>

      {/* Podium for top 3 */}
      {selectedFilter === 'all' || selectedFilter === 'top10' ? (
        <div className="podium-container">
          {sampleLeaderboard.slice(0, 3).map((user, index) => (
            <div key={user.id} className={`podium-item podium-${index + 1}`}>
              <div className="podium-badge">{user.badge}</div>
              <div className="podium-avatar" style={{ background: getRankGradient(user.rank) }}>
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="podium-name">{user.username}</div>
              <div className="podium-stars">
                <span className="star-icon">⭐</span>
                {user.stars.toLocaleString()}
              </div>
              <div className="podium-level">Level {user.level}</div>
            </div>
          ))}
        </div>
      ) : null}

      {/* Leaderboard list */}
      <div className="leaderboard-list">
        {displayData.map((user, index) => (
          <div
            key={user.id}
            className={`leaderboard-item ${user.rank <= 3 ? 'top-three' : ''}`}
            style={{
              animationDelay: `${index * 0.05}s`,
            }}
          >
            <div className="item-rank" style={{ color: getRankColor(user.rank) }}>
              #{user.rank}
            </div>
            <div className="item-badge">{user.badge}</div>
            <div className="item-avatar" style={{ background: getRankGradient(user.rank) }}>
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="item-info">
              <div className="item-username">{user.username}</div>
              <div className="item-stats">
                <span className="stat-item">
                  <span className="stat-icon">📊</span>
                  Level {user.level}
                </span>
                <span className="stat-item">
                  <span className="stat-icon">♻️</span>
                  {user.itemsSorted} sorted
                </span>
                <span className="stat-item">
                  <span className="stat-icon">🔥</span>
                  {user.streak} day streak
                </span>
              </div>
            </div>
            <div className="item-stars">
              <span className="star-icon">⭐</span>
              <span className="star-count">{user.stars.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Current user's position */}
      {currentUser && (
        <div className="current-user-card">
          <div className="current-user-header">
            <span className="current-user-label">Your Position</span>
            <span className="current-user-rank">#{currentUser.rank}</span>
          </div>
          <div className="current-user-content">
            <div className="current-user-avatar" style={{ background: getRankGradient(currentUser.rank) }}>
              {currentUser.username.charAt(0).toUpperCase()}
            </div>
            <div className="current-user-info">
              <div className="current-user-name">{currentUser.username}</div>
              <div className="current-user-stats">
                <span>Level {currentUser.level}</span>
                <span>•</span>
                <span>{currentUser.itemsSorted} items sorted</span>
                <span>•</span>
                <span>{currentUser.streak} day streak</span>
              </div>
            </div>
            <div className="current-user-stars">
              <span className="star-icon">⭐</span>
              {currentUser.stars.toLocaleString()}
            </div>
          </div>
          <div className="progress-to-next">
            <div className="progress-label">Progress to next rank</div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${((currentUser.stars % 100) / 100) * 100}%` }}
              />
            </div>
            <div className="progress-text">
              {currentUser.stars % 100} / 100 stars to Level {currentUser.level + 1}
            </div>
          </div>
        </div>
      )}

      {/* Stats summary */}
      <div className="stats-summary">
        <div className="stat-card">
          <div className="stat-card-icon">👥</div>
          <div className="stat-card-value">{sampleLeaderboard.length}</div>
          <div className="stat-card-label">Active Players</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">⭐</div>
          <div className="stat-card-value">
            {sampleLeaderboard.reduce((sum, user) => sum + user.stars, 0).toLocaleString()}
          </div>
          <div className="stat-card-label">Total Stars Earned</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">♻️</div>
          <div className="stat-card-value">
            {sampleLeaderboard.reduce((sum, user) => sum + user.itemsSorted, 0).toLocaleString()}
          </div>
          <div className="stat-card-label">Items Recycled</div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
