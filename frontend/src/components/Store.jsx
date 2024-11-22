import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "@nextui-org/react";
import { useUser } from "../UserContext";
import storeCategories from "../utils/storeCategories.json";
import userService from "../services/userservice";

const Store = () => {
  const navigate = useNavigate();
  const currentUser = useUser();
  const [user, setUser] = useState(null);
  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");

  useEffect(() => {
    if (currentUser) {
      const fetchUserData = async () => {
        try {
          const user = await userService.getUser(currentUser.id);
          setUser(user);
          console.log("Fetched user data:", user);
        } catch (error) {
          console.error("Error fetching user data:", error.message);
        }
      };

      fetchUserData();
    }
  }, [currentUser]);

  console.log(user);

  const handleCreateStore = async (event) => {
    event.preventDefault();
    try {
      const newStore = await userService.createStore({
        userId: user.id,
        name: storeName,
        description,
        category,
        profileUrl,
        bannerUrl,
      });
      setStoreName("");
      setDescription("");
      setCategory("");
      setProfileUrl("");
      setBannerUrl("");
      navigate("/");
    } catch (exception) {
      console.log("error in creating store", exception.message);
    }
  };

  return (
    <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
      <form onSubmit={handleCreateStore}>
        <div>Create store:</div>
        <div>
          Store Name:
          <Input
            type="text"
            label="Store Name"
            value={storeName}
            onChange={(event) => setStoreName(event.target.value)}
            required
          />
        </div>

        <div>
          Store Description:
          <Input
            type="text"
            label="Store Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          />
        </div>

        <div>
          Store Category:
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            required
          >
            <option value="">Select a category</option>
            {storeCategories.map((cat) => (
              <option key={cat.key} value={cat.key}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          Profile Image URL (optional):
          <Input
            type="url"
            label="Profile Image URL"
            value={profileUrl}
            onChange={(event) => setProfileUrl(event.target.value)}
          />
        </div>

        <div>
          Banner Image URL (optional):
          <Input
            type="url"
            label="Banner Image URL"
            value={bannerUrl}
            onChange={(event) => setBannerUrl(event.target.value)}
          />
        </div>

        <Button type="submit">Create Store</Button>
      </form>
    </div>
  );
};

export default Store;
