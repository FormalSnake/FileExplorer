import { Dispatch, SetStateAction, useState } from "react";
import { DirectoryContent } from "../../types";
import { invoke } from "@tauri-apps/api/tauri";
import SearchFilter from "./SearchFilter";
import Input, { InputSize } from "../../ui/Input";

interface Props {
  currentVolume: string;
  currentDirectoryPath: string;
  setSearchResults: Dispatch<SetStateAction<DirectoryContent[]>>;
}

export interface ISearchFilter {
  extension: string;
  acceptFiles: boolean;
  acceptDirectories: boolean;
}

export default function SearchBar({
  currentDirectoryPath,
  currentVolume,
  setSearchResults,
}: Props) {
  const [searchValue, setSearchValue] = useState("");
  const [searchFilter, setSearchFilter] = useState<ISearchFilter>({
    extension: "",
    acceptFiles: true,
    acceptDirectories: true,
  });

  const split = currentDirectoryPath.split("\\");
  const currentPlace = split[split.length - 2];

  async function onSearch() {
    const results = await invoke<DirectoryContent[]>("search_directory", {
      query: searchValue,
      searchDirectory: currentDirectoryPath,
      mountPnt: currentVolume,
      extension: searchFilter.extension,
      acceptFiles: searchFilter.acceptFiles,
      acceptDirectories: searchFilter.acceptDirectories,
    });

    setSearchResults(results);
  }

  return (
    <div>
      <Input
        value={searchValue}
        setValue={setSearchValue}
        placeholder={`Search ${currentPlace || "computer"}`}
        className="rounded-bl-none rounded-br-non "
        onSubmit={onSearch}
        size={InputSize.Large}
      />
      <SearchFilter filters={searchFilter} setFilters={setSearchFilter} />
    </div>
  );
}
