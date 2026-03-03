import React from 'react';
import Svg, { Path, Rect, Defs, ClipPath } from 'react-native-svg';
import { COLORS } from '../config/theme';

export default function WaterDrop({ size = 60, fill = 0, color = COLORS.teal }) {
  const height = size * 1.3;
  const waterY = 78 - 70 * fill;

  return (
    <Svg width={size} height={height} viewBox="0 0 60 78" fill="none">
      <Defs>
        <ClipPath id="drop-clip">
          <Path d="M30 4C30 4 4 35 4 52C4 66.4 15.6 74 30 74C44.4 74 56 66.4 56 52C56 35 30 4 30 4Z" />
        </ClipPath>
      </Defs>
      <Path
        d="M30 4C30 4 4 35 4 52C4 66.4 15.6 74 30 74C44.4 74 56 66.4 56 52C56 35 30 4 30 4Z"
        fill="rgba(126,200,200,0.12)"
        stroke={color}
        strokeWidth={2}
      />
      <Rect
        clipPath="url(#drop-clip)"
        x={0}
        y={waterY}
        width={60}
        height={78}
        fill={color}
        opacity={0.35}
      />
      <Rect
        clipPath="url(#drop-clip)"
        x={-5}
        y={waterY + 4}
        width={70}
        height={78}
        fill={color}
        opacity={0.2}
      />
    </Svg>
  );
}
