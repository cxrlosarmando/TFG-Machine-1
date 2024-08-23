"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Swal from 'sweetalert2';
import { FaCircleCheck } from "react-icons/fa6";
import axios from 'axios'; 
import '../../../css/globals.css';

const Maquinas: React.FC = () => {
  const [info, setInfo] = useState({
    id_machine: "",
    password: "",
  });

  const [error, setError] = useState("");
  // const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleInput(e: any) {
    setInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

 
async function obtenerInformacionMaquina(idMachine) {
  try {
    const res = await axios.get(`/api/juegosApi/${idMachine}`);
    
    if (res.status === 200) {
      const machineData = res.data.data;
      const roomDetails = machineData.room;
      return roomDetails;
    } else {
      throw new Error("Error al obtener la información de la máquina");
    }
  } catch (error) {
    console.error("Error al obtener la información de la máquina:", error);
    throw error;
  }
}


async function handleSubmit(e: any) {
  e.preventDefault();
  if (!info.id_machine || !info.password) {
    setError("Todos los campos son obligatorios");
    return;
  }

  setLoading(true);
  try {
    console.log("Enviando solicitud al backend con los siguientes datos:", info);
    const res = await signIn("credentialsmaquina", {
      id_machine: info.id_machine,
      password: info.password,
      redirect: false,
    });
    console.log("Respuesta del backend:", res);

    if (res?.error) {
      setError("ID de máquina o contraseña incorrectos");
    } else {
      // Obtener información de la sala asociada a la máquina
      const roomInfo = await obtenerInformacionMaquina(info.id_machine);
      console.log("Detalles de la sala obtenidos:", roomInfo);

      setTimeout(async () => {
        const result = await Swal.fire({
          title: 'CONFIRMACIÓN DE DATOS',
          html: `
            <p><span class="bold-text" style="color: black;">MAQUINA:</span> ${info.id_machine}</p>
            <p><span class="bold-text" style="color: black;">SALA:</span> ${roomInfo.nombre}</p>
            <p><span class="bold-text" style="color: black;">COMUNA:</span> ${roomInfo.comuna}</p>
            <p><span class="bold-text" style="color: black;">UBICACIÓN:</span> ${roomInfo.ciudad} / ${roomInfo.pais}</p>
          `,
          icon: 'success',
          showCancelButton: true,
          confirmButtonColor: 'rgb(227, 17, 108)',
          cancelButtonColor: 'rgb(102, 102, 102)',
          confirmButtonText: 'SÍ, ESTÁN CORRECTOS',
          cancelButtonText: 'CANCELAR',
          customClass: {
            title: 'custom-title',
            htmlContainer: 'custom-html',
          },
        });

        if (result.isConfirmed) {
          router.replace(`/games/?idMachine=${info.id_machine}`);
        }
        setLoading(false);
      }, 1000);
    }
  } catch (error) {
    console.error("Ocurrió un error al manejar la respuesta del backend:", error);
    setError("Ocurrió un error al iniciar sesión");
    setLoading(false);
  }
}
  
  return (
    <>
      {loading && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', zIndex: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.8)'}}>
          <div style={{ width: '50px', height: '50px', borderRadius: '50%', border: '5px solid transparent', borderTopColor: 'white', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ color: 'white', fontSize: '24px', marginTop: '20px' }}>CARGANDO DATOS</p>
        </div>
      )}
      <div className="rounded-sm shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-col justify-center items-center">
          <a>
            <Image
              className="dark:hidden p-3"
              src={"/images/logo/logo-white.png"}
              alt="Logo"
              width={350}
              height={32}
            />
          </a>
          <p id="testdecolor" className="2xl:px-20 text-center">
            Scanea el QRCode o ingresa los datos correspondientes a la máquina:
          </p>
        </div>
        <div className="flex flex-wrap items-center">
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="px-26 py-17.5">
              <Link className="mb-5.5 inline-block" href="/">
                <Image
                  className="hidden dark:block"
                  src={"/images/logo/QR-Factory.png"}
                  alt="Logo"
                  width={176}
                  height={32}
                />    
              </Link>
              <Image
                className="dark:hidden"
                src={"/images/logo/QR-Factory.png"}
                alt="Logo"
                width={200}
                height={32}
              />
            </div>
          </div>
          <div className="w-full xl:w-1/2 border-stroke" style={{borderLeft: '2px solid rgb(161, 16, 105)', height: '300px'}}>
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white"></label>
                  <div className="relative">
                    <input
                      onChange={(e) => handleInput(e)}
                      name="id_machine"
                      type="id_machine"
                      placeholder="Id Máquina"
                      className="w-full rounded-lg py-4 pl-6 pr-10 border-solid border-2 border-black"
                    />   
                   </div>
                </div>
                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white"></label>
                  <div className="relative">
                    <input
                      onChange={(e) => handleInput(e)}
                      name="password"
                      type="password"
                      placeholder="Contraseña"
                      className="w-full rounded-lg py-4 pl-6 pr-10 border-solid border-2 border-black"
                    />
                  </div>
                </div>
                {error && <span className="message">{error}</span>}
                <div className="mb-5" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <button
                  type="submit"
                  className="cursor-pointer rounded-lg bg-primary p-3 text-white transition hover:bg-opacity-90"
                  style={{display: 'flex', alignItems: 'center', fontSize: '16px', backgroundColor: '#a11069'}}
                >
                  <span style={{ marginRight: '8px' }}>VALIDAR DATOS</span>
                  <FaCircleCheck style={{ color: '#4CAF50', fontSize: '17px' }} />
                </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <footer>
          <div className="footer-content">
            <p>Para más información:</p>
            <a href="https://THEFACTORYGAMING.COM/MACHINE">
              <p>THEFACTORYGAMING.COM/MACHINE</p>
            </a>
          </div>
        </footer>
      </div> 
    </>
  );
};

export default Maquinas;
