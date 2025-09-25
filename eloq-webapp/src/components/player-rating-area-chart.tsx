'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PlayerRatingData {
  date: string; // Using string format for date
  [playerId: string]: number | string; // Dynamic keys for each player's rating
}

interface PlayerRatingAreaChartProps {
  playerData: PlayerRatingData[]; 
  players: { id: string; name: string; color: string }[];
  title?: string;
  description?: string;
}

const PlayerRatingAreaChart: React.FC<PlayerRatingAreaChartProps> = ({ 
  playerData, 
  players, 
  title = 'Player Rating History',
  description = 'Compare rating changes over time' 
}) => {
  const [timeRange, setTimeRange] = React.useState('lifetime');
  
  // Filter data based on time range
  const filteredData = React.useMemo(() => {
    if (!playerData || playerData.length === 0) return [];
    
    // Convert date strings to Date objects for comparison
    const now = new Date();
    let startDate = new Date(now);
    
    switch (timeRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '3m':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'lifetime':
      default:
        // 'lifetime' or default - return all data
        return playerData;
    }
    
    return playerData.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate;
    });
  }, [playerData, timeRange]);

  // Generate chart config based on players
  const chartConfig = players.reduce((config, player) => {
    config[player.id] = {
      label: player.name,
      color: player.color,
    };
    return config;
  }, {} as ChartConfig);

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5">
        <div className="grid flex-1 gap-1">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select time range"
          >
            <SelectValue placeholder="Lifetime" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="7d" className="rounded-lg">
              Last 7 Days
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 Days
            </SelectItem>
            <SelectItem value="3m" className="rounded-lg">
              Last 3 Months
            </SelectItem>
            <SelectItem value="lifetime" className="rounded-lg">
              Lifetime
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[400px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              {players.map((player) => (
                <linearGradient key={player.id} id={`fill${player.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={player.color}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={player.color}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });
                  }}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            {players.map((player) => (
              <Area
                key={player.id}
                type="monotone"
                dataKey={player.id}
                name={player.name}
                fill={`url(#fill${player.id})`}
                stroke={player.color}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default PlayerRatingAreaChart;