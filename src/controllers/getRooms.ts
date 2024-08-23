import { getSession } from "next-auth/react";

const ITEMS_PER_PAGE = 6;

export default async function getRooms(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    // Obtener la sesión del usuario actual
    const session = await getSession();
    const userId = session?.user?._id;
    const userType = session?.user?.typeProfile;

    // Obtener los datos de las salas
    const response = await fetch(`/api/salas?query=${query}&limit=${ITEMS_PER_PAGE}&offset=${offset}`, {
      cache: "no-store",
    });
    const salasData = await response.json();

    // Filtrar las salas según el tipo de usuario
    if (userType === '660ebaa7b02ce973cad66550') {
      // Master puede ver todas las salas
      return salasData.data;
    } else if (userType === '660ebaa7b02ce973cad66551') {
      // Cliente solo puede ver las salas asignadas a ellos
      return salasData.data.filter(sala => sala.client === userId);
    } else if (userType === '660ebaa7b02ce973cad66552') {
      // Operador solo puede ver las salas donde el operador está asignado
      return salasData.data.filter(sala => sala.operator.includes(userId));
    } else {
      // Manejar otros casos si es necesario (por ejemplo, rol 'Socio' o 'Usuario')
      return [];
    }
  } catch (error) {
    console.error("Error al obtener las salas:", error);
    return [];
  }
}
