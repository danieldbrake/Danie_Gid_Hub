var margin={top:20,right:30,bottom:30,left:60},width=960-margin.left-margin.right,height=350-margin.top-margin.bottom,stateData,x=d3.scale.linear().range([0,width]),y=d3.scale.linear().range([height,0]),xAxis=d3.svg.axis().scale(x).tickFormat(d3.format(".0f")).orient("bottom"),yAxis=d3.svg.axis().scale(y).tickFormat(d3.format(",.0f")).orient("left"),svg=d3.select("#line_chart").append("svg div").attr("width",width+margin.left+margin.right).attr("height",height+margin.top+margin.bottom).append("g").attr("transform","translate("+margin.left+","+margin.top+")"),line=d3.svg.line().interpolate("linear").x(function(t){return x(+t.date)}).y(function(t){return y(+t.thing)});d3.tsv("data_2.tsv",function(t,n){function a(t){var n=r(t),a=Math.max(e(n),d),i=svg.selectAll(".choosen").data(n);y.domain([0,a]),i.transition().duration(2e3).attr("d",function(t){return line(t.values)}),i.enter().append("path").attr("class","choosen").attr("d",function(t){return line(t.values)}),o.transition().duration(2e3).attr("d",function(t){return line(t.values)}),i.exit().transition().duration(2e3).remove(),svg.selectAll(".y").transition().duration(2e3).call(yAxis.scale(y))}function e(t){var n;return d3.max(t,function(t){var a=[];t.values.forEach(function(t,n){a[n]=t.thing}),n=Math.max.apply(null,a)}),n}function r(t){var n=s.filter(function(n){return n.name===t});return n}var i=d3.keys(n[0]).filter(function(t){return"Date"!==t}),s=i.map(function(t){return{name:t,values:n.map(function(n){return{date:n.Date,thing:+n[t]}})}});stateData=s,d3.select("#dropDown").append("select").on("change",function(){a(this.options[this.selectedIndex].__data__)}).selectAll("option").data(i.filter(function(t){return"United States"!==t})).enter().append("option").text(function(t){return t}),x.domain(d3.extent(n,function(t,n){return+t.Date})),svg.append("g").attr("class","x axis").attr("transform","translate(0,"+height+")").call(xAxis),svg.append("g").attr("class","y axis").call(yAxis);var o=svg.selectAll(".states").data(s).enter().append("path").attr("class","line").attr("d",function(t){return line(t.values)}).attr("stroke",function(t,n){return"United States"===t.name?"orange":"grey"}),l=r("United States"),d=e(l);a("Alabama")});