import React, { useEffect, useState } from "react";
import DataTable from 'react-data-table-component';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface ProvidersData {
  _id: string;
  provider_name: string;
  provider: number;
  status: number;
}

interface ProviderTableProps {
providers: ProvidersData[];

}

const ProviderTable: React.FC<ProviderTableProps> = ( {providers}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [provider, setProviders] = useState<ProvidersData[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<ProvidersData[]>([]);

  console.log(providers);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch("/api/providers");
        if (!response.ok) {
          throw new Error("Failed to fetch providers");
        }
        const data = await response.json();
        setProviders(data.data);
        setFilteredProviders(data.data);
      } catch (error) {
        console.error("Error fetching providers:", error);
        toast.error("Failed to fetch providers");
      }
    };

    fetchProviders();
  }, []);

  const handleToggleStatus = async (row: ProvidersData, newStatus: number) => {
    try {
      const response = await fetch(`/api/providers/${row._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newStatus }), 
      });
  
      if (!response.ok) {
        throw new Error("Failed to update provider status");
      }
  
      const updatedProviders = filteredProviders.map(provider =>
        provider._id === row._id ? { ...provider, status: newStatus } : provider
      );
      setFilteredProviders(updatedProviders);
      toast.success(`Estado de ${row.provider_name} actualizado a ${newStatus}.`);
    } catch (error) {
      console.error("Error updating provider status:", error);
      toast.error("Failed to update provider status");
    }
  };
  
  const columns = [
    {
      name: 'Estado',
      cell: (row: ProvidersData) => (
        <select
          value={row.status}
          onChange={(e) => handleToggleStatus(row, parseInt(e.target.value))}
          className="form-select h-5 w-5 text-green-500"
        >
          <option value={0}>Inactivo</option>
          <option value={1}>Activo</option>
        </select>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
    },
    {
      name: 'Número status',
      selector: (row: ProvidersData) => row.status,
      sortable: true,
    },
    {
      name: 'N°',
      selector: (row: ProvidersData) => row._id,
      sortable: true,
    },
    {
      name: 'Nombre Proveedor',
      selector: (row: ProvidersData) => row.provider_name,
      sortable: true,
    },
    {
      name: 'N° Proveedor',
      selector: (row: ProvidersData) => row.provider,
      sortable: true,
    },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);

    const filteredData = providers.filter((provider) =>
      provider.provider_name.toLowerCase().includes(searchTerm)
    );

    setFilteredProviders(filteredData);
  };

  return (
    <div className="mx-auto max-w-270">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <header className="border-b border-stroke py-4 px-6 dark:border-strokedark">
          <h2 className="font-medium text-black dark:text-white">
            Listado de proveedores
          </h2>
        </header>
        <div className="p-6 ">
          <input
            type="text"
            placeholder="Buscar proveedor..."
            className="w-full mb-4 px-3 py-2 rounded border border-stroke focus:outline-none focus:border-primary dark:bg-boxdark "
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <DataTable
            columns={columns}
            data={filteredProviders}
            pagination
            highlightOnHover
            responsive
          />
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default ProviderTable;
