

export default async function getSingleProviders(id: any){
    try {
        const response = await fetch(`http://localhost:3000/api/providers/${id}`,{
            cache: "no-store",
        });
        const providers = await response.json();
        return providers.data;
    } catch (error) {
        console.log(error)
    }
}
