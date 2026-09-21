import { forwardRef } from "react";
import { Input as AntdInput } from "antd";
import type { SearchProps } from "antd/es/input";
import type { InputRef } from "antd";

export interface GZDSearchProps extends SearchProps {}

const Search = forwardRef<InputRef, GZDSearchProps>((props, ref) => {
  return <AntdInput.Search ref={ref} {...props} />;
});

Search.displayName = "GZDSearch";

export default Search;
