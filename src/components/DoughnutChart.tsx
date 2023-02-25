"use client";
import { type ScaleLinear, scaleLinear } from "d3-scale";
import { select, type Selection } from "d3-selection";
import { type Arc, arc, type DefaultArcObject, pie, type Pie } from "d3-shape";
import { useEffect, useRef, useState } from "react";

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

export default function DoughnutChart({
  progress,
  color,
}: {
  progress: number;
  color: string;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [constants, setConstants] = useState({} as TConstants);

  useEffect(() => {
    if (svgRef.current) {
      console.log("useeffect");
      const svg = select<SVGSVGElement, null>(svgRef.current);
      const width = +svg.attr("width");
      const height = +svg.attr("height");
      const R = Math.min(width, height) / 2;
      const scale = scaleLinear()
        .domain([0, 1])
        .range([0, Math.PI * 2]);
      const arcGen: Arc<SVGPathElement, DefaultArcObject> = arc()
        .innerRadius(R * 0.5)
        .outerRadius(R * 0.9);

      const g = svg
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

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
  }, []);

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
          if (d.data.name === "progress") return 1;
          return 0.1;
        })
        .attr("");
    }
  }, [progress, constants, color]);

  return <svg width="30" height="30" ref={svgRef}></svg>;
}
