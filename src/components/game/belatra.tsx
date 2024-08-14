import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import getSessionData from "@/controllers/getSession";
import GameUrl from '@/components/game/gameUrl';
import Image from 'next/image';

const Belatra: React.FC = () => {
  const [games, setGames] = useState<any[]>([]);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [idMachine, setIdMachine] = useState<string | null>(null);
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionData = await getSessionData();
        
        // Validar datos de sesión
        if (!sessionData || sessionData.status !== 200) {
          console.error("Datos de sesión inválidos:", sessionData);
          return;
        }

        // Obtener idMachine de la URL
        const params = new URLSearchParams(window.location.search);
        const idMachineFromURL = params.get('idMachine');
        setIdMachine(idMachineFromURL);
        console.log("ID de máquina desde la URL:", idMachineFromURL);

        // Llamar a la API con el idMachine
        const provider = 29;
        const response = await fetch(`/api/juegosApi/${idMachineFromURL}/${provider}`);
        const data = await response.json();

        // Obtener token
        if (data.data?.token) {
          setToken(data.data.token);
        } else {
          console.error("Token no disponible en la respuesta.");
          return;
        }

        // Obtener juegos globales
        const globalGamesResponse = await fetch('/api/juegosApi');
        const globalGamesData = await globalGamesResponse.json();

        // Filtrar juegos activos
        if (Array.isArray(globalGamesData.data)) {
          const activeGlobalGames = globalGamesData.data.flatMap(providerData => providerData.games).filter(game => game.status === 1);
          const activeBelatraGames = data.data.games.filter((game: any) => game.maker === 'belatra' && game.status === 1);

          const finalBelatraGames = activeBelatraGames.filter(belatraGame => 
            activeGlobalGames.some(globalGame => globalGame.id === belatraGame.id)
          );

          setGames(finalBelatraGames);
        } else {
          console.error("Estructura de datos inesperada:", globalGamesData);
        }
      } catch (error) {
        console.error("Error al obtener los datos de sesión:", error);
      }
    };

    fetchData();
  }, []);

  const handleGameClick = (game: any) => {
    setSelectedGame(game);
  };

  const closeGameUrl = () => {
    setSelectedGame(null);
  };

  return (
    <div className="belatra-container">
      <Swiper slidesPerView={1} spaceBetween={10} ref={swiperRef}>
        {games.map((game, index) => (
          <SwiperSlide key={index}>
            <div className="game-card" onClick={() => handleGameClick(game)}>
              <Image src={game.image} alt={game.name} width={500} height={500} />
              <div className="game-name">{game.name}</div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {selectedGame && token && (
        <GameUrl game={selectedGame} token={token} onClose={closeGameUrl} />
      )}
    </div>
  );
}

export default Belatra;
