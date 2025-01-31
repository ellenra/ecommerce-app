import { Input } from "@nextui-org/react";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";

const Search = ({ setSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearch(searchQuery);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        isClearable
        type="text"
        placeholder="Search Products"
        value={searchQuery}
        onChange={({ currentTarget: query }) => setSearchQuery(query.value)}
        startContent={
          <button type="button" onClick={handleSubmit}>
            <SearchIcon className="cursor-pointer" />
          </button>
        }
        className="border rounded-lg w-[300px] lg:w-[400px] bg-white"
      />
    </form>
  );
};

export default Search;
