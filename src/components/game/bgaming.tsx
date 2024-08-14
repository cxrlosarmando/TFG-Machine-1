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
  const swiperRef = useRef<any>(null);
  const [idMachineFromURL, setIdMachineFromURL] = useState<string | null>(null); // Estado para almacenar idMachine

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionData = await getSessionData();
        const params = new URLSearchParams(window.location.search);
        const idMachine = params.get('idMachine'); 
        setIdMachineFromURL(idMachine); // Establece el idMachine en el estado

        if (sessionData.status === 200) {
          const provider = 68;
          const response = await fetch(`/api/juegosApi/${idMachine}/${provider}`);
          const data = await response.json();

          if (data.data && data.data.token) {
            setToken(data.data.token);
          } else {
            return;
          }

          const globalGamesResponse = await fetch('/api/juegosApi');
          const globalGamesData = await globalGamesResponse.json();

          if (globalGamesData.data && Array.isArray(globalGamesData.data)) {
            const activeGlobalGames = globalGamesData.data.flatMap(providerData => providerData.games).filter(game => game.status === 1);
            const activeBelatraGames = data.data.games.filter((game: any) => game.maker === 'bgaming' && game.status === 1);

            const finalBelatraGames = activeBelatraGames.filter(bgamingGame => 
              activeGlobalGames.some(globalGame => globalGame.id === bgamingGame.id)
            );

            setGames(finalBelatraGames);
          } else {
            console.error("Estructura de datos inesperada:", globalGamesData);
          }
        } else {
          console.error("Usuario no autenticado:", sessionData.data.message);
        }
      } catch (error) {
        console.error("Error al obtener los datos de sesión:", error);
      }
    };

    fetchData();
  }, []);

  const handlePrevButtonClick = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleNextButtonClick = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const handleGameClick = (game: any) => {
    setSelectedGame(game);
  };

  const closeGameUrl = () => {
    setSelectedGame(null);
  };

  return (
    <div className="belatra-container">
      <div className="navigation-buttons">
        <div className="swiper-button-prev swiper-button-prev-img" onClick={handlePrevButtonClick}></div>
        <div className="swiper-button-next swiper-button-next-img" onClick={handleNextButtonClick}></div>
      </div>
      <Swiper
        slidesPerView={1}
        spaceBetween={10}
        ref={swiperRef}
        navigation={true}
      >
        {[...Array(Math.ceil(games.length / 8))].map((_, pageIndex) => (
          <SwiperSlide key={pageIndex}>
            <div className="swiper-slide-content">
              {(games.slice(pageIndex * 8, (pageIndex + 1) * 8)).map((game, index) => (
                <div key={index} className="col-3 col-md-3">
                  <div className="btn-game" onClick={() => handleGameClick(game)}>
                    <Image
                      src={game.image}
                      alt={game.name}
                      style={{width:'100%'}}
                      width={500} 
                      height={500}
                    />
                    <div className="subtitle">
                      {game.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {selectedGame && token && idMachineFromURL && (
        <GameUrl game={selectedGame} token={token} idMachine={idMachineFromURL} onClose={closeGameUrl} />
      )}
    </div>
  );
}

export default Belatra;
