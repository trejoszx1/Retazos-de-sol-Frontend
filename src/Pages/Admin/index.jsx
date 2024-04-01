import { useContext } from "react";
import { Link } from "react-router-dom";
import { ChevronLeftIcon, ClipboardDocumentListIcon } from "@heroicons/react/24/solid";
import { ShoppingCartContext } from "../../Context";
import Layout from "../../Components/Layout";

function Admin() {
  const context = useContext(ShoppingCartContext);
  const currentPath = window.location.pathname;
  let index = currentPath.substring(currentPath.lastIndexOf("/") + 1);
  if (index === "last") index = context.order?.length - 1;

  return (
    <Layout>
      <div className="flex items-center justify-center relative w-80 mb-6">
        <Link to="/my-orders" className="absolute left-0">
          <ChevronLeftIcon className="h-6 w-6 text-black cursor-pointer" />
        </Link>
        <h1>Admin</h1>
      </div>

      <Link
        to="/admin/shipping-lavel-template"
        className="flex items-center justify-center relative w-80 mb-6"
      >
        <ChevronLeftIcon className="h-6 w-6 text-black cursor-pointer" /> Guias
      </Link>

      <Link
      to="/forms"
      className="flex items-center justify-center relative w-80 mb-6"
    >
      <ChevronLeftIcon className="h-6 w-6 text-black cursor-pointer" /> Forms
    </Link>
    

    <Link
    to="/admin/create-orders"
    className="flex items-center justify-center relative w-80 mb-6"
    > 
    <ClipboardDocumentListIcon  className="h-6 w-6 text-black cursor-pointer"/> Crear una orden
    </Link>
    
    </Layout>
  );
}

export default Admin;
