/* Vendored from iconsax-react-native Keyboard; source license: MIT. */
import React, { Fragment } from 'react';
import Svg, { Path } from 'react-native-svg';

import type { LocalIconProps } from '../types';

type IconsaxVariant = 'Linear' | 'Bold';
type IconsaxColorProps = { color: string };

const Bold = function Bold(_ref: IconsaxColorProps) {
  var color = _ref.color;
  return React.createElement(Fragment, null, React.createElement(Path, {
    d: "M18.27 3.35c-.47-.07-1.01-.1-1.77-.1h-9c-.75 0-1.3.03-1.74.09C2.41 3.71 1.75 5.7 1.75 9v6c0 3.3.66 5.29 3.98 5.65.47.07 1.01.1 1.77.1h9c.75 0 1.3-.03 1.74-.09 3.35-.37 4.01-2.35 4.01-5.66V9c0-3.3-.66-5.29-3.98-5.65ZM10.09 9c.56 0 1.01.45 1.01 1s-.45 1-1 1-1-.45-1-1 .44-1 .99-1Zm-3 0c.57 0 1.01.45 1.01 1s-.45 1-1 1-1-.45-1-1 .44-1 .99-1ZM17 16.25H7.02c-.41 0-.76-.34-.76-.75s.33-.75.74-.75h10c.41 0 .75.34.75.75s-.34.75-.75.75Zm0-5.5h-3.5c-.41 0-.75-.34-.75-.75s.34-.75.75-.75H17c.41 0 .75.34.75.75s-.34.75-.75.75Z",
    fill: color
  }));
};

