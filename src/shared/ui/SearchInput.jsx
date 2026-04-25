import { SearchIcon } from "../icons";
import TextInput from "./TextInput";

export default function SearchInput({
  containerClassName = "",
  className = "",
  iconClassName = "",
  ...props
}) {
  return (
    <div className={`search-input ${containerClassName}`.trim()}>
      <TextInput className={className} type="text" {...props} />
      <SearchIcon className={`search-input__icon ${iconClassName}`.trim()} />
    </div>
  );
}
