import { forwardRef, useImperativeHandle, useRef } from "react";
import { Breadcrumb as AntdBreadcrumb, type BreadcrumbProps } from "antd";

// 面包屑组件属性
export type GZDBreadcrumbProps = BreadcrumbProps;

const Breadcrumb = forwardRef<HTMLElement, GZDBreadcrumbProps>((props, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Ant Design Breadcrumb v6 does not expose a ref. Keep a transparent DOM
  // anchor and expose the actual Breadcrumb root element instead of the anchor.
  useImperativeHandle(ref, () => {
    return (
      (containerRef.current?.firstElementChild as HTMLElement | null) ??
      containerRef.current!
    );
  }, []);

  return (
    <div ref={containerRef} style={{ display: "contents" }}>
      <AntdBreadcrumb {...props} />
    </div>
  );
});

Breadcrumb.displayName = "GZDBreadcrumb";

export default Breadcrumb;
