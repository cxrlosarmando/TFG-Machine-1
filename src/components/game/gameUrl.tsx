import React, { useState, useEffect } from "react";
import { FaRegRectangleXmark } from "react-icons/fa6";

interface GameUrlProps {
  game: any;
  token: string;
  onClose: () => void;
}

const GameUrl: React.FC<GameUrlProps> = ({ game, token, onClose }) => {
  const [showVideo, setShowVideo] = useState(false);
  const [gameUrl, setGameUrl] = useState<string | null>(null);
  const [idMachine, setIdMachine] = useState<string | null>(null);

  useEffect(() => {
    // Extract idMachine from URL
    const params = new URLSearchParams(window.location.search);
    const idMachineParam = params.get('idMachine');
    setIdMachine(idMachineParam);

    const fetchGameUrl = async () => {
      if (!idMachine) return;

      try {
        const url = `https://aggregator.casinoenruta.com/api/game?SessionToken=${token}&client_secret=9ffcfd63-e809-451c-9651-955c0622709d&user=${idMachine}&username=${idMachine}&balance=0&country=CL&currency=CLP&game=${game.id}&return_url=https://google.com&language=es_ES&mobile=false`;
        console.log("AQUI game URL:", url);


        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          if (data.status === "OK" && data.data.url) {
            setGameUrl(data.data.url);
            setShowVideo(true);
          } else {
            console.error("Error al obtener la URL del juego:", data);
          }
        } else {
          console.error("Error en la solicitud para obtener la URL del juego.");
        }
      } catch (error) {
        console.error("Error al procesar la solicitud:", error);
      }
    };

    if (game) {
      fetchGameUrl();
    }
  }, [game, token, idMachine]);

  const closeGame = () => {
    onClose();
    setShowVideo(false);
  };

  return (
    <div id="crash">
      {showVideo && game && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(120, 0, 0, 0.9)", zIndex: 999 }}>
          <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(120, 0, 0, 0.9)", zIndex: 999 }}>
            <button onClick={closeGame} style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "white",
              minWidth: "30px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)"
            }}>
              <FaRegRectangleXmark style={{ fontSize: '1.5em', color: "rgb(129, 18, 10)" }} />
            </button>
            <iframe
              title="Play Demo"
              src={gameUrl || ""}
              className="fullscreen-video"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameUrl;
