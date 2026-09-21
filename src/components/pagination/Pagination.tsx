import { forwardRef } from "react";
import { Pagination as AntdPagination } from "antd";
import type { PaginationProps } from "antd";

export interface GZDPaginationProps extends PaginationProps {}

// 注意: Ant Design 的 Pagination 是 React.FC，不直接支持 forwardRef 暴露内部节点
// 如果业务方需要获取 DOM ref，我们在外层包裹一层 div 以符合规范
const Pagination = forwardRef<HTMLDivElement, GZDPaginationProps>((props, ref) => {
  const { children, ...restProps } = props as any;
  
  return (
    <div ref={ref}>
      <AntdPagination {...restProps} />
    </div>
  );
});

Pagination.displayName = "GZDPagination";

export default Pagination;
