

export default async function getSingleJuegos(id: any){
    try {
        const response = await fetch(`/api/juegosApi/${id}`,{
            cache: "no-store",
        });
        const games = await response.json();
        return games.data;
    } catch (error) {
        console.log(error)
    }
}
