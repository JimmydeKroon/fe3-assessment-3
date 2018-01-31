
function drawBarChart(){
  // selecteer id bar en stel de margins in
  var barSvg = d3.select('#bar'),
      barMargin = {top: 20, right: 20, bottom: 300, left: 40},
      barWidth = +barSvg.attr("width") - barMargin.left - barMargin.right,
      barHeight = +barSvg.attr("height") - barMargin.top - barMargin.bottom,
      g = barSvg.append("g").attr("transform", "translate(" + barMargin.left + "," + barMargin.top + ")");

  // d3 object van de laatst geselecteerde bar
  var lastSelected;

  // maak de x-as aan en zorg dat alle bars netjes naast elkaar komen
  var x = d3.scaleBand()
      .rangeRound([0, barWidth])
      .paddingInner(0.05)
      .align(0.1);

  // maak de y-as aan en zorg dat de bars de juiste hoogte krijgen
  var y = d3.scaleLinear()
      .rangeRound([barHeight, 0]);

  // De kleuren die mee worden gegeven aan de bars
  var z = d3.scaleOrdinal()
      .range(["#55efc4", "#ff7675"]);

  // dataTest is een object waar de gecombineerde resultaten van de majors in een eigen categorie worden gezet
  // (ie: in engineering komen alle engineering vakken)
  var dataTest = {};

  // Loop door de csv en kijk naar de data onder "major_category, men en women"
  d3.csv("data2.csv", function(d, i, columns) {

      var newColumns = ["Major_category", "Men", "Women"]

      for (i = 1, t = 0; i < newColumns.length; ++i){
        t += d[newColumns[i]] = +d[newColumns[i]];
      }

      //Checkt of de data voor de major al in het object staat
      if(d.Major_category in dataTest){
        // zet de informatie op de juiste plek in het object en maak van de string een getal zodat het opgeteld kan worden
        dataTest[d.Major_category].Men += parseInt(d.Men);
        dataTest[d.Major_category].Women += parseInt(d.Women);
        dataTest[d.Major_category].total += parseInt(t);
      }else{
        // als de categorie nog niet bestaat in dataTest, maak deze dan aan
        dataTest[d.Major_category] = {};

        dataTest[d.Major_category].Men = parseInt(d.Men);
        dataTest[d.Major_category].Women = parseInt(d.Women);

        dataTest[d.Major_category].total = parseInt(t);
      }
  }, function(error, data) {
      var dataArray = [];

    //het data object omvormen in een array die d3 snapt
   for(let row in dataTest){
     dataTest[row].Major = row;
     dataArray.push(dataTest[row]);
   }

   // stop de data dataArray in de variabele data
   data = dataArray;
   //console.log(data);

    if (error) throw error;

    // zet "men" & "women" in keys, hiermee wordt de legenda gemaakt
    var keys = ['Men', 'Women'];

    // Sorteer de data van hoog naar laag
    data.sort(function(a, b) { return b.total - a.total; });

    // zet de namen van de majors op de x-as
    x.domain(data.map(function(d) { return d.Major; }));

    // zet de y-as van 0 tot het maximale totaal
    y.domain([0, d3.max(data, function(d) { return d.total; })]).nice();

    // zorg dat "men" & "women" in de legenda komen
    z.domain(keys);

    g.append("g")
      .selectAll("g")
      .data(d3.stack().keys(keys)(data))
      .enter().append("g")
        .attr("fill", function(d) { return z(d.key); })
      .selectAll("rect")
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("x", function(d) { return x(d.data.Major); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) {return y(d[0]) - y(d[1]); })
        .attr("width", x.bandwidth())

        // maak een class aan op de rectangle met de naam van de major (sommige majors hebben een naam met spaties)
        // een class kan geen spatie hebben dus worden de spaties weggehaald (alleen characters A tot Z en 0 tot 9 worden geaccepteerd)
        .attr("class", function(d) { return d.data.Major.replace(/[^A-Z0-9]/ig, ""); })

        // update de scatterplot als er geklikt wordt op de bar
        .on("click",function(d){
            updateScatter(d.data.Major)

            // maak de vorige aangeklikte bar weer de originele kleur
            lastSelected._groups[0][0].setAttribute("fill", "#55efc4")
            lastSelected._groups[0][1].setAttribute("fill", "#ff7675")


            // highlight de nieuwe kleur
            var elements = d3.selectAll("."+d.data.Major.replace(/[^A-Z0-9]/ig, ""))
            elements._groups[0][0].setAttribute("fill", "#16a085")
            elements._groups[0][1].setAttribute("fill", "#e74c3c")

            // zorg ervoor dat wordt onthouden welke bar als laatst is aangeklikt
            lastSelected = elements;
        });

    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + barHeight + ")")
        .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".2em")
        .attr("transform", "rotate(90)")
        .attr("font-family", "Montserrat", "sans-serif")
        .attr("font-weight", "bold")
        .style("text-anchor", "start");

    g.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(null, "s"))
        .attr("font-weight", "bold")
      .append("text")
        .attr("x", 2)
        .attr("y", y(y.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .text("Students");

    var legend = g.append("g")
        .attr("font-family", "Montserrat", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .attr("font-weight", "bold")
      .selectAll("g")
      .data(keys.slice().reverse())
      .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", barWidth - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", z);

    legend.append("text")
        .attr("x", barWidth - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function(d) { return d; });


    // zorg dat business de geselecteerde categorie is na het laden van de pagina
    var elements= d3.selectAll("."+ startMajor)
    elements._groups[0][0].setAttribute("fill", "#16a085")
    elements._groups[0][1].setAttribute("fill", "#e74c3c")

    lastSelected = elements;
  });
}

// Bepaal met welke major we starten
var startMajor = "Business";
// Voer de bovenstaande code uit
drawBarChart();
drawScatter(startMajor);
