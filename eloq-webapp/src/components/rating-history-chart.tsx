// Rating history chart component
// This component displays a player's rating history as a chart

import React from 'react';

interface RatingHistoryEntry {
  date: Date;
  rating: number;
}

interface RatingHistoryChartProps {
  playerName: string;
  ratingHistory: RatingHistoryEntry[];
}

const RatingHistoryChart: React.FC<RatingHistoryChartProps> = ({ playerName, ratingHistory }) => {
  // If no rating history, show a message
  if (ratingHistory.length === 0) {
    return (
      <div className="rating-history-chart bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Rating History for {playerName}</h2>
        <p className="text-gray-600">No rating history available for this player.</p>
      </div>
    );
  }

  // Find min and max ratings for scaling
  const ratings = ratingHistory.map(entry => entry.rating);
  const minRating = Math.min(...ratings);
  const maxRating = Math.max(...ratings);
  const ratingRange = maxRating - minRating || 1; // Avoid division by zero

  // Find min and max dates for scaling
  const dates = ratingHistory.map(entry => entry.date.getTime());
  const minDate = Math.min(...dates);
  const maxDate = Math.max(...dates);
  const dateRange = maxDate - minDate || 1; // Avoid division by zero

  // Chart dimensions
  const chartWidth = 600;
  const chartHeight = 300;
  const padding = 40;

  // Convert data points to coordinates
  const points = ratingHistory.map((entry, index) => {
    const x = padding + ((entry.date.getTime() - minDate) / dateRange) * (chartWidth - 2 * padding);
    const y = chartHeight - padding - ((entry.rating - minRating) / ratingRange) * (chartHeight - 2 * padding);
    return { x, y, date: entry.date, rating: entry.rating, index };
  });

  // Create path for the line
  let pathData = '';
  if (points.length > 0) {
    pathData = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      pathData += ` L ${points[i].x} ${points[i].y}`;
    }
  }

  return (
    <div className="rating-history-chart bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Rating History for {playerName}</h2>
      
      <div className="overflow-x-auto">
        <svg 
          width={chartWidth} 
          height={chartHeight} 
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="border border-gray-200 rounded"
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = padding + ratio * (chartHeight - 2 * padding);
            const ratingValue = maxRating - ratio * ratingRange;
            return (
              <g key={i}>
                <line 
                  x1={padding} 
                  y1={y} 
                  x2={chartWidth - padding} 
                  y2={y} 
                  stroke="#e5e7eb" 
                  strokeWidth="1" 
                />
                <text 
                  x={padding - 10} 
                  y={y + 4} 
                  textAnchor="end" 
                  fontSize="10" 
                  fill="#6b7280"
                >
                  {Math.round(ratingValue)}
                </text>
              </g>
            );
          })}
          
          {/* X-axis labels (dates) */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const dateValue = new Date(minDate + ratio * dateRange);
            const x = padding + ratio * (chartWidth - 2 * padding);
            return (
              <g key={i}>
                <text 
                  x={x} 
                  y={chartHeight - padding + 15} 
                  textAnchor="middle" 
                  fontSize="10" 
                  fill="#6b7280"
                >
                  {dateValue.toLocaleDateString()}
                </text>
              </g>
            );
          })}
          
          {/* Line */}
          {pathData && (
            <path 
              d={pathData} 
              fill="none" 
              stroke="#3b82f6" 
              strokeWidth="2" 
            />
          )}
          
          {/* Points */}
          {points.map((point) => (
            <circle 
              key={point.index}
              cx={point.x} 
              cy={point.y} 
              r="4" 
              fill="#3b82f6" 
              stroke="white" 
              strokeWidth="2"
            />
          ))}
          
          {/* Axes */}
          <line 
            x1={padding} 
            y1={padding} 
            x2={padding} 
            y2={chartHeight - padding} 
            stroke="#9ca3af" 
            strokeWidth="1" 
          />
          <line 
            x1={padding} 
            y1={chartHeight - padding} 
            x2={chartWidth - padding} 
            y2={chartHeight - padding} 
            stroke="#9ca3af" 
            strokeWidth="1" 
          />
        </svg>
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex items-center">
        <div className="flex items-center mr-6">
          <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Rating</span>
        </div>
      </div>
    </div>
  );
};

export default RatingHistoryChart;