var m = {t:50,r:50,b:50,l:50};
var outerWidth = document.getElementById('canvas').clientWidth,
    outerHeight = document.getElementById('canvas').clientHeight;
var w = outerWidth - m.l - m.r,
    h = outerHeight - m.t - m.b;

console.log(w);
console.log(h);

var plot = d3.select('.canvas')
    .append('svg')
    .attr('width',outerWidth)
    .attr('height',outerHeight)
    .append('g')
    .attr('transform','translate(' + m.l + ',' + m.t + ')');

//Import data
d3.csv('../data/medialist.csv', parse, function(err, data){
 

  //nest data to set scale Y (day)
  var usageByDay = d3.nest().key(function(data){ return data.day;})
      .entries(data);
      
  var axisDay = usageByDay.map(function(d){
      return d.key});
  
  console.log(axisDay);

  //Scale Y (day)
  var scaleY = d3.scaleBand()
      .domain(axisDay)
      .range([0,h])
      .paddingOuter(0.5)
      .paddingInner(0.4);

  //Scale X (minutes)
  var scaleX = d3.scaleLinear()
      .domain([0,700])
      .range([0,w]);
  
  //draw axisX
  plot.append('g')
      .attr('class','axis axisX')
      .attr('transform','translate(20,'+(h-10)+')')
      .call(d3.axisBottom(scaleX));

  //nest data by media 
  var usageByMedia = d3.nest().key(function(data){ return data.media;})
      .entries(data);

  var scaleByMedia = usageByMedia.map(function(data){return data.key});
  //Scale Z (color)
  var scaleZ = d3.scaleOrdinal()
      .domain(scaleByMedia)
      .range(["#ee751f", "#e62786", "#631A86", "#A39BA8", "#FF686B", "#fabb15", "#C80025","#95C623","#3d5b9b","#c9a48b"]);
  
  console.log(scaleByMedia);

  //draw the bar
  plot.append('g')
      .attr('class','bar')
      .selectAll('g')
      .data(usageByMedia)
      .enter()  
        .append('g')
        .attr('transform','translate(20,0)')
        .attr('class',function(d){return d.key})
        .attr('fill',function(d) {return scaleZ(d.key)})
        .style('opacity',0.3)
        .on('mouseenter',function(d){
          console.log(d);
          d3.select(this)
            .style('opacity',1)
            .style('stroke','#E6EFE9')
            .style('stroke-width','0px');

          plot.select('.bar')
              .selectAll('text')
              .data(data, function(data){return data.values})
              .enter()
              .append('text');

        })
        .on('mouseleave',function(d){
          d3.select(this)
            .style('opacity',0.3)
            .style('stroke-width','0px');
        })
          .selectAll('rect')
          .data(function(d){return d.values;})
          .enter()
          .append('rect')
          .attr('class',function(d){return d.media;})
          .attr('x',function(d) {return d.xValue*1.5;})
          .attr('y',function(d) {return scaleY(d.day)})
          .attr('width',function(d) {return d.minutes*1.5+"px";})
          .attr('height', scaleY.bandwidth());



  //draw axisY
  plot.append('g')
      .attr('class','axis axisY')
      .attr('transform','translate(20,0)')
      .call(d3.axisLeft(scaleY));



});


 

function parse(d) {

    return {
        day: d['Day'],
        media: d['Media'],
        minutes: +d['Minutes'],
        xValue: +d['x'] 
    } 

}





