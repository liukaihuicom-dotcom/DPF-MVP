/* Vendored from iconsax-react-native Chart21; source license: MIT. */
import React, { Fragment } from 'react';
import Svg, { Path } from 'react-native-svg';

import type { LocalIconProps } from '../types';

type IconsaxVariant = 'Linear' | 'Bold';
type IconsaxColorProps = { color: string };

const Bold = function Bold(_ref: IconsaxColorProps) {
  var color = _ref.color;
  return React.createElement(Fragment, null, React.createElement(Path, {
    d: "M22 22H2c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h20c.41 0 .75.34.75.75s-.34.75-.75.75Z",
    fill: color
  }), React.createElement(Path, {
    d: "M9.75 4v18h4.5V4c0-1.1-.45-2-1.8-2h-.9c-1.35 0-1.8.9-1.8 2ZM3 10v12h4V10c0-1.1-.4-2-1.6-2h-.8C3.4 8 3 8.9 3 10ZM17 15v7h4v-7c0-1.1-.4-2-1.6-2h-.8c-1.2 0-1.6.9-1.6 2Z",
    fill: color
  }));
};

const Broken = function Broken(_ref2: IconsaxColorProps) {
  var color = _ref2.color;
  return React.createElement(Fragment, null, React.createElement(Path, {
    d: "M2 13.01V15c0 5 2 7 7 7h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9",
    stroke: color,
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), React.createElement(Path, {
    d: "M17.5 11.57v4.93a2 2 0 1 1-4 0v-9c0-1.1.9-2 2-2s2 .9 2 2M8.5 18.5c1.1 0 2-.9 2-2V13c0-1.1-.9-2-2-2s-2 .9-2 2v3.5a2 2 0 0 0 2 2Z",
    stroke: color,
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }));
};

const Bulk = function Bulk(_ref3: IconsaxColorProps) {
  var color = _ref3.color;
  return React.createElement(Fragment, null, React.createElement(Path, {
    d: "M22 22H2c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h20c.41 0 .75.34.75.75s-.34.75-.75.75Z",
    fill: color
  }), React.createElement(Path, {
    d: "M9.75 4v18h4.5V4c0-1.1-.45-2-1.8-2h-.9c-1.35 0-1.8.9-1.8 2Z",
    fill: color
  }), React.createElement(Path, {
    opacity: ".4",
    d: "M3 10v12h4V10c0-1.1-.4-2-1.6-2h-.8C3.4 8 3 8.9 3 10ZM17 15v7h4v-7c0-1.1-.4-2-1.6-2h-.8c-1.2 0-1.6.9-1.6 2Z",
    fill: color
  }));
};

const Linear = function Linear(_ref4: IconsaxColorProps) {
  var color = _ref4.color;
  return React.createElement(Fragment, null, React.createElement(Path, {
    d: "M7 10.74v3.2M12 9v6.68M17 10.74v3.2M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7Z",
    stroke: color,
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }));
};

const Outline = function Outline(_ref5: IconsaxColorProps) {
  var color = _ref5.color;
  return React.createElement(Fragment, null, React.createElement(Path, {
    d: "M21 22.75H3c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h18c.41 0 .75.34.75.75s-.34.75-.75.75ZM5.6 19.749H4c-.96 0-1.75-.79-1.75-1.75v-8.62c0-.96.79-1.75 1.75-1.75h1.6c.96 0 1.75.79 1.75 1.75v8.62c0 .96-.79 1.75-1.75 1.75ZM4 9.119c-.14 0-.25.11-.25.25v8.63c0 .14.11.25.25.25h1.6c.14 0 .25-.11.25-.25v-8.62c0-.14-.11-.25-.25-.25H4v-.01ZM12.8 19.751h-1.6c-.96 0-1.75-.79-1.75-1.75V6.191c0-.96.79-1.75 1.75-1.75h1.6c.96 0 1.75.79 1.75 1.75v11.81c0 .96-.79 1.75-1.75 1.75Zm-1.6-13.81c-.14 0-.25.11-.25.25v11.81c0 .14.11.25.25.25h1.6c.14 0 .25-.11.25-.25V6.191c0-.14-.11-.25-.25-.25h-1.6ZM20 19.75h-1.6c-.96 0-1.75-.79-1.75-1.75V3c0-.96.79-1.75 1.75-1.75H20c.96 0 1.75.79 1.75 1.75v15c0 .96-.79 1.75-1.75 1.75Zm-1.6-17c-.14 0-.25.11-.25.25v15c0 .14.11.25.25.25H20c.14 0 .25-.11.25-.25V3c0-.14-.11-.25-.25-.25h-1.6Z",
    fill: color
  }));
};

const TwoTone = function TwoTone(_ref6: IconsaxColorProps) {
  var color = _ref6.color;
  return React.createElement(Fragment, null, React.createElement(Path, {
    d: "M2 22h20",
    stroke: color,
    strokeWidth: "1.5",
    strokeMiterlimit: "10",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), React.createElement(Path, {
    d: "M9.75 4v18h4.5V4c0-1.1-.45-2-1.8-2h-.9c-1.35 0-1.8.9-1.8 2Z",
    stroke: color,
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), React.createElement(Path, {
    opacity: ".4",
    d: "M3 10v12h4V10c0-1.1-.4-2-1.6-2h-.8C3.4 8 3 8.9 3 10ZM17 15v7h4v-7c0-1.1-.4-2-1.6-2h-.8c-1.2 0-1.6.9-1.6 2Z",
    stroke: color,
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }));
};


function chooseVariant(variant: IconsaxVariant, color: string) {
  return variant === 'Bold' ? <Bold color={color} /> : <Linear color={color} />;
}

export function LocalIconsaxChart21Icon({ color = 'currentColor', height, size = 24, style, styleVariant = 'line', width }: LocalIconProps) {
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