const Broken = function Broken(_ref2: IconsaxColorProps) {
  var color = _ref2.color;
  return React.createElement(Fragment, null, React.createElement(Path, {
    d: "M2.5 9c0-3.38.71-4.62 3.34-4.91C6.33 4.02 6.88 4 7.5 4h9c.62 0 1.17.02 1.66.09 2.63.29 3.34 1.53 3.34 4.91v6c0 3.38-.71 4.62-3.34 4.91-.49.07-1.04.09-1.66.09h-9c-.62 0-1.17-.02-1.66-.09C3.21 19.62 2.5 18.38 2.5 15v-2.08M13.5 10H17M7 15.5h10",
    stroke: color,
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), React.createElement(Path, {
    d: "M10.094 10h.01M7.094 10h.01",
    stroke: color,
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }));
};

const Bulk = function Bulk(_ref3: IconsaxColorProps) {
  var color = _ref3.color;
  return React.createElement(Fragment, null, React.createElement(Path, {
    opacity: ".4",
    d: "M18.27 3.35c-.47-.07-1.01-.1-1.77-.1h-9c-.75 0-1.3.03-1.74.09C2.41 3.71 1.75 5.7 1.75 9v6c0 3.3.66 5.29 3.98 5.65.47.07 1.01.1 1.77.1h9c.75 0 1.3-.03 1.74-.09 3.35-.37 4.01-2.35 4.01-5.66V9c0-3.3-.66-5.29-3.98-5.65Z",
    fill: color
  }), React.createElement(Path, {
    d: "M17 10.75h-3.5c-.41 0-.75-.34-.75-.75s.34-.75.75-.75H17c.41 0 .75.34.75.75s-.34.75-.75.75ZM10.1 11c-.55 0-1-.45-1-1s.44-1 1-1h.01c.55 0 1 .45 1 1s-.45 1-1.01 1ZM7.1 11c-.55 0-1-.45-1-1s.44-1 1-1c.55 0 1 .45 1 1s-.44 1-1 1ZM17 16.25H7.02c-.41 0-.76-.34-.76-.75s.33-.75.74-.75h10c.41 0 .75.34.75.75s-.34.75-.75.75Z",
    fill: color
  }));
};

const Linear = function Linear(_ref4: IconsaxColorProps) {
  var color = _ref4.color;
  return React.createElement(Fragment, null, React.createElement(Path, {
    d: "M7.5 4h9c.62 0 1.17.02 1.66.09 2.63.29 3.34 1.53 3.34 4.91v6c0 3.38-.71 4.62-3.34 4.91-.49.07-1.04.09-1.66.09h-9c-.62 0-1.17-.02-1.66-.09C3.21 19.62 2.5 18.38 2.5 15V9c0-3.38.71-4.62 3.34-4.91C6.33 4.02 6.88 4 7.5 4ZM13.5 10H17M7 15.5h10",
    stroke: color,
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), React.createElement(Path, {
    d: "M10.095 10h.009M7.095 10h.009",
    stroke: color,
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }));
};

const Outline = function Outline(_ref5: IconsaxColorProps) {
  var color = _ref5.color;
  return React.createElement(Fragment, null, React.createElement(Path, {
    d: "M16.5 20.75h-9c-.75 0-1.3-.03-1.77-.1-3.32-.36-3.98-2.35-3.98-5.65V9c0-3.3.66-5.29 4.01-5.66.44-.06.99-.09 1.74-.09h9c.75 0 1.3.03 1.77.1 3.32.36 3.98 2.35 3.98 5.65v6c0 3.3-.66 5.29-4.01 5.66-.44.06-.99.09-1.74.09Zm-9-16c-.68 0-1.16.03-1.55.08-2.03.23-2.7.86-2.7 4.17v6c0 3.31.67 3.94 2.67 4.17.42.06.9.08 1.58.08h9c.68 0 1.16-.03 1.55-.08 2.03-.22 2.7-.86 2.7-4.17V9c0-3.31-.67-3.94-2.67-4.17-.42-.06-.9-.08-1.58-.08h-9Z",
    fill: color
  }), React.createElement(Path, {
    d: "M17 10.75h-3.5c-.41 0-.75-.34-.75-.75s.34-.75.75-.75H17c.41 0 .75.34.75.75s-.34.75-.75.75ZM10.1 11c-.55 0-1-.45-1-1s.44-1 1-1h.01c.55 0 1 .45 1 1s-.45 1-1.01 1ZM7.1 11c-.55 0-1-.45-1-1s.44-1 1-1c.55 0 1 .45 1 1s-.44 1-1 1ZM17 16.25H7.02c-.41 0-.76-.34-.76-.75s.33-.75.74-.75h10c.41 0 .75.34.75.75s-.34.75-.75.75Z",
    fill: color
  }));
};

const TwoTone = function TwoTone(_ref6: IconsaxColorProps) {
  var color = _ref6.color;
  return React.createElement(Fragment, null, React.createElement(Path, {
    d: "M7.5 4h9c.62 0 1.17.02 1.66.09 2.63.29 3.34 1.53 3.34 4.91v6c0 3.38-.71 4.62-3.34 4.91-.49.07-1.04.09-1.66.09h-9c-.62 0-1.17-.02-1.66-.09C3.21 19.62 2.5 18.38 2.5 15V9c0-3.38.71-4.62 3.34-4.91C6.33 4.02 6.88 4 7.5 4Z",
    stroke: color,
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), React.createElement(Path, {
    opacity: ".4",
    d: "M13.5 10H17M7 15.5h10",
    stroke: color,
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), React.createElement(Path, {
    opacity: ".4",
    d: "M10.094 10h.01M7.094 10h.01",
    stroke: color,
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }));
};


function chooseVariant(variant: IconsaxVariant, color: string) {
  return variant === 'Bold' ? <Bold color={color} /> : <Linear color={color} />;
}

export function LocalIconsaxKeyboardIcon({ color = 'currentColor', height, size = 24, style, styleVariant = 'line', width }: LocalIconProps) {
  const resolvedSize = size;
  const resolvedWidth = width ?? resolvedSize;
  const resolvedHeight = height ?? resolvedSize;
  const variant: IconsaxVariant = styleVariant === 'fill' ? 'Bold' : 'Linear';

  return (
    <Svg fill="none" height={resolvedHeight} style={style} viewBox="0 0 24 24" width={resolvedWidth}>
      {chooseVariant(variant, color)}
    </Svg>
  );
}
