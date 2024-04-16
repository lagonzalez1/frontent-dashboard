import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Container } from "@mui/material";



export default function DonutGraph({data}) {


    const height = 400;
    const width = 400;
    
    const svgRef = useRef();


    useEffect(() => {
        console.log(data)
        if (data === null || data === undefined) { return; }
        const appointments = data.appointments;
        const waitlist = data.waitlist;

        if (appointments.length === 0) { return; }
        if (waitlist.length === 0) { return; }
        const height = Math.min(width, 500);
        const radius = Math.min(width, height) / 2;

        const arc = d3.arc()
        .innerRadius(radius * 0.67)
        .outerRadius(radius - 1);


        // Inner radius
        const innerArc = d3.arc()
        .innerRadius(radius/4)
        .outerRadius(radius/2);


        const pie = d3.pie()
        .padAngle(1 / radius)
        .sort(null)
        .value(d => d.value);


        const color = d3.scaleOrdinal()
        .domain(appointments.map(d => d.day))
        .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), appointments.length).reverse());
        var svg = d3.select(svgRef.current)
        .append('svg')
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto;");
        

        svg.append("g")
        .selectAll()
        .data(pie(appointments))
        .join("path")
        .attr("fill", d => color(d.data.day))
        .attr("d", arc)
        .append("title")
        .text(d => `${d.data.value}`)


        svg.append("g")
        .attr("font-family", "Poppins")
        .attr("font-size", 12)
        .attr("text-anchor", "middle")
        .selectAll()
        .data(pie(appointments))
        .join("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .call(text => text.append("tspan")
        .attr("y", "-0.4em")
        .attr("font-weight", "bold")
        .text(d => d.data.value > 0 ? d.data.day: ''))
        .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
        .attr("x", 0)
        .attr("y", "0.7em")
        .attr("fill-opacity", 0.7)
        .text(d => d.data.value));



        // Inner arc

        const colorInner = d3.scaleOrdinal()
        .domain(waitlist.map(d => d.day))
        .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), waitlist.length).reverse());

        var innerArcs = svg.append("g")
        .selectAll()
        .data(pie(waitlist))
        .join("path")
        .attr("fill", d => colorInner(d.data.day))
        .attr("d", innerArc)
        .append("title")
        .text(d => `${d.data.value === 0 ? null: d.data.value}`);

        svg
        .append("g")
        .attr("font-family", "Poppins")
        .attr("font-size", 12)
        .attr("text-anchor", "middle")
        .selectAll()
        .data(pie(waitlist))
        .join("text")
        .attr("transform", d => `translate(${innerArc.centroid(d)})`)
        .call(text => text.append("tspan")
            .attr("y", "-0.4em")
            .attr("font-weight", "bold")
            .text(d => d.data.value > 0 ? d.data.day: ''))
        .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
            .attr("x", 0)
            .attr("y", "0.7em")
            .attr("fill-opacity", 0.7)
            .text(d => d.data.value));


        
    }, [data])

    return (
        <Container sx={{ pt: 2, width: width, height: height}}>
            <svg ref={svgRef} width={width} height={height}>
            </svg>
        </Container>
    )
}