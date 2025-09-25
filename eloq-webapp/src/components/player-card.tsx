import { Player } from "@/models/player";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PlayerCardProps {
  player: Player;
}

export function PlayerCard({ player }: PlayerCardProps) {
  // Get rating badge variant
  const getRatingVariant = (rating: number, provisional?: boolean) => {
    if (provisional) return "secondary";
    if (rating >= 2000) return "default";
    if (rating >= 1800) return "secondary";
    return "outline";
  };
  
  // Get win rate variant
  const getWinRateVariant = (winRate: number) => {
    if (winRate >= 70) return "default";
    if (winRate >= 50) return "secondary";
    return "outline";
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={player.avatarUrl} alt={player.name} />
            <AvatarFallback>
              {player.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <Link 
              href={`/players/${player.id}`}
              className="font-bold hover:text-primary transition-colors block"
            >
              {player.name}
            </Link>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                #{player.ranking}
              </Badge>
              {player.provisional && (
                <Badge variant="secondary" className="text-xs">
                  Provisional
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Rating</span>
            <Badge variant={getRatingVariant(player.rating, player.provisional)} className="w-fit">
              {player.rating}
            </Badge>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Win Rate</span>
            <Badge 
              variant={getWinRateVariant(player.winRate)}
              className={cn(
                "w-fit",
                player.winRate >= 70 && "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-100",
                player.winRate >= 50 && player.winRate < 70 && "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-100",
                player.winRate < 50 && "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-100"
              )}
            >
              {player.winRate}%
            </Badge>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Wins</span>
            <span className="font-medium">{player.wins}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Losses</span>
            <span className="font-medium">{player.losses}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}