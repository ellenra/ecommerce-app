import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Input, Image } from "@nextui-org/react";
import { useUser } from "../UserContext";
import storeCategories from "../utils/storeCategories.json";
import userService from "../services/userservice";
import storeservice from "../services/storeservice";

const StoreForm = () => {
  const { storeId } = useParams();
  const currentUser = useUser();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [store, setStore] = useState(null);
  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [viewProfilePicture, setViewProfilePicture] = useState(null);

  useEffect(() => {
    if (currentUser) {
      const fetchUserData = async () => {
        try {
          const user = await userService.getUser(currentUser.id);
          setUser(user);
        } catch (error) {
          console.error("Error fetching user data:", error.message);
        }
      };

      fetchUserData();
    }
  }, [currentUser]);

  useEffect(() => {
    if (storeId) {
      const fetchStoreData = async () => {
        try {
          const storeData = await storeservice.getStore(storeId);
          setStore(storeData);
          setStoreName(storeData.name);
          setDescription(storeData.description);
          setCategoryId(storeData.categoryId);
          setViewProfilePicture(storeData.profileUrl || "");
          setBannerUrl(storeData.bannerUrl || "");
        } catch (error) {
          console.error("Error fetching store data:", error.message);
        }
      };

      fetchStoreData();
    }
  }, [storeId]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileUrl(file);
      const reader = new FileReader();

      reader.onloadend = () => {
        setViewProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStoreForm = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("userId", user.id);
      formData.append("name", storeName);
      formData.append("description", description);
      formData.append("categoryId", categoryId);
      if (profileUrl !== "") {
        formData.append("file", profileUrl);
      } else {
        formData.append("profileUrl", viewProfilePicture);
      }

      if (storeId) {
        await storeservice.updateStore(storeId, formData);
        navigate(`/stores/${storeId}`);
      } else {
        const newStore = await storeservice.createStore(formData);
        navigate(`/stores/${newStore.id}`);
      }
    } catch (exception) {
      console.log("error in store form", exception.message);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
      <form onSubmit={handleStoreForm}>
        <div>{storeId ? "Edit Store" : "Create Store"}</div>
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
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
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
          {viewProfilePicture && viewProfilePicture !== "null" ? (
            <>
              <div className="mb-2">
                <Image
                  shadow="sm"
                  radius="lg"
                  alt="Profile"
                  className="w-full object-cover h-[140px]"
                  src={viewProfilePicture}
                  style={{
                    width: "200px",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </div>
              <div className="mt-2 flex gap-2">
                <Button
                  color="danger"
                  variant="flat"
                  onClick={() => {
                    setProfileUrl("");
                    setViewProfilePicture("");
                  }}
                >
                  Delete Image
                </Button>
              </div>
            </>
          ) : (
            <Input type="file" name="file" onChange={handleImageUpload} />
          )}
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

        <Button type="submit">
          {storeId ? "Update Store" : "Create Store"}
        </Button>
      </form>
    </div>
  );
};

export default StoreForm;
