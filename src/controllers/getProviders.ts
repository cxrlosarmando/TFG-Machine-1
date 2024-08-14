const ITEMS_PER_PAGE = 6;

export default async function getProviders(query = '', currentPage = 1) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const response = await fetch(`/api/providers?query=${query}&limit=${ITEMS_PER_PAGE}&offset=${offset}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error('Error en la respuesta del servidor');
    }

    const provider = await response.json();
    return provider.data;
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    throw new Error('Error al obtener proveedores');
  }
}
