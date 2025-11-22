import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { getD3Data, subscribe, unsubscribe } from "../console-monkey-patch";

export default function D3Graph() {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const width = container.clientWidth || 320;
        const height = 160;

        // Create SVG
        const svg = d3
            .select(container)
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        // Margin convention
        const margin = { top: 10, right: 10, bottom: 20, left: 30 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const g = svg
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const xAxisGroup = g
            .append("g")
            .attr("transform", `translate(0,${innerHeight})`);

        const yAxisGroup = g.append("g");

        const linePath = g
            .append("path")
            .attr("class", "d3-line")
            .attr("fill", "none")
            .attr("stroke", "currentColor")
            .attr("stroke-width", 1.5);

      
        function logToGain(logLine) {
            if (!logLine) return 0;
            const match = String(logLine).match(/gain:([0-9.]+)/);
            if (!match) return 0;

            let v = Number(match[1]);
            if (isNaN(v)) v = 0;

            if (v < 0) v = 0;
            if (v > 1) v = 1;

            return v;
        }

        function updateChart(rawArray) {
            if (!rawArray || rawArray.length === 0) return;

            const values = rawArray.map(logToGain);

            
            if (values.every(v => v === 0)) return;

         
            const xScale = d3.scaleLinear()
                .domain([0, values.length - 1])
                .range([0, innerWidth]);

         
            const yScale = d3.scaleLinear()
                .domain([0, 1])
                .range([innerHeight, 0]);  

            const line = d3.line()
                .x((d, i) => xScale(i))
                .y(d => yScale(d));

            // axes
            xAxisGroup.call(
                d3.axisBottom(xScale)
                    .ticks(5)
                    .tickFormat(() => "") // no x labels, just tick marks
            );

            yAxisGroup.call(
                d3.axisLeft(yScale)
                    .ticks(5)
            );

            // line
            linePath.datum(values).attr("d", line);
        }

        function handleEvent(evt) {
            updateChart(evt.detail || []);
        }

        
        subscribe("d3Data", handleEvent);

    
        updateChart(getD3Data());

    
        return () => {
            unsubscribe("d3Data", handleEvent);
            svg.remove();
        };
    }, []);

    return (
        <div className="mt-3">
            <div className="text-muted text-uppercase small mb-1">
                Live D3 graph
            </div>
            <div
                ref={containerRef}
                className="d3-graph border rounded-3 p-1"
            />
        </div>
    );
}
