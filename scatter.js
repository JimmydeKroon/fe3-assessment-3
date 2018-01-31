  // dataset object waarin de data uit de csv komt
  var dataset = {};

  // sla de margins op
  var scatterMargin = {top: 30, right: 50, bottom: 40, left:40};
  var scatterWidth = 600 - scatterMargin.left - scatterMargin.right;
  var scatterHeight = 800 - scatterMargin.top - scatterMargin.bottom;

    // selecteer id scatter en stel de margins in
    let scatterSvg = d3.select('#scatter')
    .append('svg')
    .attr('width', scatterWidth + scatterMargin.left + scatterMargin.right)
    .attr('height', scatterHeight + scatterMargin.top + scatterMargin.bottom)
  .append('g')
    .attr('transform', 'translate(' + scatterMargin.left + ',' + scatterMargin.top + ')');

    // maak de x-as aan en stel de range in
    var xScale = d3.scaleLinear()
      .range([0, scatterWidth]);

    // maak de y-as aan en stel de range in
    var yScale = d3.scaleLinear()
      .range([scatterHeight, 0]);

    var radius = d3.scaleSqrt()
      .range([2,5]);

    // maak de x-as aan met bovenstaande xScale
    var xAxis = d3.axisBottom()
      .scale(xScale);

    // maak de y-as aan met bovenstaande yScale
    var yAxis = d3.axisLeft()
      .scale(yScale);

    // geef de kleuren mee voor de bolletjes in de scatterplot
    var color = d3.scaleOrdinal(d3.schemeCategory20);

function drawScatter(major){

  d3.csv('data2.csv', function(error, data){

    // kijk of major_category al bestaat in dataset
    // zo ja, voeg de data toe
    // zo niet, maak een nieuwe aan

    data.forEach(function(d){
         if(d.Major_category in dataset){
           dataset[d.Major_category].push(d);
       }else{
           dataset[d.Major_category] = [d];
           console.log(d);
       }
    });

    // stop de informatie van dataset in data
    data=dataset[major];
    //console.log(data);

    // zet de scale van de xas van 0 tot 400000 studenten
    xScale.domain([0,400000]).nice();

    // zet de scale van de y as van 0 tot 20% Unemployed
    yScale.domain([0.000, 0.2]).nice();

    radius.domain(d3.extent(data, function(d){
      return 1;
    })).nice();

    scatterSvg.append('g')
      .attr('transform', 'translate(0,' + scatterHeight + ')')
      .attr('class', 'x axis')
      .call(xAxis);

    scatterSvg.append('g')
      .attr('transform', 'translate(0,0)')
      .attr('class', 'y axis')
      .call(yAxis);

    // geef de data door aan de bolletjes en geef ze een groote en positie aan de hand van data
    var bubble = scatterSvg.selectAll('.bubble')
      .data(data)
      .enter().append('circle')
      .attr('class', 'bubble')
      .attr('cx', function(d){return xScale(d.Total);})
      .attr('cy', function(d){ return yScale(d.Unemployment_rate); })
      .attr('r', function(d){ return radius(1) + 5; })
      .style('fill', function(d){ return color(d.Major); });

    // voeg een titel aan de bolletjes toe
    bubble.append('title')
      .attr('x', function(d){ return radius(1); })
      .text(function(d){
        return d.Major;
      });

    // label voor de y-as
    scatterSvg.append('text')
      .attr('x', 10)
      .attr('y', 10)
      .attr('class', 'label')
      .attr("font-family", "Montserrat", "sans-serif")
      .text('Unemployment_rate %');

    // label voor de x-as
    scatterSvg.append('text')
      .attr('x', scatterWidth)
      .attr('y', scatterHeight - 10)
      .attr('text-anchor', 'end')
      .attr('class', 'label')
      .attr("font-family", "Montserrat", "sans-serif")
      .text('Students');
  })
}
