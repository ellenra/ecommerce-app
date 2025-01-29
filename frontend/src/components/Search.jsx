import { Input } from "@nextui-org/react";
import SearchIcon from "@mui/icons-material/Search";

const Search = ({ setSearch }) => {
  return (
    <Input
      isClearable
      type="text"
      placeholder="Search Products"
      onChange={({ currentTarget: input }) => setSearch(input.value)}
      startContent={<SearchIcon />}
      className="border rounded-lg w-[300px] lg:w-[400px]"
    />
  );
};

export default Search;
