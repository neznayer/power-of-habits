"use client";
import { type ScaleLinear, scaleLinear } from "d3-scale";
import { type Selection, select } from "d3-selection";
import { type Arc, type DefaultArcObject, type Pie, arc, pie } from "d3-shape";
import { type PropsWithChildren, useEffect, useRef, useState } from "react";

type TConstants = {
  scale: ScaleLinear<number, number, null>;
  arcGen: Arc<SVGPathElement, DefaultArcObject>;
  g: Selection<SVGGElement, null, null, unknown>;
  pieGenerator: Pie<unknown, TDatum>;
};

type TDatum = {
  name: string;
  value: number;
};

interface TProps extends PropsWithChildren {
  progress: number;
  color: string;
  size: number;
}

export default function DoughnutChart({
  progress,
  color,
  size,
  children,
}: TProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [constants, setConstants] = useState({} as TConstants);

  useEffect(() => {
    if (svgRef.current) {
      const svg = select<SVGSVGElement, null>(svgRef.current);
      const R = size / 2;
      const scale = scaleLinear()
        .domain([0, 1])
        .range([0, Math.PI * 2]);
      const arcGen: Arc<SVGPathElement, DefaultArcObject> = arc()
        .innerRadius(R * 0.7)
        .outerRadius(R * 0.9);

      const g = svg
        .append("g")
        .attr("transform", `translate(${size / 2}, ${size / 2})`);

      const pieGenerator = pie<TDatum>()
        .value((d) => d.value)
        .sort(null);

      setConstants({
        scale,
        arcGen,
        g,
        pieGenerator,
      });
    }
  }, [size]);

  useEffect(() => {
    if (constants.arcGen) {
      const data: TDatum[] = [
        { name: "progress", value: progress },
        { name: "remainder", value: 1 - progress },
      ];

      constants.g
        .selectAll("path")
        .data(constants.pieGenerator(data))
        .join("path")
        .attr("d", constants.arcGen)
        .attr("fill", color)
        .attr("opacity", (d) => {
          if (d.data.name === "progress") return 0.8;
          return 0.1;
        });
    }
  }, [progress, constants, color]);

  return (
    <div className=" relative flex items-center justify-center">
      <svg
        width={size}
        height={size}
        ref={svgRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mix-blend-multiply"
      ></svg>
      {children}
    </div>
  );
}
