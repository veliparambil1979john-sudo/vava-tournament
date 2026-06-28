'use client';

import { useEffect, useState } from 'react';
import Scene from '@/components/canvas/Scene';
import { motion, useScroll, useTransform } from 'framer-motion';
import { TOURNAMENT_RULES, ITINERARY } from '@/data/tournamentData';
import { Users, Shirt, ShieldAlert, Hand, Goal, Flag, Calendar, Clock, Trophy, MapPin } from 'lucide-react';

const IconMap: any = {
  Users, Shirt, ShieldAlert, Hand, Goal, Flag
};

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<{teams: any[], matches: any[]} | null>(null);
  const { scrollYProgress } = useScroll();
  
  // Parallax effects for foreground elements
  const yHero = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  useEffect(() => {
    setMounted(true);
    fetch('/api/update')
      .then(res => res.json())
      .then(d => setData(d))
      .catch(e => console.error("Failed to load data", e));
  }, []);

  if (!mounted || !data) return (
    <div className="h-screen w-full bg-gray-950 flex flex-col items-center justify-center text-cyan-400 font-bold uppercase tracking-widest text-xl">
      <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      Loading Tournament...
    </div>
  );

  const TEAMS = data.teams;
  const MATCH_SCHEDULE = data.matches;

  // Top Goal Scorers calculation
  const topScorers: { name: string, team: string, goals: number }[] = [];
  MATCH_SCHEDULE.forEach((match: any) => {
    if (match.events) {
      match.events.forEach((event: any) => {
        if (event.type === 'goal') {
          const existing = topScorers.find(s => s.name === event.player && s.team === event.team);
          const goalPoints = event.isDouble ? 2 : 1;
          if (existing) {
            existing.goals += goalPoints;
          } else {
            topScorers.push({ name: event.player, team: event.team, goals: goalPoints });
          }
        }
      });
    }
  });
  topScorers.sort((a, b) => b.goals - a.goals);
  const top5Scorers = topScorers.slice(0, 5);

  return (
    <main className="relative w-full min-h-screen text-white font-sans selection:bg-yellow-500/30">
      {/* 3D Background */}
      <Scene />

      {/* Main Content Container */}
      <div className="relative z-10">
        
        {/* Navigation */}
        <nav className="fixed top-0 left-0 w-full p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-[2px] z-50">
          <div className="flex items-center gap-2 sm:gap-4">
            <img 
              src="/logo-circle.jpeg" 
              alt="VSA Torch Logo" 
              className="w-8 h-8 sm:w-14 sm:h-14 mix-blend-screen drop-shadow-md" 
            />
            <img 
              src="/logo-wide.jpeg" 
              alt="VAVA Sports Academy" 
              className="h-6 sm:h-12 w-auto mix-blend-screen drop-shadow-md" 
            />
          </div>
          <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm font-semibold tracking-wider">
            <a href="#rules" className="hover:text-fuchsia-400 transition-colors">Rules</a>
            <a href="#schedule" className="hover:text-cyan-400 transition-colors">Schedule</a>
            <a href="#teams" className="hover:text-green-400 transition-colors">Teams</a>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="h-screen flex flex-col items-center justify-center text-center px-4">
          <motion.div style={{ y: yHero, opacity: opacityHero }} className="max-w-4xl">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, type: 'spring' }}
              className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-fuchsia-500/50 text-fuchsia-400 font-bold tracking-widest text-xs sm:text-sm mb-6 backdrop-blur-md uppercase shadow-[0_0_15px_rgba(192,38,211,0.3)]"
            >
              Season 3
            </motion.div>
            
            <motion.h1 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tight leading-[0.9] mb-6 drop-shadow-2xl text-white"
            >
              Inter Academy <br/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 drop-shadow-[0_0_25px_rgba(192,38,211,0.3)]">Parent-Child</span> <br/>
              Tournament
            </motion.h1>

            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm sm:text-base text-gray-300 font-medium"
            >
              <a 
                href="#schedule"
                className="flex items-center gap-2 bg-black/40 hover:bg-white/10 transition-colors px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 cursor-pointer"
              >
                <Calendar className="w-5 h-5 text-blue-400" />
                <span>Today</span>
              </a>
              <a 
                href="https://maps.google.com/?q=Vasai+West"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-black/40 hover:bg-white/10 transition-colors px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 cursor-pointer"
              >
                <MapPin className="w-5 h-5 text-red-400" />
                <span>Vasai West</span>
              </a>
            </motion.div>
          </motion.div>
        </section>

        {/* Leaderboard Section */}
        <section id="standings" className="py-24 px-4 sm:px-8 max-w-5xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-12 text-center sm:text-left"
          >
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white mb-2">
              Current <span className="text-cyan-400">Standings</span>
            </h2>
            <p className="text-gray-400 font-medium">Top 4 teams qualify for the Semi-Finals.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="overflow-x-auto bg-black/40 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl"
          >
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-xs sm:text-sm uppercase tracking-widest text-white/50">
                  <th className="py-6 px-6 font-semibold w-16 text-center">Pos</th>
                  <th className="py-6 px-4 font-semibold">Team</th>
                  <th className="py-6 px-4 font-semibold text-center w-12">P</th>
                  <th className="py-6 px-4 font-semibold text-center w-12 text-green-400">W</th>
                  <th className="py-6 px-4 font-semibold text-center w-12 text-yellow-400">D</th>
                  <th className="py-6 px-4 font-semibold text-center w-12 text-red-400">L</th>
                  <th className="py-6 px-4 font-semibold text-center w-16">GD</th>
                  <th className="py-6 px-6 font-bold text-center w-20 text-white">PTS</th>
                </tr>
              </thead>
              <tbody className="text-sm sm:text-base font-medium">
                {[...TEAMS].sort((a, b) => b.stats.points !== a.stats.points ? b.stats.points - a.stats.points : b.stats.goalDifference - a.stats.goalDifference).map((team, index) => (
                  <tr 
                    key={team.id} 
                    className={`border-b border-white/5 hover:bg-white/5 transition-colors ${index < 4 ? 'bg-gradient-to-r from-cyan-900/20 to-transparent' : ''}`}
                  >
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${index < 4 ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-gray-500'}`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img src={`https://flagcdn.com/w40/${team.countryCode}.png`} alt={team.country} className="w-8 h-auto rounded-sm shadow-sm" />
                        <span className="font-bold text-white uppercase tracking-wide">{team.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center text-gray-400">{team.stats.played}</td>
                    <td className="py-4 px-4 text-center text-gray-400">{team.stats.won}</td>
                    <td className="py-4 px-4 text-center text-gray-400">{team.stats.drawn}</td>
                    <td className="py-4 px-4 text-center text-gray-400">{team.stats.lost}</td>
                    <td className="py-4 px-4 text-center font-semibold text-gray-300">{team.stats.goalDifference > 0 ? `+${team.stats.goalDifference}` : team.stats.goalDifference}</td>
                    <td className="py-4 px-6 text-center font-black text-lg text-white">{team.stats.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </section>

        {/* Top Scorers Section */}
        {top5Scorers.length > 0 && (
          <section className="pb-24 px-4 sm:px-8 max-w-3xl mx-auto relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="mb-8 text-center sm:text-left"
            >
              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mb-2">
                Top <span className="text-fuchsia-500">Goal Scorers</span>
              </h2>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="overflow-x-auto bg-black/40 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl"
            >
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-xs sm:text-sm uppercase tracking-widest text-white/50">
                    <th className="py-4 px-6 font-semibold w-16 text-center">Rank</th>
                    <th className="py-4 px-4 font-semibold">Player</th>
                    <th className="py-4 px-4 font-semibold">Team</th>
                    <th className="py-4 px-6 font-bold text-center w-20 text-white">Goals</th>
                  </tr>
                </thead>
                <tbody className="text-sm sm:text-base font-medium">
                  {top5Scorers.map((scorer, index) => (
                    <tr 
                      key={index} 
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${index === 0 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.5)]' : 'bg-white/5 text-gray-500'}`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-bold text-white uppercase tracking-wide">
                        {scorer.name}
                      </td>
                      <td className="py-4 px-4 text-gray-400">
                        {scorer.team}
                      </td>
                      <td className="py-4 px-6 text-center font-black text-xl text-fuchsia-400">
                        {scorer.goals}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </section>
        )}

        {/* Rules Section */}
        <section id="rules" className="min-h-screen py-24 px-4 sm:px-8 max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-16"
          >
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white mb-4">
              Tournament <span className="text-fuchsia-500">Rules</span>
            </h2>
            <div className="w-24 h-2 bg-gradient-to-r from-fuchsia-500 to-purple-600 rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOURNAMENT_RULES.map((rule, idx) => {
              const Icon = IconMap[rule.icon];
              return (
                <motion.div 
                  key={rule.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white/5 backdrop-blur-xl border border-fuchsia-500/20 rounded-3xl p-8 shadow-2xl hover:bg-white/10 transition-colors group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-transform group-hover:scale-150" />
                  <div className="w-14 h-14 bg-fuchsia-500/20 rounded-2xl flex items-center justify-center mb-6 text-fuchsia-400 border border-fuchsia-500/30 shadow-[0_0_15px_rgba(192,38,211,0.2)]">
                    {Icon && <Icon className="w-7 h-7" />}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">{rule.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{rule.description}</p>
                  
                  <div className="absolute bottom-4 right-6 text-6xl font-black text-white/5 select-none pointer-events-none">
                    {rule.id}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Schedule & Itinerary */}
        <section id="schedule" className="py-24 px-4 sm:px-8 max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-16"
          >
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white mb-4">
              Match <span className="text-cyan-400">Schedule</span>
            </h2>
            <div className="w-24 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Itinerary Timeline */}
            <div className="lg:col-span-4 relative">
              <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-white/10 rounded-full" />
              <div className="flex flex-col gap-8 relative">
                {ITINERARY.map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="flex items-start gap-6"
                  >
                    <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center flex-shrink-0 shadow-lg relative z-10`}>
                      <Clock className="w-6 h-6 text-black" />
                    </div>
                    <div className="pt-2">
                      <div className="text-xl font-black text-white mb-1">{item.time}</div>
                      <div className="text-sm font-semibold text-gray-400 uppercase tracking-wide">{item.event}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Match Fixtures */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              {MATCH_SCHEDULE.map((match, i) => (
                <motion.div 
                  key={match.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.01 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-gradient-to-r from-white/5 to-transparent border border-white/10 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-sm"
                >
                  <div className="flex flex-col items-center sm:items-start w-full sm:w-1/4">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{match.title}</span>
                    <span className="text-sm font-black text-cyan-400">{match.time}</span>
                  </div>
                  
                  <div className="flex-1 flex items-center justify-center gap-4 w-full">
                    <div className="flex-1 flex items-center justify-end gap-3 text-lg sm:text-xl font-bold text-white truncate">
                      {match.team1}
                      {TEAMS.find(t => t.name === match.team1)?.countryCode && (
                        <img src={`https://flagcdn.com/w40/${TEAMS.find(t => t.name === match.team1)?.countryCode}.png`} alt="flag" className="w-8 h-auto shadow-sm rounded-sm" />
                      )}
                    </div>
                    <div className="w-auto px-4 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-black text-white/50 flex-shrink-0">
                      {match.events && match.events.length > 0 ? (
                        <span className="text-lg text-white font-black">{match.score1} - {match.score2}</span>
                      ) : (
                        "VS"
                      )}
                    </div>
                    <div className="flex-1 flex items-center justify-start gap-3 text-lg sm:text-xl font-bold text-white truncate">
                      {TEAMS.find(t => t.name === match.team2)?.countryCode && (
                        <img src={`https://flagcdn.com/w40/${TEAMS.find(t => t.name === match.team2)?.countryCode}.png`} alt="flag" className="w-8 h-auto shadow-sm rounded-sm" />
                      )}
                      {match.team2}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Teams Section */}
        <section id="teams" className="py-24 px-4 sm:px-8 max-w-7xl mx-auto mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-16 text-center"
          >
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white mb-4">
              Meet The <span className="text-green-400">Teams</span>
            </h2>
            <div className="w-24 h-2 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAMS.map((team, idx) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -10 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-black/40 backdrop-blur-xl border border-green-500/20 rounded-3xl overflow-hidden group hover:border-green-400/50 transition-colors shadow-xl hover:shadow-[0_0_30px_rgba(74,222,128,0.15)]"
              >
                <div className="p-6 bg-gradient-to-br from-white/10 to-transparent border-b border-white/10">
                  <div className="flex justify-between items-start mb-4">
                    <img src={`https://flagcdn.com/w80/${team.countryCode}.png`} alt={team.country} className="w-12 h-auto shadow-md rounded-sm" />
                    <span className="text-xs font-bold text-white/50 uppercase tracking-widest">{team.country}</span>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-1 leading-tight">{team.name}</h3>
                  <p className="text-sm font-semibold text-green-400 uppercase tracking-wider">Coach: {team.captain}</p>
                </div>
                <div className="p-6">
                  <p className="text-xs text-white/40 uppercase tracking-widest mb-3 font-semibold">Squad</p>
                  <ul className="flex flex-col gap-2">
                    {team.players.map((player: string, pIdx: number) => (
                      <li key={pIdx} className="text-sm text-gray-300 font-medium flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                        {player}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-12 text-center text-white/30 text-sm font-semibold tracking-wider">
          <p>VAVA SPORTS ACADEMY © 2026. PRACTICE. ACHIEVE. WIN.</p>
        </footer>

      </div>
    </main>
  );
}
