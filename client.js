(function(){
    var dataStore = [],
        margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // setup fill color
    var cValue = function(d) { return d.Manufacturer;},
        color = d3.scale.category10();

    $.ajax({
        url : 'http://localhost:8080/api/type/' + (location.hash ? location.hash.split('#type=')[1] : 'Deadlift')
    }).then(function(data){
        data.forEach(function(e,i){
//            e.Stamp = (new Date(e.Time)).getTime() + '';
            e.Stamp = i*3//(new Date(e.Time)).getTime() + '';
        });

        dataStore = data;

        console.log(data);

        //Create SVG element
        var svg = d3.select("body")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.selectAll("circle")
            .data(dataStore)
            .enter()
            /*.append("circle")
            .attr("cx", function(d) {
                return d.Stamp;//parseFloat(d.Stamp.slice(2,4) + '.' + d.Stamp.slice(2)) * .11;
            })
            .attr("cy", function(d) {
                return d.Weight;
            })
            .attr("r", 3);*/

        /*svg.selectAll("text")
            .data(dataStore)
            .enter()
            .append("text")
            .text(function(d) {
                return d.Weight;
            })
            .attr("x", function(d) {
                return d.Stamp;//parseFloat(d.Stamp.slice(2,4) + '.' + d.Stamp.slice(2)) * .11;
            })
            .attr("y", function(d) {
                return d.Weight;
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", "11px")
            .attr("fill", "red");*/

        var xValue = function(d) { return d.Stamp;}, // data -> value
            xScale = d3.scale.linear().range([0, width]), // value -> display
            xMap = function(d) { return xScale(xValue(d));}, // data -> display
            xAxis = d3.svg.axis().scale(xScale).orient("bottom");

        var yValue = function(d) { return d.Weight;}, // data -> value
            yScale = d3.scale.linear().range([height, 0]), // value -> display
            yMap = function(d) { return yScale(yValue(d));}, // data -> display
            yAxis = d3.svg.axis().scale(yScale).orient("left");

        // x-axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text("Date");

        // y-axis
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Weight (lbs)");

        // don't want dots overlapping axis, so add in buffer to data domain
        xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
        yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

        // draw dots
        svg.selectAll(".dot")
            .data(dataStore)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("r", 3.5)
            .attr("cx", xMap)
            .attr("cy", yMap)
            .style("fill", function(d) { return color(cValue(d));})
            .on("mouseover", function(d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(d.Exercise + "<br/> (" + d.Date + ' ' + d.TimeReadable
                    + ", " + yValue(d) + " lbs )")
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
    });
}());