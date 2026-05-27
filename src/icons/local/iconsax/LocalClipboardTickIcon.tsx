/* Vendored from iconsax-react-native ClipboardTick; source license: MIT. */
import React, { Fragment } from 'react';
import Svg, { Path } from 'react-native-svg';

import type { LocalIconProps } from '../types';

type IconsaxVariant = 'Linear' | 'Bold';
type IconsaxColorProps = { color: string };

const Bold = function Bold(_ref: IconsaxColorProps) {
  var color = _ref.color;
  return React.createElement(Fragment, null, React.createElement(Path, {
    d: "M14.35 2h-4.7c-1.04 0-1.89.84-1.89 1.88v.94c0 1.04.84 1.88 1.88 1.88h4.71c1.04 0 1.88-.84 1.88-1.88v-.94C16.24 2.84 15.39 2 14.35 2Z",
    fill: color
  }), React.createElement(Path, {
    d: "M17.24 4.82c0 1.59-1.3 2.89-2.89 2.89h-4.7c-1.59 0-2.89-1.3-2.89-2.89 0-.56-.6-.91-1.1-.65a4.472 4.472 0 0 0-2.37 3.95v9.41C3.29 19.99 5.3 22 7.76 22h8.48c2.46 0 4.47-2.01 4.47-4.47V8.12c0-1.71-.96-3.2-2.37-3.95-.5-.26-1.1.09-1.1.65Zm-1.9 7.91-4 4c-.15.15-.34.22-.53.22s-.38-.07-.53-.22l-1.5-1.5a.754.754 0 0 1 0-1.06c.29-.29.77-.29 1.06 0l.97.97 3.47-3.47c.29-.29.77-.29 1.06 0 .29.29.29.77 0 1.06Z",
    fill: color
  }));
};

const Broken = function Broken(_ref2: IconsaxColorProps) {
  var color = _ref2.color;
  return React.createElement(Fragment, null, React.createElement(Path, {
    d: "m9.31 14.7 1.5 1.5 4-4",
    stroke: color,
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), React.createElement(Path, {
    d: "M10.96 2H10C9 2 8 2 8 4s1 2 2 2h4c2 0 2-1 2-2 0-2-1-2-2-2M3 10c0-4.56 1.67-5.8 5-5.98",
    stroke: color,
    strokeWidth: "1.5",
    strokeMiterlimit: "10",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), React.createElement(Path, {
    d: "M16 4.02c3.33.18 5 1.41 5 5.98v6c0 4-1 6-6 6H9c-5 0-6-2-6-6v-2.09",
    stroke: color,
    strokeWidth: "1.5",
    strokeMiterlimit: "10",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }));
};

const Bulk = function Bulk(_ref3: IconsaxColorProps) {
  var color = _ref3.color;
  return React.createElement(Fragment, null, React.createElement(Path, {
    opacity: ".4",
    d: "M16.24 3.648H7.76c-2.47 0-4.47 2.01-4.47 4.47v9.41c0 2.46 2.01 4.47 4.47 4.47h8.47c2.47 0 4.47-2.01 4.47-4.47v-9.41c.01-2.47-2-4.47-4.46-4.47Z",
    fill: color
  }), React.createElement(Path, {
    d: "M14.35 2h-4.7c-1.04 0-1.89.84-1.89 1.88v.94c0 1.04.84 1.88 1.88 1.88h4.71c1.04 0 1.88-.84 1.88-1.88v-.94C16.24 2.84 15.39 2 14.35 2ZM10.81 16.95c-.19 0-.38-.07-.53-.22l-1.5-1.5a.754.754 0 0 1 0-1.06c.29-.29.77-.29 1.06 0l.97.97 3.47-3.47c.29-.29.77-.29 1.06 0 .29.29.29.77 0 1.06l-4 4c-.14.15-.34.22-.53.22Z",
    fill: color
  }));
};

const Linear = function Linear(_ref4: IconsaxColorProps) {
  var color = _ref4.color;
  return React.createElement(Fragment, null, React.createElement(Path, {
    d: "m9.31 14.7 1.5 1.5 4-4",
    stroke: color,
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), React.createElement(Path, {
    d: "M10 6h4c2 0 2-1 2-2 0-2-1-2-2-2h-4C9 2 8 2 8 4s1 2 2 2Z",
    stroke: color,
    strokeWidth: "1.5",
    strokeMiterlimit: "10",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), React.createElement(Path, {
    d: "M16 4.02c3.33.18 5 1.41 5 5.98v6c0 4-1 6-6 6H9c-5 0-6-2-6-6v-6c0-4.56 1.67-5.8 5-5.98",
    stroke: color,
    strokeWidth: "1.5",
    strokeMiterlimit: "10",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }));
};

const Outline = function Outline(_ref5: IconsaxColorProps) {
  var color = _ref5.color;
  return React.createElement(Fragment, null, React.createElement(Path, {
    d: "M10.81 16.95c-.19 0-.38-.07-.53-.22l-1.5-1.5a.754.754 0 0 1 0-1.06c.29-.29.77-.29 1.06 0l.97.97 3.47-3.47c.29-.29.77-.29 1.06 0 .29.29.29.77 0 1.06l-4 4c-.14.15-.34.22-.53.22ZM14 6.75h-4c-.96 0-2.75 0-2.75-2.75S9.04 1.25 10 1.25h4c.96 0 2.75 0 2.75 2.75 0 .96 0 2.75-2.75 2.75Zm-4-4c-.99 0-1.25 0-1.25 1.25S9.01 5.25 10 5.25h4c1.25 0 1.25-.26 1.25-1.25 0-1.25-.26-1.25-1.25-1.25h-4Z",
    fill: color
  }), React.createElement(Path, {
    d: "M15 22.75H9c-5.62 0-6.75-2.58-6.75-6.75v-6c0-4.56 1.65-6.51 5.71-6.72.41-.02.77.29.79.71.02.42-.3.76-.71.78C5.2 4.93 3.75 5.78 3.75 10v6c0 3.7.73 5.25 5.25 5.25h6c4.52 0 5.25-1.55 5.25-5.25v-6c0-4.22-1.45-5.07-4.29-5.23a.75.75 0 1 1 .08-1.5c4.06.22 5.71 2.17 5.71 6.72v6c0 4.18-1.13 6.76-6.75 6.76Z",
    fill: color
  }));
};

const TwoTone = function TwoTone(_ref6: IconsaxColorProps) {
  var color = _ref6.color;
  return React.createElement(Fragment, null, React.createElement(Path, {
    opacity: ".4",
    d: "m9.31 14.7 1.5 1.5 4-4",
    stroke: color,
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), React.createElement(Path, {
    d: "M10 6h4c2 0 2-1 2-2 0-2-1-2-2-2h-4C9 2 8 2 8 4s1 2 2 2Z",
    stroke: color,
    strokeWidth: "1.5",
    strokeMiterlimit: "10",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), React.createElement(Path, {
    d: "M16 4.02c3.33.18 5 1.41 5 5.98v6c0 4-1 6-6 6H9c-5 0-6-2-6-6v-6c0-4.56 1.67-5.8 5-5.98",
    stroke: color,
    strokeWidth: "1.5",
    strokeMiterlimit: "10",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }));
};


function chooseVariant(variant: IconsaxVariant, color: string) {
  return variant === 'Bold' ? <Bold color={color} /> : <Linear color={color} />;
}

export function LocalIconsaxClipboardTickIcon({ color = 'currentColor', height, size = 24, style, styleVariant = 'line', width }: LocalIconProps) {
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
