import Tag from "../../../../components/tag";
import { type MultipleGridRowKey } from "../constants";
import { isNegative } from "../utils/formatter";
import styles from "../style.module.less";

export function ResultValue(props: { value: string; rawValue?: string | null }) {
  return (
    <span className={isNegative(props.rawValue) ? styles.negativeValue : undefined}>
      {props.value}
    </span>
  );
}

export function ContractValue(props: { field: MultipleGridRowKey; value: string }) {
  if (props.field === "direction") {
    return props.value ?
      <Tag variant="outlined" color={props.value === "买入" ? "gold" : "green"}>
        {props.value}
      </Tag> : "-"
    ;
  }
  return <span>{props.value}</span>;
}
