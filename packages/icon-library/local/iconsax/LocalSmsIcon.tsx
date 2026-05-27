/* Vendored from iconsax-react-native Sms; source license: MIT. */
import React, { Fragment } from 'react';
import Svg, { Path } from 'react-native-svg';

import type { LocalIconProps } from '../types';

type IconsaxVariant = 'Linear' | 'Bold';
type IconsaxColorProps = { color: string };

const Bold = function Bold(_ref: IconsaxColorProps) {
  var color = _ref.color;
  return React.createElement(Fragment, null, React.createElement(Path, {
    d: "M17 3.5H7c-3 0-5 1.5-5 5v7c0 3.5 2 5 5 5h10c3 0 5-1.5 5-5v-7c0-3.5-2-5-5-5Zm.47 6.09-3.13 2.5c-.66.53-1.5.79-2.34.79-.84 0-1.69-.26-2.34-.79l-3.13-2.5a.77.77 0 0 1-.12-1.06c.26-.32.73-.38 1.05-.12l3.13 2.5c.76.61 2.05.61 2.81 0l3.13-2.5c.32-.26.8-.21 1.05.12.26.32.21.8-.11 1.06Z",
    fill: color
  }));
};

const Broken = function Broken(_ref2: IconsaxColorProps) {
  var color = _ref2.color;
  return React.createElement(Fragment, null, React.createElement(Path, {
    d: "M22 12.98v2.52c0 3.5-2 5-5 5H7c-3 0-5-1.5-5-5v-7c0-3.5 2-5 5-5h10c3 0 5 1.5 5 5",
    stroke: color,
    strokeWidth: "1.5",
    strokeMiterlimit: "10",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), React.createElement(Path, {
    d: "m17 9-3.13 2.5c-1.03.82-2.72.82-3.75 0L7 9",
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
    d: "M17 20.5H7c-3 0-5-1.5-5-5v-7c0-3.5 2-5 5-5h10c3 0 5 1.5 5 5v7c0 3.5-2 5-5 5Z",
    fill: color
  }), React.createElement(Path, {
    d: "M11.999 12.872c-.84 0-1.69-.26-2.34-.79l-3.13-2.5a.748.748 0 0 1 .93-1.17l3.13 2.5c.76.61 2.05.61 2.81 0l3.13-2.5c.32-.26.8-.21 1.05.12.26.32.21.8-.12 1.05l-3.13 2.5c-.64.53-1.49.79-2.33.79Z",
    fill: color
  }));
};

const Linear = function Linear(_ref4: IconsaxColorProps) {
  var color = _ref4.color;
  return React.createElement(Fragment, null, React.createElement(Path, {
    d: "M17 20.5H7c-3 0-5-1.5-5-5v-7c0-3.5 2-5 5-5h10c3 0 5 1.5 5 5v7c0 3.5-2 5-5 5Z",
    stroke: color,
    strokeWidth: "1.5",
    strokeMiterlimit: "10",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), React.createElement(Path, {
    d: "m17 9-3.13 2.5c-1.03.82-2.72.82-3.75 0L7 9",
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
    d: "M17 21.25H7c-3.65 0-5.75-2.1-5.75-5.75v-7c0-3.65 2.1-5.75 5.75-5.75h10c3.65 0 5.75 2.1 5.75 5.75v7c0 3.65-2.1 5.75-5.75 5.75Zm-10-17c-2.86 0-4.25 1.39-4.25 4.25v7c0 2.86 1.39 4.25 4.25 4.25h10c2.86 0 4.25-1.39 4.25-4.25v-7c0-2.86-1.39-4.25-4.25-4.25H7Z",
    fill: color
  }), React.createElement(Path, {
    d: "M11.999 12.868c-.84 0-1.69-.26-2.34-.79l-3.13-2.5a.748.748 0 0 1 .93-1.17l3.13 2.5c.76.61 2.05.61 2.81 0l3.13-2.5c.32-.26.8-.21 1.05.12.26.32.21.8-.12 1.05l-3.13 2.5c-.64.53-1.49.79-2.33.79Z",
    fill: color
  }));
};

const TwoTone = function TwoTone(_ref6: IconsaxColorProps) {
  var color = _ref6.color;
  return React.createElement(Fragment, null, React.createElement(Path, {
    d: "M17 20.5H7c-3 0-5-1.5-5-5v-7c0-3.5 2-5 5-5h10c3 0 5 1.5 5 5v7c0 3.5-2 5-5 5Z",
    stroke: color,
    strokeWidth: "1.5",
    strokeMiterlimit: "10",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), React.createElement(Path, {
    opacity: ".4",
    d: "m17 9-3.13 2.5c-1.03.82-2.72.82-3.75 0L7 9",
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

export function LocalIconsaxSmsIcon({ color = 'currentColor', height, size = 24, style, styleVariant = 'line', width }: LocalIconProps) {
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
