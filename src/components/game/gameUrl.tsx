import React, { useState, useEffect } from "react";
import { FaRegRectangleXmark } from "react-icons/fa6";

// Mapa de códigos Alpha-2 para países según el modelo
const countryCodeMap: { [key: string]: string } = {
  "Chile": "CL",
  "Mexico": "MX",
  "República Dominicana": "DO",
  "Perú": "PE",
  "Brazil": "BR",
  // Agrega más países si es necesario
};

// Función para obtener el código Alpha-2 desde el nombre del país
const getCountryCode = (countryName: string): string => {
  return countryCodeMap[countryName] || 'CL'; // Valor predeterminado si no se encuentra el país
};

interface GameUrlProps {
  game: any;
  token: string;
  onClose: () => void;
}

const GameUrl: React.FC<GameUrlProps> = ({ game, token, onClose }) => {
  const [showVideo, setShowVideo] = useState(false);
  const [gameUrl, setGameUrl] = useState<string | null>(null);
  const [idMachine, setIdMachine] = useState<string | null>(null);
  const [country, setCountry] = useState<string>('');
  const [currency, setCurrency] = useState<string>('');

  useEffect(() => {
    // Extraer idMachine de la URL
    const params = new URLSearchParams(window.location.search);
    const idMachineParam = params.get('idMachine');
    setIdMachine(idMachineParam);

    const fetchRoomData = async (idMachine: string) => {
      try {
        console.log("Fetching room data for idMachine:", idMachine); // Depuración

        const response = await fetch(`/api/salas`);
        if (response.ok) {
          const data = await response.json();
          console.log("API response data:", data); // Depuración

          if (Array.isArray(data.data)) {
            // Filtrar la sala que contiene el idMachine específico
            const room = data.data.find((room: any) => room.id_machine.includes(idMachine));
            console.log("Room found:", room); // Depuración

            if (room) {
              const countryName = room.pais[0] || 'Chile'; // Valor por defecto si no hay datos
              const currencyCode = room.currency[0] || 'CLP'; // Valor por defecto si no hay datos
              console.log("Asignando country y currency:", countryName, currencyCode); // Depuración

              setCountry(getCountryCode(countryName));
              setCurrency(currencyCode);
            } else {
              console.error("No se encontró la sala con id_machine:", idMachine);
            }
          } else {
            console.error("La respuesta no contiene un array en la propiedad 'data'.");
          }
        } else {
          console.error("Error en la solicitud para obtener los datos de la sala.");
        }
      } catch (error) {
        console.error("Error al procesar la solicitud:", error);
      }
    };

    if (idMachine) {
      fetchRoomData(idMachine);
    }
  }, [idMachine]);

  useEffect(() => {
    const fetchGameUrl = async () => {
      if (!idMachine || !country || !currency) return;

      try {
        // Construir la URL del juego usando los datos obtenidos
        const url = `https://aggregator.casinoenruta.com/api/game?SessionToken=${token}&client_secret=9ffcfd63-e809-451c-9651-955c0622709d&user=${idMachine}&username=${idMachine}&balance=0&country=${country}&currency=${currency}&game=${game.id}&return_url=https://google.com&language=es_ES&mobile=false`;
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

    if (game && idMachine) {
      fetchGameUrl();
    }
  }, [game, token, idMachine, country, currency]);

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
