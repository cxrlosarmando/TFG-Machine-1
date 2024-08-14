"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import AtrasButton from "@/components/AtrasButton";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

const EditTransaction: React.FC<{ transaction: any }> = ({ transaction }) => {

    const columns = [
        {
          name: 'Fecha',
          selector: (row: MaquinaData) => row.id_machine,
          sortable: true,
        },
        {
            name: 'ID Máquina',
            selector: (row: MaquinaData) => row.id_machine,
            sortable: true,
          },
          {
            name: 'Plataforma',
            selector: (row: MaquinaData) => row.id_machine,
            sortable: true,
          },
          {
            name: 'Billetera',
            selector: (row: MaquinaData) => row.id_machine,
            sortable: true,
          },
          {
            name: 'Descripción',
            selector: (row: MaquinaData) => row.id_machine,
            sortable: true,
          },
          {
            name: 'Juego',
            selector: (row: MaquinaData) => row.id_machine,
            sortable: true,
          },
          {
            name: 'Egreso',
            selector: (row: MaquinaData) => row.id_machine,
            sortable: true,
          },
          {
            name: 'Total balance',
            selector: (row: MaquinaData) => row.id_machine,
            sortable: true,
          },
      ];

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Transacción de billetera" />
        <AtrasButton href="/dashboard/maquinas" />
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="mx-auto max-w-270">
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <header className="border-b border-stroke py-4 px-6 dark:border-strokedark">
            <h2 className="font-medium text-black dark:text-white">
           Transacción de billetera
      </h2>
    </header>
    <div className="p-6">
      {/* Agrega el campo de búsqueda */}
      <input
        type="text"
        placeholder="Buscar transacción..."
        className="w-full mb-4 px-3 py-2 rounded border border-stroke focus:outline-none focus:border-primary dark:bg-boxdark"
        // value={searchTerm}
        // onChange={(e) => setSearchTerm(e.target.value)}
      />
      {/* Renderiza la DataTable con los datos filtrados */}
      {/* <DataTable
        columns={columns}
        data={filteredMaquinas}
        pagination
        highlightOnHover
        responsive
      /> */}
    </div>
  </div>
</div>

        </div>
      </div>
    </DefaultLayout>
  );
};

export default EditTransaction;
