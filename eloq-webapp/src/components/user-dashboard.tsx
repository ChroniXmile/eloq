// User dashboard component
// This component displays personalized information for the logged-in user

import React from 'react';
import { User, RecentlyViewedItem } from '../models/user';
import { Player } from '../models/player';
import { Tournament } from '../models/tournament';

interface UserDashboardProps {
  user: User;
  favoritePlayers: Player[];
  recentlyViewed: (RecentlyViewedItem & { name: string })[];
  upcomingTournaments: Tournament[];
  onPlayerClick?: (playerId: string) => void;
  onTournamentClick?: (tournamentId: string) => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({
  user,
  favoritePlayers,
  recentlyViewed,
  upcomingTournaments,
  onPlayerClick,
  onTournamentClick
}) => {
  return (
    <div className="user-dashboard">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          {user.avatarUrl && (
            <img 
              src={user.avatarUrl} 
              alt={user.displayName} 
              className="w-16 h-16 rounded-full mr-4"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user.displayName}</h1>
            <p className="text-gray-600">@{user.username}</p>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          Last login: {user.lastLogin.toLocaleDateString()}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Favorite Players */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Favorite Players</h2>
            <span className="text-sm text-gray-500">
              {favoritePlayers.length} players
            </span>
          </div>
          
          {favoritePlayers.length === 0 ? (
            <p className="text-gray-600">You haven't added any favorite players yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {favoritePlayers.map((player) => (
                <div 
                  key={player.id}
                  className="bg-gray-50 rounded-lg p-3 flex items-center cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => onPlayerClick && onPlayerClick(player.id)}
                >
                  {player.avatarUrl && (
                    <img 
                      src={player.avatarUrl} 
                      alt={player.name} 
                      className="w-10 h-10 rounded-full mr-3"
                    />
                  )}
                  <div>
                    <div className="font-medium">{player.name}</div>
                    <div className="text-sm text-gray-600">
                      #{player.ranking} • {player.rating} • {player.winRate}% win rate
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Recently Viewed */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Recently Viewed</h2>
            <span className="text-sm text-gray-500">
              {recentlyViewed.length} items
            </span>
          </div>
          
          {recentlyViewed.length === 0 ? (
            <p className="text-gray-600">You haven't viewed any players or tournaments recently.</p>
          ) : (
            <div className="space-y-3">
              {recentlyViewed.slice(0, 10).map((item, index) => (
                <div 
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => {
                    if (item.entityType === 'player' && onPlayerClick) {
                      onPlayerClick(item.entityId);
                    } else if (item.entityType === 'tournament' && onTournamentClick) {
                      onTournamentClick(item.entityId);
                    }
                  }}
                >
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-600">
                      {item.entityType === 'player' ? 'Player' : 'Tournament'} • {item.timestamp.toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {item.entityType === 'player' ? '👤' : '🏆'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Upcoming Tournaments */}
        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Upcoming Tournaments</h2>
            <span className="text-sm text-gray-500">
              {upcomingTournaments.length} tournaments
            </span>
          </div>
          
          {upcomingTournaments.length === 0 ? (
            <p className="text-gray-600">No upcoming tournaments at this time.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingTournaments.map((tournament) => (
                <div 
                  key={tournament.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onTournamentClick && onTournamentClick(tournament.id)}
                >
                  <h3 className="font-bold text-lg mb-2">{tournament.name}</h3>
                  <div className="text-sm text-gray-600 mb-1">
                    📅 {tournament.date.toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    📍 {tournament.location}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-green-600">
                      ${tournament.prizePool.toLocaleString()}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {tournament.tier}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;