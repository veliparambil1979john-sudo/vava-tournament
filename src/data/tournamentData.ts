export const TOURNAMENT_RULES = [
  {
    id: 1,
    title: "Team Format",
    description: "3 Kids + 2 Parents on the field (rolling subs allowed).",
    icon: "Users"
  },
  {
    id: 2,
    title: "Additional Player & Scoring Rule",
    description: "Women and Child Born in 2019 or later may play as a 6th/7th player. Goals from these players will count 2.",
    icon: "Shirt"
  },
  {
    id: 3,
    title: "Safety Rule",
    description: "No sliding tackles. Referee may stop play for any unsafe challenge.",
    icon: "ShieldAlert"
  },
  {
    id: 4,
    title: "Goalkeeper Rule",
    description: "Teams with a designated goalkeeper may use them in goal. All other teams must use a parent as goalkeeper. Underarm distribution only.",
    icon: "Hand"
  },
  {
    id: 5,
    title: "Parent Scoring Rule",
    description: "Parents may score 1 goal in the 1st half only. In the 2nd half, parents can score only via headers.",
    icon: "Goal"
  },
  {
    id: 6,
    title: "Penalties",
    description: "Parent takes the penalty and must score with a lob/chip finish.",
    icon: "Flag"
  }
];

export const ITINERARY = [
  { time: "3:15 PM", event: "Reporting and Registration", color: "bg-yellow-400" },
  { time: "3:30 PM", event: "Opening Ceremony", color: "bg-green-500" },
  { time: "4:00 PM", event: "Tournament Begins", color: "bg-blue-500" },
  { time: "6:50 PM", event: "Prize Distribution & Closing Ceremony", color: "bg-pink-500" }
];

export const TEAMS = [
  {
    id: 1,
    captain: "Clayden",
    name: "Turbo Panthers",
    country: "France",
    flag: "🇫🇷",
    countryCode: "fr",
    players: ["Amar", "Flynn", "Sanskar", "Johnathan & Vicky", "Aziel & Lawson"],
    stats: { played: 3, won: 2, drawn: 1, lost: 0, goalsFor: 7, goalsAgainst: 3, goalDifference: 4, points: 7 }
  },
  {
    id: 2,
    captain: "Shreyaans",
    name: "Fire Tigers",
    country: "Netherlands",
    flag: "🇳🇱",
    countryCode: "nl",
    players: ["Neal", "Chris", "Casper", "Vihaan & Abhishek", "Hasnain, Harnaan & Navid"],
    stats: { played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 4, goalsAgainst: 4, goalDifference: 0, points: 4 }
  },
  {
    id: 3,
    captain: "Sheldon",
    name: "Kingslayers",
    country: "England",
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    countryCode: "gb-eng",
    players: ["Liam", "Shree", "Arkin & Melvin", "Cayden & Brijay"],
    stats: { played: 3, won: 3, drawn: 0, lost: 0, goalsFor: 9, goalsAgainst: 2, goalDifference: 7, points: 9 }
  },
  {
    id: 4,
    captain: "Umesh",
    name: "Mighty Kickers",
    country: "Brazil",
    flag: "🇧🇷",
    countryCode: "br",
    players: ["Jazeel", "Pranav Shinde", "Fion", "Aiden & Desmond", "Shabaz & Sameer"],
    stats: { played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 5, goalsAgainst: 3, goalDifference: 2, points: 6 }
  },
  {
    id: 5,
    captain: "Saksham",
    name: "Dragon FC",
    country: "Japan",
    flag: "🇯🇵",
    countryCode: "jp",
    players: ["Jake", "Cleatus", "Alsiten & Macwin", "Josh & Irish"],
    stats: { played: 3, won: 0, drawn: 2, lost: 1, goalsFor: 2, goalsAgainst: 4, goalDifference: -2, points: 2 }
  },
  {
    id: 6,
    captain: "Snedden",
    name: "Golden Eagle",
    country: "Germany",
    flag: "🇩🇪",
    countryCode: "de",
    players: ["Jared", "Devansh", "Zidane", "Anwil & Savio", "Orrin & Ajit"],
    stats: { played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 3, goalsAgainst: 6, goalDifference: -3, points: 3 }
  },
  {
    id: 7,
    captain: "Mandar",
    name: "Teen Titans",
    country: "Spain",
    flag: "🇪🇸",
    countryCode: "es",
    players: ["Yug", "Irwin", "Ezekiel", "Harvey & Nixen", "Lars & Samuel"],
    stats: { played: 3, won: 0, drawn: 1, lost: 2, goalsFor: 1, goalsAgainst: 5, goalDifference: -4, points: 1 }
  },
  {
    id: 8,
    captain: "Alden",
    name: "White Sharks",
    country: "Scotland",
    flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    countryCode: "gb-sct",
    players: ["Sean", "Riall R.", "Rudra", "Juan & Renold", "Jayden & Maxwell"],
    stats: { played: 3, won: 0, drawn: 1, lost: 2, goalsFor: 2, goalsAgainst: 6, goalDifference: -4, points: 1 }
  }
];

export const MATCH_SCHEDULE = [
  { id: "M1", title: "Match 1", team1: "Turbo Panthers", team2: "White Sharks", time: "4:00 - 4:20 PM" },
  { id: "M2", title: "Match 2", team1: "Mighty Kickers", team2: "Dragon FC", time: "4:20 - 4:40 PM" },
  { id: "M3", title: "Match 3", team1: "Golden Eagle", team2: "Kingslayers", time: "4:40 - 5:00 PM" },
  { id: "M4", title: "Match 4", team1: "Teen Titans", team2: "Fire Tigers", time: "5:00 - 5:20 PM" },
  { id: "SF1", title: "Semifinal", team1: "Winner of Match 2", team2: "Winner of Match 3", time: "5:20 - 5:40 PM" },
  { id: "SF2", title: "Semifinal", team1: "Winner of Match 1", team2: "Winner of Match 4", time: "5:40 - 6:00 PM" },
  { id: "EX", title: "Exhibition Game", team1: "Coaches", team2: "Parents", time: "6:00 - 6:20 PM" },
  { id: "F", title: "Final", team1: "Winner SF1", team2: "Winner SF2", time: "6:30 - 6:40 PM" }
];
