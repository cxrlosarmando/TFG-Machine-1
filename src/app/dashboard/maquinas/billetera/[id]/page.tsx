

import MaquinasBilletera from "@/components/Maquinas/MaquinaBilletera";
import getSingleTransaction from "@/controllers/getSingleTransaction";
import React from "react";

export default async function EditTransaction({params: {id}}: {params: {id: string}}) {
  const transaction = await getSingleTransaction(id);
  return (
    <>
      <MaquinasBilletera transaction={transaction} />
    </>
  );
}
