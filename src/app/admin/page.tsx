"use client";

import { useState, useEffect } from 'react';
import { TOURNAMENT_RULES } from '@/data/tournamentData';

export default function AdminPortal() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [selectedMatchId, setSelectedMatchId] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [minute, setMinute] = useState("");
  const [second, setSecond] = useState("");
  const [isDoubleGoal, setIsDoubleGoal] = useState(false);
  const [isOwnGoal, setIsOwnGoal] = useState(false);
  
  // Edit Teams State
  const [editTeam1, setEditTeam1] = useState("");
  const [editTeam2, setEditTeam2] = useState("");
  const [isEditingTeams, setIsEditingTeams] = useState(false);
  
  // Danger Zone
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetCode, setResetCode] = useState("");

  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch('/api/update')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setStatus("Failed to load data.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-10 text-white font-bold">Loading Database...</div>;
  if (!data) return <div className="p-10 text-red-500">Database error.</div>;

  const currentMatch = data.matches.find((m: any) => m.id === selectedMatchId);
  const team1Name = currentMatch?.team1;
  const team2Name = currentMatch?.team2;
  const teamObj = data.teams.find((t: any) => t.name === selectedTeam);

  const handleLogGoal = () => {
    if (!selectedMatchId || !selectedTeam || !selectedPlayer || !minute || !second) {
      alert("Please fill out all fields.");
      return;
    }

    const newData = { ...data };
    const matchIndex = newData.matches.findIndex((m: any) => m.id === selectedMatchId);
    
    // Format time
    const timeString = `${minute}' ${second.padStart(2, '0')}"`;

    // Add event
    newData.matches[matchIndex].events.push({
      type: isOwnGoal ? "own_goal" : "goal",
      team: selectedTeam,
      player: selectedPlayer,
      time: timeString,
      isDouble: isDoubleGoal
    });

    // Update Match Score
    const pointsToAdd = isDoubleGoal ? 2 : 1;
    let scoringTeam = selectedTeam;
    if (isOwnGoal) {
       scoringTeam = (selectedTeam === newData.matches[matchIndex].team1) ? newData.matches[matchIndex].team2 : newData.matches[matchIndex].team1;
    }

    if (scoringTeam === newData.matches[matchIndex].team1) {
      newData.matches[matchIndex].score1 += pointsToAdd;
    } else {
      newData.matches[matchIndex].score2 += pointsToAdd;
    }

    setData(newData);
    setStatus(`Goal logged for ${selectedPlayer} at ${timeString}. (${isDoubleGoal ? "2 POINTS" : "1 POINT"})${isOwnGoal ? " [OWN GOAL]" : ""}. Remember to calculate and publish!`);
    setSelectedPlayer("");
    setMinute("");
    setSecond("");
    setIsDoubleGoal(false);
    setIsOwnGoal(false);
  };

  const handleCalculate = () => {
    const newData = { ...data };
    
    // Reset all team stats
    newData.teams.forEach((team: any) => {
      team.stats = { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 };
    });

    // Recalculate based on completed matches (matches with events or scores > 0)
    newData.matches.forEach((match: any) => {
      if (match.score1 === 0 && match.score2 === 0 && match.events.length === 0) return; // Unplayed
      // Allow all matches to calculate towards points and stats

      const t1 = newData.teams.find((t: any) => t.name === match.team1);
      const t2 = newData.teams.find((t: any) => t.name === match.team2);

      if (!t1 || !t2) return;

      t1.stats.played += 1;
      t2.stats.played += 1;
      
      t1.stats.goalsFor += match.score1;
      t1.stats.goalsAgainst += match.score2;
      t1.stats.goalDifference = t1.stats.goalsFor - t1.stats.goalsAgainst;

      t2.stats.goalsFor += match.score2;
      t2.stats.goalsAgainst += match.score1;
      t2.stats.goalDifference = t2.stats.goalsFor - t2.stats.goalsAgainst;

      if (match.score1 > match.score2) {
        t1.stats.won += 1;
        t1.stats.points += 3;
        t2.stats.lost += 1;
      } else if (match.score2 > match.score1) {
        t2.stats.won += 1;
        t2.stats.points += 3;
        t1.stats.lost += 1;
      } else {
        t1.stats.drawn += 1;
        t2.stats.drawn += 1;
        t1.stats.points += 1;
        t2.stats.points += 1;
      }
    });

    setData(newData);
    setStatus("Standings calculated! Review below and click Publish.");
  };

  const handlePublish = async () => {
    setStatus("Publishing...");
    try {
      const res = await fetch('/api/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (result.success) {
        setStatus("SUCCESS! Live on website.");
      } else {
        setStatus("Failed to publish.");
      }
    } catch (e) {
      console.error(e);
      setStatus("Error publishing.");
    }
  };

  const handleResetData = () => {
    if (resetCode !== "DELETE ALL") {
      alert("Incorrect security code. You must type DELETE ALL exactly.");
      return;
    }
    
    const newData = {...data};
    newData.teams.forEach((t: any) => {
      t.stats = { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 };
    });
    newData.matches.forEach((m: any) => {
      m.score1 = 0;
      m.score2 = 0;
      m.events = [];
      if (m.id === "SF1") { m.team1 = "Winner of Match 1"; m.team2 = "Winner of Match 4"; }
      if (m.id === "SF2") { m.team1 = "Winner of Match 2"; m.team2 = "Winner of Match 3"; }
      if (m.id === "F") { m.team1 = "Winner of Semifinal 1"; m.team2 = "Winner of Semifinal 2"; }
    });
    
    setData(newData);
    setShowResetConfirm(false);
    setResetCode("");
    setStatus("DATABASE FACTORY RESET SUCCESSFUL! Click Publish to Web to wipe the live site.");
  };

  return (
    <div className="min-h-screen bg-white text-black p-8 font-sans">
      <h1 className="text-4xl font-black mb-8 text-fuchsia-500 uppercase tracking-tight">Admin Portal</h1>

      {status && (
        <div className="bg-fuchsia-900/50 border border-fuchsia-500 text-fuchsia-100 p-4 rounded-xl mb-8 font-bold">
          {status}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Goal Entry Form */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl text-white">
          <h2 className="text-2xl font-bold mb-6 text-cyan-400">Log a Goal</h2>
          
          <div className="flex flex-col gap-4">
            <label className="font-bold text-gray-400 uppercase text-xs tracking-wider">Select Match</label>
            <select 
              className="bg-gray-950 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-cyan-500"
              value={selectedMatchId}
              onChange={(e) => {
                setSelectedMatchId(e.target.value);
                setSelectedTeam("");
                setSelectedPlayer("");
                setIsEditingTeams(false);
                const m = data.matches.find((x:any) => x.id === e.target.value);
                if (m) {
                  setEditTeam1(m.team1);
                  setEditTeam2(m.team2);
                }
              }}
            >
              <option value="">-- Choose Match --</option>
              {data.matches.map((m: any) => (
                <option key={m.id} value={m.id}>{m.title}: {m.team1} vs {m.team2} ({m.score1} - {m.score2})</option>
              ))}
            </select>

            {selectedMatchId && (
              <div className="flex justify-end mt-[-10px] mb-2">
                <button 
                  onClick={() => setIsEditingTeams(!isEditingTeams)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 uppercase tracking-wide font-bold"
                >
                  {isEditingTeams ? "Cancel Edit" : "⚙️ Edit Match Teams"}
                </button>
              </div>
            )}

            {isEditingTeams && selectedMatchId && (
              <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 mb-4 flex flex-col gap-3">
                <label className="font-bold text-gray-400 uppercase text-xs tracking-wider">Update Team 1</label>
                <select 
                  className="bg-gray-950 border border-gray-700 rounded-lg p-2 text-white outline-none focus:border-cyan-500"
                  value={editTeam1}
                  onChange={(e) => setEditTeam1(e.target.value)}
                >
                  <option value={currentMatch.team1}>{currentMatch.team1}</option>
                  {data.teams.map((t: any) => <option key={`t1-${t.name}`} value={t.name}>{t.name}</option>)}
                </select>

                <label className="font-bold text-gray-400 uppercase text-xs tracking-wider">Update Team 2</label>
                <select 
                  className="bg-gray-950 border border-gray-700 rounded-lg p-2 text-white outline-none focus:border-cyan-500"
                  value={editTeam2}
                  onChange={(e) => setEditTeam2(e.target.value)}
                >
                  <option value={currentMatch.team2}>{currentMatch.team2}</option>
                  {data.teams.map((t: any) => <option key={`t2-${t.name}`} value={t.name}>{t.name}</option>)}
                </select>

                <button 
                  onClick={() => {
                    const newData = {...data};
                    const matchIndex = newData.matches.findIndex((m: any) => m.id === selectedMatchId);
                    newData.matches[matchIndex].team1 = editTeam1;
                    newData.matches[matchIndex].team2 = editTeam2;
                    setData(newData);
                    setIsEditingTeams(false);
                    setStatus("Match teams updated! Remember to publish.");
                  }}
                  className="mt-2 bg-gray-700 hover:bg-gray-600 transition-colors text-white font-bold py-2 rounded-lg text-sm"
                >
                  Save Teams
                </button>
              </div>
            )}

            {selectedMatchId && !isEditingTeams && (
              <>
                <label className="font-bold text-gray-400 uppercase text-xs tracking-wider mt-2">Scoring Team</label>
                <select 
                  className="bg-gray-950 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-cyan-500"
                  value={selectedTeam}
                  onChange={(e) => {
                    setSelectedTeam(e.target.value);
                    setSelectedPlayer("");
                  }}
                >
                  <option value="">-- Choose Team --</option>
                  <option value={team1Name}>{team1Name}</option>
                  <option value={team2Name}>{team2Name}</option>
                </select>
              </>
            )}

            {selectedTeam && teamObj && (
              <>
                <label className="font-bold text-gray-400 uppercase text-xs tracking-wider mt-2">Goal Scorer</label>
                <select 
                  className="bg-gray-950 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-cyan-500"
                  value={selectedPlayer}
                  onChange={(e) => setSelectedPlayer(e.target.value)}
                >
                  <option value="">-- Choose Player --</option>
                  <option value={teamObj.captain}>{teamObj.captain} (Coach)</option>
                  {teamObj.players.map((p: string) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </>
            )}

            {selectedPlayer && (
              <>
                <label className="font-bold text-gray-400 uppercase text-xs tracking-wider mt-2">Time of Goal</label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input 
                      type="number" 
                      placeholder="Min"
                      className="w-full bg-gray-950 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-cyan-500"
                      value={minute}
                      onChange={(e) => setMinute(e.target.value)}
                    />
                  </div>
                  <span className="font-bold text-gray-500">:</span>
                  <div className="flex-1">
                    <input 
                      type="number" 
                      placeholder="Sec"
                      className="w-full bg-gray-950 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-cyan-500"
                      value={second}
                      onChange={(e) => setSecond(e.target.value)}
                    />
                  </div>
                </div>

                <label className="flex items-center gap-3 mt-4 p-4 bg-fuchsia-950/40 border border-fuchsia-900 rounded-xl cursor-pointer hover:bg-fuchsia-900/40 transition-colors">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      className="w-6 h-6 appearance-none border-2 border-fuchsia-500 rounded-md checked:bg-fuchsia-600 transition-colors cursor-pointer"
                      checked={isDoubleGoal}
                      onChange={(e) => setIsDoubleGoal(e.target.checked)}
                    />
                    {isDoubleGoal && (
                      <svg className="absolute w-4 h-4 text-white left-1 top-1 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-fuchsia-400">2x Goal (Women / Child 2019+)</div>
                    <div className="text-xs text-fuchsia-200/60">Counts as 2 goals for the team</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 mt-2 p-4 bg-red-950/40 border border-red-900 rounded-xl cursor-pointer hover:bg-red-900/40 transition-colors">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      className="w-6 h-6 appearance-none border-2 border-red-500 rounded-md checked:bg-red-600 transition-colors cursor-pointer"
                      checked={isOwnGoal}
                      onChange={(e) => setIsOwnGoal(e.target.checked)}
                    />
                    {isOwnGoal && (
                      <svg className="absolute w-4 h-4 text-white left-1 top-1 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-red-400">Own Goal</div>
                    <div className="text-xs text-red-200/60">Awards point(s) to the opposing team</div>
                  </div>
                </label>
                
                <button 
                  onClick={handleLogGoal}
                  className="mt-6 bg-cyan-600 hover:bg-cyan-500 transition-colors text-white font-black uppercase tracking-wider py-4 rounded-xl shadow-lg"
                >
                  Log Goal Event
                </button>
              </>
            )}
          </div>
        </div>

        {/* Actions & Preview */}
        <div className="flex flex-col gap-6">
          <button 
            onClick={handleCalculate}
            className="bg-purple-700 hover:bg-purple-600 transition-colors text-white font-black uppercase tracking-widest py-6 rounded-3xl shadow-lg border-2 border-purple-400 shadow-purple-900/50"
          >
            Calculate Standings
          </button>
          
          <button 
            onClick={handlePublish}
            className="bg-green-600 hover:bg-green-500 transition-colors text-white font-black uppercase tracking-widest py-6 rounded-3xl shadow-lg border-2 border-green-400 shadow-green-900/50"
          >
            Publish To Web
          </button>

          <button 
            onClick={() => {
              const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
              const downloadAnchorNode = document.createElement('a');
              downloadAnchorNode.setAttribute("href",     dataStr);
              downloadAnchorNode.setAttribute("download", `vava-tournament-backup-${new Date().toISOString().split('T')[0]}.json`);
              document.body.appendChild(downloadAnchorNode);
              downloadAnchorNode.click();
              downloadAnchorNode.remove();
              setStatus("Backup downloaded to your computer!");
            }}
            className="bg-gray-800 hover:bg-gray-700 transition-colors text-gray-300 font-bold uppercase tracking-wider py-4 rounded-2xl shadow-md border border-gray-600 mt-2"
          >
            Download Database Backup
          </button>

          <input 
            type="file" 
            id="backupUpload" 
            accept=".json" 
            className="hidden" 
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = (event) => {
                try {
                  const parsed = JSON.parse(event.target?.result as string);
                  if (parsed && parsed.teams && parsed.matches) {
                    setData(parsed);
                    setStatus("Backup Restored Successfully! Review the preview below and click 'Publish To Web' to make it live.");
                  } else {
                    setStatus("Error: Invalid backup file structure.");
                  }
                } catch (err) {
                  setStatus("Error: Failed to parse backup file.");
                }
              };
              reader.readAsText(file);
              // Reset the input so the same file can be uploaded again if needed
              e.target.value = "";
            }}
          />
          <button 
            onClick={() => document.getElementById('backupUpload')?.click()}
            className="bg-orange-900/60 hover:bg-orange-800 transition-colors text-orange-200 font-bold uppercase tracking-wider py-4 rounded-2xl shadow-md border border-orange-700 mt-2"
          >
            Restore Database from Backup
          </button>

          <button 
            onClick={() => {
              let csv = "--- TOURNAMENT STANDINGS ---\n";
              csv += "Pos,Team,Played,Won,Drawn,Lost,Goals For,Goals Against,Goal Difference,Points\n";
              const sortedTeams = [...data.teams].sort((a: any, b: any) => b.stats.points !== a.stats.points ? b.stats.points - a.stats.points : b.stats.goalDifference - a.stats.goalDifference);
              sortedTeams.forEach((t: any, i) => {
                csv += `${i+1},${t.name},${t.stats.played},${t.stats.won},${t.stats.drawn},${t.stats.lost},${t.stats.goalsFor},${t.stats.goalsAgainst},${t.stats.goalDifference},${t.stats.points}\n`;
              });
              
              csv += "\n--- MATCH RESULTS ---\n";
              csv += "Match ID,Title,Team 1,Score 1,Score 2,Team 2,Time\n";
              data.matches.forEach((m: any) => {
                csv += `${m.id},${m.title},${m.team1},${m.score1},${m.score2},${m.team2},${m.time}\n`;
              });

              csv += "\n--- GOAL EVENTS ---\n";
              csv += "Match ID,Scoring Team,Player,Time\n";
              data.matches.forEach((m: any) => {
                if (m.events) {
                  m.events.forEach((e: any) => {
                    csv += `${m.id},${e.team},${e.player},${e.time}\n`;
                  });
                }
              });

              const csvData = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
              const link = document.createElement('a');
              link.setAttribute("href", csvData);
              link.setAttribute("download", `vava-tournament-report-${new Date().toISOString().split('T')[0]}.csv`);
              document.body.appendChild(link);
              link.click();
              link.remove();
              setStatus("Excel CSV Export downloaded!");
            }}
            className="bg-blue-800 hover:bg-blue-700 transition-colors text-blue-100 font-bold uppercase tracking-wider py-4 rounded-2xl shadow-md border border-blue-600 mt-2"
          >
            Export to Excel (CSV)
          </button>

          {/* DANGER ZONE */}
          <div className="bg-red-950/20 border border-red-900 rounded-3xl p-6 mt-4 shadow-lg shadow-red-900/20">
            <h2 className="text-xl font-bold mb-4 text-red-500 uppercase tracking-widest flex items-center gap-2">
              <span className="text-2xl">⚠️</span> Danger Zone
            </h2>
            
            {!showResetConfirm ? (
              <button 
                onClick={() => setShowResetConfirm(true)}
                className="w-full bg-red-900/50 hover:bg-red-800 transition-colors text-red-200 font-bold uppercase tracking-wider py-4 rounded-xl border border-red-700"
              >
                Factory Reset Database
              </button>
            ) : (
              <div className="bg-red-950 p-4 rounded-xl border border-red-800">
                <p className="text-red-400 font-bold text-sm mb-3 text-center">This will wipe all goals, scores, and standings.</p>
                <input 
                  type="text" 
                  placeholder="Type 'DELETE ALL' to confirm"
                  className="w-full bg-black border border-red-800 rounded-lg p-3 text-red-400 outline-none focus:border-red-500 mb-3 font-mono text-center tracking-widest placeholder-red-900/50"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                />
                <div className="flex gap-3">
                  <button 
                    onClick={() => { setShowResetConfirm(false); setResetCode(""); }}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 transition-colors text-white font-bold py-3 rounded-lg text-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleResetData}
                    className="flex-1 bg-red-600 hover:bg-red-500 transition-colors text-white font-black py-3 rounded-lg text-sm uppercase tracking-wider shadow-lg shadow-red-900/50"
                  >
                    CONFIRM WIPE
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-2xl flex-1 mt-4 overflow-auto">
            <h2 className="text-xl font-bold mb-4 text-white">Preview Standings</h2>
            <div className="text-sm font-mono text-gray-300">
              {[...data.teams].sort((a: any, b: any) => b.stats.points !== a.stats.points ? b.stats.points - a.stats.points : b.stats.goalDifference - a.stats.goalDifference).map((t: any, i) => (
                <div key={t.id} className="flex justify-between py-2 border-b border-gray-800">
                  <span>{i+1}. {t.name}</span>
                  <span className="font-bold text-cyan-400">{t.stats.points} PTS ({t.stats.goalDifference} GD)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tournament Rules Review */}
      <div className="mt-8 bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-fuchsia-500">Match Rules Reference</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOURNAMENT_RULES.map(rule => (
            <div key={rule.id} className="bg-gray-950 border border-gray-800 p-6 rounded-xl">
              <h3 className="text-lg font-bold text-white mb-2">{rule.title}</h3>
              <p className="text-gray-400 text-sm">{rule.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
