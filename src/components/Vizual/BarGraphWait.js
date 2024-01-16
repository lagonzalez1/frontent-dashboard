import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Box, Container } from "@mui/material";



export default function BarGraphWait({data}) {

    
    const height = 500;
    const width = 650;

    const marginTop = 30;
    const marginRight = 0;
    const marginBottom = 30;
    const marginLeft = 40;
    const svgRef = useRef();

    useEffect(() => {
        if (data === undefined || data === null) { return; }
        const waitlist = data.waitlist;
        var svg = d3.select(svgRef.current)
        .append('svg')
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto;");

        // X axis
        var x = d3.scaleBand()
        .range([marginLeft, width - marginRight])
        .domain(waitlist.map(function (d) {return d.day}))
        .padding(0.2);
        // END X

         

        // Y axis
        var y = d3.scaleLinear()
        .domain([0, d3.max(waitlist, (d) => d.value)])
        .range([height - marginBottom, marginTop])
        

        // X axis labels
        svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0))
        .attr("font-family", "Poppins")
        .attr("font-size", 12)

        // Y axis labels
        svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y).tickFormat((y) => (y)))
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
          .attr("x", -marginLeft)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("font-family", "Poppins")
          .attr("font-size", 13)
          .attr("text-anchor", "start")
          .text("↑ Totals (Waitlist)"));

        const colorScale = d3.scaleLinear()
        .domain([0, d3.max(waitlist, d => d.value)])
        .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), waitlist.length).reverse());


        // Bars
        svg.append("g")
        .selectAll()
        .data(waitlist)
        .join("rect")
        .attr("x", (d) => x(d.day))
        .attr("y", (d) => y(d.value))
        .attr("height", (d) => y(0) - y(d.value))
        .attr("width", x.bandwidth())
        .attr("fill", d => colorScale(d.value));



    }, [data])

    return (
        <Box sx={{ height: height, width: width, display: 'flex', justifyContent: 'start'}}>
            <svg ref={svgRef} width={width} height={height} ></svg>
        </Box>
    )
}