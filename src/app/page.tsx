// Importa el SocketProvider desde la ubicación correcta
import { SocketProvider } from '@/app/socket.io/socketContext'; // Ajusta la ruta según tu estructura
import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "the Factory Gaming",
  description: "Dashboard - Agregadora RestAPI",
};

export default function Home() {
  return (
    <SocketProvider>
      <DefaultLayout>
        <ECommerce />
      </DefaultLayout>
    </SocketProvider>
  );
}
