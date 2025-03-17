import { useState, useEffect } from 'react';
import "../styles/tournament.css"; 
import { fetchTournamentList, fetchTournamentStatus, fetchTournamentPlayers, fetchTournamentMatches, tournamentSignup } from "../services/tournamentServices";

export default function TournamentList() {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    async function fetchTournaments() {
        const data = await fetchTournamentList();
        setTournaments(data);
    }
    fetchTournaments();
  }, []);

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

  const handleSignup = async (tournamentId) => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert(" You need to log in to view tournament data!");
        return;
    }

    //   const res = await fetch("http://localhost:5000/api/tournament/signup", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //         "Authorization": `Bearer ${token}` // Attach token
    //       },
    //     body: JSON.stringify({ tournamentId }),
    //   });
  
    //   const data = await res.json();
      const data = await tournamentSignup(tournamentId);
  
      if (res.ok) {
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
        {tournaments.map((tournament) => (
          <div key={tournament.id} className="tournament-card" onClick={() => fetchTournamentDetails(tournament.id)}>
            <h2>{tournament.name}</h2>
            <p>Players: {tournament.players_signed_up} / {tournament.max_players}</p>
            <p>Status: <span style={{ color: tournament.status === 'in-progress' ? 'green' : 'orange' }}>{tournament.status}</span></p>
          </div>
        ))}
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