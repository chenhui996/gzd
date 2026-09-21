import { Slider as AntdSlider } from "antd";
import type { SliderBaseProps, SliderSemanticType } from "antd/es/slider";
import React, { forwardRef, useContext } from "react";
import { GZDConfigContext } from "../config-provider/context";
import "./style.less";

export type GZDSliderProps = React.ComponentPropsWithoutRef<typeof AntdSlider>;

type SliderRef = React.ElementRef<typeof AntdSlider>;
type SliderClassNames = GZDSliderProps["classNames"];
type SliderClassNamesObject = NonNullable<SliderSemanticType["classNames"]>;
type SliderClassNamesInfo = { props: SliderBaseProps };

const goldDarkSliderHandleClassName = "gzd-slider-gold-dark";

const mergeClassNames = (...classNames: Array<string | undefined>) =>
  classNames.filter(Boolean).join(" ") || undefined;

const withGoldDarkHandleClassName = (
  classNames: SliderClassNames,
): SliderClassNames => {
  if (typeof classNames === "function") {
    return (info: SliderClassNamesInfo) => {
      const resolvedClassNames = classNames(info);

      return {
        ...resolvedClassNames,
        handle: mergeClassNames(
          goldDarkSliderHandleClassName,
          resolvedClassNames?.handle,
        ),
      };
    };
  }

  return {
    ...classNames,
    handle: mergeClassNames(goldDarkSliderHandleClassName, classNames?.handle),
  } satisfies SliderClassNamesObject;
};

const Slider = forwardRef<SliderRef, GZDSliderProps>((props, ref) => {
  const { themeMode } = useContext(GZDConfigContext);
  const { classNames, ...restProps } = props;
  // gold-dark 的滑块 hover 样式挂在 antd v6 的 handle 语义节点上，并保留业务传入的 classNames。
  const mergedClassNames =
    themeMode === "gold-dark"
      ? withGoldDarkHandleClassName(classNames)
      : classNames;

  return (
    <AntdSlider
      ref={ref}
      {...restProps}
      classNames={mergedClassNames}
    />
  );
});

Slider.displayName = "GZDSlider";

export default Slider;
