function updateScatter(major){

    // haal de data op uit de global variabele dataset
    var data = dataset[major];

    // stel de scales in zodat deze hetzelfde blijven
    xScale.domain([0,400000]).nice();
    yScale.domain([0.000, 0.2]).nice();

  var bubble = scatterSvg.selectAll('.bubble')
    .data(data);

    // Haal overbodige bollethes weg
    bubble.exit().remove();

    // voeg nieuwe bolletjes toe en
    bubble.enter().append("circle")
    .attr('class', 'bubble')
    .attr('cx', function(d){return xScale(d.Total);})
    .attr('cy', function(d){ return yScale(d.Unemployment_rate); })
    .attr('r', function(d){ return radius(1) + 5; })
    .style('fill', function(d){ return color(d.Major); });

  // Animeer de bolletjes naar de juiste positie
   bubble.transition()
       .duration(750)
       .ease(d3.easeQuadOut)
       .attr('class', 'bubble')
       .attr('cx', function(d){return xScale(d.Total);})
       .attr('cy', function(d){ return yScale(d.Unemployment_rate); })
       .attr('r', function(d){ return radius(1) + 5; })
       .style('fill', function(d){ return color(d.Major); });

       // Geef alle bolletjes weer de juiste titel voor de hover
       var bubble = scatterSvg.selectAll('.bubble')
        .append('title')
         .attr('x', function(d){ return radius(1); })
         .text(function(d){
           return d.Major;
         });

}
