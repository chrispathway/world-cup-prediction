import React, { useState } from "react";
import { useGetTeams, usePredictMatch } from "@workspace/api-client-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { Loader2 } from "lucide-react";

export function MatchSimulator() {
  const { data: teamsData, isLoading: teamsLoading } = useGetTeams();
  const [homeTeamCode, setHomeTeamCode] = useState<string>("");
  const [awayTeamCode, setAwayTeamCode] = useState<string>("");

  const predictMatch = usePredictMatch();

  const handleSimulate = () => {
    if (!homeTeamCode || !awayTeamCode) return;
    predictMatch.mutate({
      data: {
        homeTeam: homeTeamCode,
        awayTeam: awayTeamCode,
      }
    });
  };

  const teams = teamsData?.teams || [];

  return (
    <Card className="border-card-border bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl uppercase tracking-wider text-muted-foreground font-mono">Match Simulator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 items-end mb-8">
          <div className="flex-1 w-full">
            <label className="text-xs text-muted-foreground uppercase font-mono mb-2 block">Team 1</label>
            <Select value={homeTeamCode} onValueChange={setHomeTeamCode} disabled={teamsLoading}>
              <SelectTrigger className="font-sans border-border bg-background/50">
                <SelectValue placeholder="Select team..." />
              </SelectTrigger>
              <SelectContent>
                {teams.map(team => (
                  <SelectItem key={team.code} value={team.code}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="text-muted-foreground pb-2 px-2 font-mono text-sm hidden md:block">VS</div>
          
          <div className="flex-1 w-full">
            <label className="text-xs text-muted-foreground uppercase font-mono mb-2 block">Team 2</label>
            <Select value={awayTeamCode} onValueChange={setAwayTeamCode} disabled={teamsLoading}>
              <SelectTrigger className="font-sans border-border bg-background/50">
                <SelectValue placeholder="Select team..." />
              </SelectTrigger>
              <SelectContent>
                {teams.map(team => (
                  <SelectItem key={team.code} value={team.code}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleSimulate} 
            disabled={!homeTeamCode || !awayTeamCode || predictMatch.isPending}
            className="w-full md:w-auto font-mono uppercase tracking-wider"
          >
            {predictMatch.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Calculating...
              </>
            ) : "Simulate"}
          </Button>
        </div>

        {predictMatch.data && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 rounded-lg bg-background p-6 border border-border">
            <div className="grid grid-cols-3 gap-4 text-center mb-8">
              <div>
                <div className="text-sm text-muted-foreground font-mono uppercase mb-1">Win</div>
                <div className="text-4xl md:text-5xl font-bold font-mono text-primary">
                  <AnimatedNumber value={predictMatch.data.homeWinPct} format={v => v.toFixed(1) + "%"} />
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground font-mono uppercase mb-1">Draw</div>
                <div className="text-3xl md:text-4xl font-bold font-mono text-muted-foreground mt-2">
                  <AnimatedNumber value={predictMatch.data.drawPct} format={v => v.toFixed(1) + "%"} />
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground font-mono uppercase mb-1">Win</div>
                <div className="text-4xl md:text-5xl font-bold font-mono text-primary">
                  <AnimatedNumber value={predictMatch.data.awayWinPct} format={v => v.toFixed(1) + "%"} />
                </div>
              </div>
            </div>

            <div className="text-center py-6 border-y border-border mb-6 bg-card/30">
              <div className="text-xs text-muted-foreground font-mono uppercase mb-2">Most Likely Score</div>
              <div className="text-6xl md:text-7xl font-bold tracking-tighter">
                {predictMatch.data.mostLikelyScore}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 text-center text-sm font-mono">
              <div>
                <div className="text-muted-foreground mb-1">Expected Goals</div>
                <div className="text-xl text-foreground font-bold">{predictMatch.data.homeExpectedGoals.toFixed(2)}</div>
                <div className="text-muted-foreground mt-4 mb-1">Elo Rating</div>
                <div className="text-foreground">{Math.round(predictMatch.data.homeElo)}</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Expected Goals</div>
                <div className="text-xl text-foreground font-bold">{predictMatch.data.awayExpectedGoals.toFixed(2)}</div>
                <div className="text-muted-foreground mt-4 mb-1">Elo Rating</div>
                <div className="text-foreground">{Math.round(predictMatch.data.awayElo)}</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
