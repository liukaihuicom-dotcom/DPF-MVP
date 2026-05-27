/* Vendored from iconsax-react-native ArrowSwapHorizontal; source license: MIT. */
import React, { Fragment } from 'react';
import Svg, { G, Path } from 'react-native-svg';

import type { LocalIconProps } from '../types';

type IconsaxVariant = 'Linear' | 'Bold';
type IconsaxColorProps = { color: string };

const Bold = function Bold(_ref: IconsaxColorProps) {
  var color = _ref.color;
  return React.createElement(Fragment, null, React.createElement(Path, {
    fill: color,
    d: "M16.19 2H7.81C4.17 2 2 4.17 2 7.81v8.37C2 19.83 4.17 22 7.81 22h8.37c3.64 0 5.81-2.17 5.81-5.81V7.81C22 4.17 19.83 2 16.19 2zm1.5 12.05c-.04.09-.09.17-.16.24l-2.95 2.95c-.15.15-.34.22-.53.22s-.38-.07-.53-.22a.754.754 0 010-1.06l1.67-1.67H7c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h10c.1 0 .19.02.29.06.18.08.33.22.41.41.07.18.07.38-.01.57zM17 10.99H7c-.1 0-.19-.02-.29-.06a.782.782 0 01-.41-.41.707.707 0 010-.57c.05-.09.1-.17.17-.24l2.95-2.95c.29-.29.77-.29 1.06 0 .29.29.29.77 0 1.06L8.81 9.49H17c.41 0 .75.34.75.75s-.34.75-.75.75z"
  }));
};

const Broken = function Broken(_ref2: IconsaxColorProps) {
  var color = _ref2.color;
  return React.createElement(Fragment, null, React.createElement(Path, {
    stroke: color,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeMiterlimit: "10",
    strokeWidth: "1.5",
    d: "M3.5 9.01l5.01-5.02M13.01 9.01H3.5M20.5 9.01H17M20.5 14.99l-5.01 5.02M10.99 14.99h9.51M3.5 14.99H7"
  }));
};

const Bulk = function Bulk(_ref3: IconsaxColorProps) {
  var color = _ref3.color;
  return React.createElement(Fragment, null, React.createElement(Path, {
    fill: color,
    d: "M7.81 2h8.37C19.83 2 22 4.17 22 7.81v8.37c0 3.64-2.17 5.81-5.81 5.81H7.81C4.17 22 2 19.83 2 16.19V7.81C2 4.17 4.17 2 7.81 2z",
    opacity: ".4"
  }), React.createElement(Path, {
    fill: color,
    d: "M17.69 13.48a.782.782 0 00-.41-.41.717.717 0 00-.29-.06H7c-.41 0-.75.34-.75.75s.34.75.75.75h8.19l-1.67 1.67c-.29.29-.29.77 0 1.06.15.15.34.22.53.22s.38-.07.53-.22l2.95-2.95c.07-.07.12-.15.16-.24.08-.19.08-.39 0-.57zM6.31 10.52c.08.18.22.33.41.41.09.04.18.06.28.06h10c.41 0 .75-.34.75-.75s-.34-.75-.75-.75H8.81l1.67-1.67c.29-.29.29-.77 0-1.06a.754.754 0 00-1.06 0L6.47 9.71c-.07.07-.12.15-.16.24-.08.19-.08.39 0 .57z"
  }));
};

const Linear = function Linear(_ref4: IconsaxColorProps) {
  var color = _ref4.color;
  return React.createElement(Fragment, null, React.createElement(Path, {
    stroke: color,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeMiterlimit: "10",
    strokeWidth: "1.5",
    d: "M20.5 14.99l-5.01 5.02M3.5 14.99h17M3.5 9.01l5.01-5.02M20.5 9.01h-17"
  }));
};

const Outline = function Outline(_ref5: IconsaxColorProps) {
  var color = _ref5.color;
  return React.createElement(Fragment, null, React.createElement(Path, {
    fill: color,
    d: "M15.49 20.76c-.19 0-.38-.07-.53-.22a.754.754 0 010-1.06l5.01-5.01c.29-.29.77-.29 1.06 0 .29.29.29.77 0 1.06l-5.01 5.01c-.15.14-.34.22-.53.22z"
  }), React.createElement(Path, {
    fill: color,
    d: "M20.5 15.74h-17c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h17c.41 0 .75.34.75.75s-.34.75-.75.75zM3.5 9.76c-.19 0-.38-.07-.53-.22a.754.754 0 010-1.06l5.01-5.01c.29-.29.77-.29 1.06 0 .29.29.29.77 0 1.06L4.03 9.54c-.14.14-.34.22-.53.22z"
  }), React.createElement(Path, {
    fill: color,
    d: "M20.5 9.76h-17c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h17c.41 0 .75.34.75.75s-.34.75-.75.75z"
  }));
};

const TwoTone = function TwoTone(_ref6: IconsaxColorProps) {
  var color = _ref6.color;
  return React.createElement(Fragment, null, React.createElement(G, {
    opacity: ".4"
  }, React.createElement(Path, {
    stroke: color,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeMiterlimit: "10",
    strokeWidth: "1.5",
    d: "M20.5 14.99l-5.01 5.02M3.5 14.99h17"
  })), React.createElement(Path, {
    stroke: color,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeMiterlimit: "10",
    strokeWidth: "1.5",
    d: "M3.5 9.01l5.01-5.02M20.5 9.01h-17"
  }));
};


function chooseVariant(variant: IconsaxVariant, color: string) {
  return variant === 'Bold' ? <Bold color={color} /> : <Linear color={color} />;
}

export function LocalIconsaxArrowSwapHorizontalIcon({ color = 'currentColor', height, size = 24, style, styleVariant = 'line', width }: LocalIconProps) {
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
