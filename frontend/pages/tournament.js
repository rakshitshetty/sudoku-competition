import { useState, useEffect } from 'react';
import "../styles/tournament.css"; 
import { fetchTournamentList, fetchTournamentStatus, fetchTournamentPlayers, fetchTournamentMatches, tournamentSignup, createTournament } from "../services/tournamentServices";

export default function TournamentList() {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [newTournament, setNewTournament] = useState({ name: "", maxPlayers: 4 });

  useEffect(() => {
    async function fetchTournaments() {
        setTournamentList();
        // const data = await fetchTournamentList();
        // setTournaments(data);
    }
    fetchTournaments();
  }, []);

  const setTournamentList = async() => {
    const data = await fetchTournamentList();
    setTournaments(data);
  } 

  const reset = () => {
    setPlayers([]);
    setMatches([]);
  }

  const fetchTournamentDetails = async (id) => {
    reset();
    const token = localStorage.getItem("token");
    if (!token) {
        alert(" You need to log in to view tournament data!");
        return;
    }
    const data = await fetchTournamentStatus(id);
    setSelectedTournament(data);

    const playersData = await fetchTournamentPlayers(id);
    setPlayers(playersData);

    const matchesData = await fetchTournamentMatches(id);
    setMatches(matchesData);
  };

  const handleCreateTournament = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to log in!");
      return;
    }

    const data = await createTournament(newTournament);
      if (data.ok) {
        alert("Tournament created successfully!");
        setTournamentList();
      } else {
        alert(data.error);
      }

  }

  const handleSignup = async (tournamentId) => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert(" You need to log in to view tournament data!");
        return;
    }
      const data = await tournamentSignup(tournamentId);
  
      if (data.ok) {
        alert("Successfully signed up!");
        fetchTournamentDetails(tournamentId); // Refresh player list
      } else {
        alert(data.error);
      }
  };
  

  return (
    <div className="tournament-container">
      <div className="tournament-list">
        <h1 className="tournament-title">Tournaments</h1>

        {/* Tournament Creation Form */}
        <form className="tournament-form" onSubmit={handleCreateTournament}>
          <input
            type="text"
            placeholder="Tournament Name"
            value={newTournament.name}
            onChange={(e) => setNewTournament({ ...newTournament, name: e.target.value })}
            required
          />
          <input
            type="number"
            min="2"
            max="16"
            placeholder="Max Players"
            value={newTournament.maxPlayers}
            onChange={(e) => setNewTournament({ ...newTournament, maxPlayers: e.target.value })}
            required
          />
          <button type="submit" className="create-button">Create Tournament</button>
        </form>

        <div className="tournament-scroll">
            {tournaments.map((tournament) => (
            <div key={tournament.id} className="tournament-card" onClick={() => fetchTournamentDetails(tournament.id)}>
                <h2>{tournament.name}</h2>
                <p>Players: {tournament.players_signed_up} / {tournament.max_players}</p>
                <p>Status: <span style={{ color: tournament.status === 'in-progress' ? 'green' : 'orange' }}>{tournament.status}</span></p>
            </div>
            ))}
        </div>
      </div>
      <div className="tournament-details">
        {selectedTournament ? (
          <>
            <h2 className="tournament-title">{selectedTournament.name}</h2>
            <p className="tournament-status"><strong>Status:</strong> {selectedTournament.status}</p>
            <p className="tournament-players"><strong>Players:</strong> {players.length} / {selectedTournament.max_players}</p>
            {selectedTournament.status === "waiting" && (
              <button className="join-button" onClick={() => handleSignup(selectedTournament.id)}>
                Join Tournament
              </button>
            )}
            <h3 className="section-title">Players Signed Up</h3>
            <ul className="players-list">
              {players.map((player) => (
                <li key={player.id}>{player.username}</li>
              ))}
            </ul>
            <h3 className="section-title">Tournament Matches</h3>
            {matches.length > 0 ? (
              <ul className="matches-list">
                {matches.map((match) => (
                <li key={match.id}>
                    Round {match.round}: {match.player1_name || "TBD"} vs {match.player2_name || "TBD"}
                </li>
                ))}
              </ul>
            ) : (
              <p>No matches yet.</p>
            )}
          </>
        ) : (
          <p className="info-text">Click a tournament to see details.</p>
        )}
      </div>
    </div>
  );
}