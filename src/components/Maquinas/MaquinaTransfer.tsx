"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import AtrasButton from "@/components/AtrasButton";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

const EditTransaction: React.FC<{ transaction: any }> = ({ transaction }) => {
  const [newNombre, setNewNombre] = useState<string>(transaction?.user || '');
  const [newCurrency, setNewCurrency] = useState<string>("CLP");
  const [newMessage, setNewMessage] = useState<string>('');
  const [action] = useState<string>('DEBIT');
  const [balance, setNewBalance] = useState<number>(transaction?.balance || 0);
  const [amount, setAmount] = useState<number>(0);
  const [idMachine, setIdMachine] = useState<string>("");

  useEffect(() => {
    // Extract id_machine from the pathname
    const pathname = window.location.pathname;
    const urlParts = pathname.split("/");
    const id = urlParts[urlParts.length - 1];
    setIdMachine(id);

    if (!id) {
      console.error('No ID found in pathname.');
      return;
    }

    // Fetch the balance and currency from the API
    fetch(`/api/v1`)
      .then(response => response.json())
      .then(data => {
        console.log('API Response:', data); // Add this line to debug the response
        if (data.status === 'OK') {
          // Assuming data.data is an array of machine data
          const machineData = data.data.find((item: any) => item.user === id);
          if (machineData) {
            setNewBalance(machineData.balance);
            setNewCurrency(machineData.currency || 'Unknown');
            setNewNombre(machineData.user); // Update the name based on API data
          } else {
            console.error('Machine data not found for ID:', id);
          }
        } else {
          throw new Error('Error fetching transaction details.');
        }
      })
      .catch(error => console.error('Error fetching API:', error));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!idMachine) {
      console.error('ID Machine is missing.');
      return;
    }

    const transferData = {
      currency: newCurrency,
      id_machine: idMachine,
      balance,
      message: newMessage,
      action,
      amount,
    };

    try {
      const response = await fetch(`/api/debit/${idMachine}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transferData),
      });

      if (response.ok) {
        window.location.href = "/dashboard/maquinas";
      } else {
        const errorData = await response.json();
        console.error("Error al hacer la solicitud:", errorData.message);
      }
    } catch (error) {
      console.error("Error de red:", error.message);
    }
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Transacción manual de débito" />
        <AtrasButton href="/dashboard/maquinas" />
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <form onSubmit={handleSubmit} className="p-6.5">
            <h1 className="mb-6">DATOS DE LA MAQUINA</h1>
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/3">
                <label
                  htmlFor="newNombre"
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                >
                  ID Maquina
                </label>
                <input
                  value={newNombre}
                  id="newNombre"
                  name="newNombre"
                  type="text"
                  placeholder="id machine"
                  className="w-full rounded border-[1.5px] border-stroke bg-gray-800 text-gray-100 px-5 py-3 outline-none transition focus:border-primary active:border-primary"
                  readOnly
                  disabled
                />
              </div>
              <div className="w-full xl:w-1/3">
                <label
                  htmlFor="currency"
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                >
                  Moneda
                </label>
                <input
                  value={newCurrency}
                  id="currency"
                  name="currency"
                  type="text"
                  placeholder="Moneda"
                  className="w-full rounded border-[1.5px] border-stroke bg-gray-800 text-gray-100 px-5 py-3 outline-none transition focus:border-primary active:border-primary"
                  readOnly
                  disabled
                />
              </div>
              <div className="w-full xl:w-1/3">
                <label
                  htmlFor="balance"
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                >
                  Balance actual
                </label>
                <input
                  onChange={(e) => setNewBalance(Number(e.target.value))}
                  value={balance}
                  id="balance"
                  name="balance"
                  type="text"
                  placeholder="Balance actual"
                  className="w-full rounded border-[1.5px] border-stroke bg-gray-800 text-gray-100 px-5 py-3 outline-none transition focus:border-primary active:border-primary"
                  readOnly
                  disabled
                />
              </div>
            </div>
            <h1 className="mb-6">TRANSACCIÓN DÉBITO</h1>
            <div className="mb-4">
              <label
                htmlFor="amount"
                className="mb-3 block text-sm font-medium text-black dark:text-white"
              >
                Ingresa un monto <span className="text-red">*</span>
              </label>
              <input
                onChange={(e) => setAmount(Number(e.target.value))}
                value={amount}
                id="amount"
                name="amount"
                type="number"
                placeholder="$0.00"
                className="w-full rounded border-[1.5px] border-stroke bg-gray-800 text-gray-100 px-5 py-3 outline-none transition focus:border-primary active:border-primary"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="message"
                className="mb-3 block text-sm font-medium text-black dark:text-white"
              >
                Mensaje
              </label>
              <input
                onChange={(e) => setNewMessage(e.target.value)}
                value={newMessage}
                id="message"
                name="message"
                type="text"
                placeholder="Escribe un mensaje"
                className="w-full rounded border-[1.5px] border-stroke bg-gray-800 text-gray-100 px-5 py-3 outline-none transition focus:border-primary active:border-primary"
              />
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <Link
                href="/dashboard/maquinas"
                className="bg-gray-100 text-gray-600 hover:bg-gray-200 flex h-10 items-center rounded-lg px-4 text-sm font-medium transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                className="flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-600"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default EditTransaction;
