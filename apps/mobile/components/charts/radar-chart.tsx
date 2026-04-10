import { View, Text, Dimensions } from 'react-native';
import Svg, { Polygon, Line, Text as SvgText, Circle } from 'react-native-svg';

interface RadarDataPoint {
  label: string;
  value: number;
  max: number;
}

interface RadarChartProps {
  data: RadarDataPoint[];
  size?: number;
  fillColor?: string;
  strokeColor?: string;
}

const GRID_LEVELS = [0.25, 0.5, 0.75, 1.0];
const LABEL_PADDING = 28;

function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  index: number,
  total: number,
): { x: number; y: number } {
  const angle = (2 * Math.PI * index) / total - Math.PI / 2;
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  };
}

export function RadarChart({
  data,
  size: sizeProp,
  fillColor = 'rgba(139, 92, 246, 0.3)',
  strokeColor = '#A855F7',
}: RadarChartProps) {
  const screenWidth = Dimensions.get('window').width;
  const size = sizeProp ?? screenWidth - 64;
  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = size / 2 - LABEL_PADDING - 12;
  const n = data.length;

  // Grid polygons
  const gridPolygons = GRID_LEVELS.map((level) => {
    const points = Array.from({ length: n }, (_, i) => {
      const p = polarToCartesian(cx, cy, maxRadius * level, i, n);
      return `${p.x},${p.y}`;
    }).join(' ');
    return points;
  });

  // Axis lines
  const axisLines = Array.from({ length: n }, (_, i) =>
    polarToCartesian(cx, cy, maxRadius, i, n),
  );

  // Data polygon
  const dataPoints = data.map((d, i) => {
    const ratio = d.max > 0 ? d.value / d.max : 0;
    const clamped = Math.min(Math.max(ratio, 0), 1);
    const p = polarToCartesian(cx, cy, maxRadius * clamped, i, n);
    return `${p.x},${p.y}`;
  }).join(' ');

  // Label positions
  const labels = data.map((d, i) => {
    const p = polarToCartesian(cx, cy, maxRadius + LABEL_PADDING, i, n);
    return { ...p, label: d.label };
  });

  return (
    <View className="items-center">
      <Svg width={size} height={size}>
        {/* Grid polygons */}
        {gridPolygons.map((points, idx) => (
          <Polygon
            key={`grid-${idx}`}
            points={points}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={1}
          />
        ))}

        {/* Axis lines */}
        {axisLines.map((p, idx) => (
          <Line
            key={`axis-${idx}`}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={1}
          />
        ))}

        {/* Data polygon */}
        <Polygon
          points={dataPoints}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={2}
        />

        {/* Data points */}
        {data.map((d, i) => {
          const ratio = d.max > 0 ? d.value / d.max : 0;
          const clamped = Math.min(Math.max(ratio, 0), 1);
          const p = polarToCartesian(cx, cy, maxRadius * clamped, i, n);
          return (
            <Circle
              key={`dot-${i}`}
              cx={p.x}
              cy={p.y}
              r={4}
              fill={strokeColor}
            />
          );
        })}

        {/* Labels */}
        {labels.map((l, idx) => (
          <SvgText
            key={`label-${idx}`}
            x={l.x}
            y={l.y}
            fill="rgba(255,255,255,0.7)"
            fontSize={10}
            fontWeight="600"
            textAnchor="middle"
            alignmentBaseline="central"
          >
            {l.label}
          </SvgText>
        ))}
      </Svg>
    </View>
  );
}
