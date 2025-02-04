import { useEffect, useState } from "react";
import { useAuth } from "../hooks/AuthContext";
import { useNavigate } from "react-router-dom";
import adminservice from "../services/adminservice";

const AdminDashboard = () => {
  const { session } = useAuth();
  const [admin, setAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      if (session) {
        const isAdmin = await adminservice.checkAdmin(session.user.id);

        if (isAdmin) {
          setAdmin(isAdmin);
        } else {
          navigate("/");
        }
      } else {
        navigate("/");
      }
    };
    checkAdmin();
  }, [session]);

  return admin ? (
    <>
      <div>Admin Dashboard</div>
    </>
  ) : null;
};

export default AdminDashboard;
