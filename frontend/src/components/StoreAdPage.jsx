import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@nextui-org/react";
import { useAuth } from "../hooks/AuthContext";
import userservice from "../services/userservice";

const StoreAdPage = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      return;
    }
    const fetchUserData = async () => {
      try {
        const fetchedUser = await userservice.getUser(
          session.user.id,
          session.access_token
        );
        if (fetchedUser.store) {
          navigate(`/stores/${fetchedUser.store.id}/dashboard`);
        } else {
          navigate("/stores/create");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [session]);

  if (!session) {
    return (
      <div className="flex flex-col items-center p-10">
        <p className="text-2xl text-center m-6">Ready to become a seller?</p>
        <Button
          onClick={() => {
            navigate("/login", { state: { from: "/stores/create" } });
          }}
          className="border border-zinc-200 rounded-lg hover:bg-zinc-100 hover:border-zinc-300"
        >
          Create Store
        </Button>{" "}
        <p className="text-l text-center mt-10 mb-2">Already have a store?</p>
        <Button
          onClick={() => {
            navigate("/login", { state: { from: "/stores/create" } });
          }}
          className="border border-zinc-200 rounded-lg hover:bg-zinc-100 hover:border-zinc-300"
        >
          Sign in
        </Button>{" "}
      </div>
    );
  }

  return null;
};

export default StoreAdPage;
