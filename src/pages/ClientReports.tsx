import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ClientReports = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redireciona para a página de login
    navigate("/auth/login", { replace: true });
  }, [navigate]);

  return null;
};

export default ClientReports;
