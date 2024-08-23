

export default async function getSingleTransaction(id: any){
    try {
        const response = await fetch(`/api/v1/${id}`,{
            cache: "no-store",
        });
        const transaction = await response.json();
        return transaction.data;
    } catch (error) {
        console.log(error)
    }
}
