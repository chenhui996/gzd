export interface NoRowsOverlayProps {
  text?: string;
}

const NoRowsOverlay = ({ text = "暂无符合条件的数据" }: NoRowsOverlayProps) => {
  return (
    <div className="gz-table-no-rows-overlay" role="status">
      {text}
    </div>
  );
};

export default NoRowsOverlay;
