
// Color palette for Gauge Chart
let arrColorsG = ["#9400D3", "#BA55D3", "#DDA0DD", "#EE82EE", "#FF00FF", "#DA70D6", "#DB7093", "#FFB6C1", "#FFC0CB", "white"];


// Use`d 3.json` to fetch the metadata for a sample
// Hint: Inside the loop, you will need to use d3 to append new
// tags for each key-value in the metadata.
function buildMetadata(sample) {
  d3.json(url).then((data) => {
    let metadata= data.metadata;
    let resultsarray= metadata.filter(sampleobject => 
      sampleobject.id == sample);
    let result= resultsarray[0]
// Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");
// Use `.html("") to clear any existing metadata
    panel.html("");
// Use `Object.entries` to add each key and value pair to the panel
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });

  //buildGauge(result.wfreq)


  });
}

//=============Gauge Chart Function=======================//

function buildGaugeChart(sample) {
  console.log("sample", sample);

  d3.json(url).then(data =>{

    let objs = data.metadata;
    //console.log("objs", objs);

    let matchedSampleObj = objs.filter(sampleData => 
      sampleData["id"] === parseInt(sample));
    //console.log("buildGaugeChart matchedSampleObj", matchedSampleObj);

    gaugeChart(matchedSampleObj[0]);
 });   
}


//======================================================//
//=============== Build a GAUGE Chart ==================//
//======================================================//
function gaugeChart(data) {
  console.log("gaugeChart", data);

  if(data.wfreq === null){
    data.wfreq = 0;

  }

  let degree = parseInt(data.wfreq) * (180/10);

  // Trig to calc meter point
  let degrees = 180 - degree;
  let radius = .5;
  let radians = degrees * Math.PI / 180;
  let x = radius * Math.cos(radians);
  let y = radius * Math.sin(radians);

  let mainPath = 'M -.0 -0.025 L .0 0.025 L ',
      pathX = String(x),
      space = ' ',
      pathY = String(y),
      pathEnd = ' Z';
  let path = mainPath.concat(pathX, space, pathY, pathEnd);

  let trace = [{ type: 'scatter',
     x: [0], y:[0],
      marker: {size: 50, color:'2F6497'},
      showlegend: false,
      name: 'WASH FREQ',
      text: data.wfreq,
      hoverinfo: 'text+name'},
    { values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 9],
    rotation: 90,
    text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1',''],
    textinfo: 'text',
    textposition:'inside',
    textfont:{
      size : 16,
      },
    marker: {colors:[...arrColorsG]},
    labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '2-1', '0-1',''],
    hoverinfo: 'text',
    hole: .5,
    type: 'pie',
    showlegend: false
  }];

  let layout = {
    shapes:[{
        type: 'path',
        path: path,
        fillcolor: '#2F6497',
        line: {
          color: '#2F6497'
        }
      }],

    title: '<b>Belly Button Washing Frequency</b> <br> <b>Scrub Per Week</b>',
    height: 550,
    width: 550,
    xaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]},
  };

  Plotly.newPlot('gauge', trace, layout, {responsive: true});

}



//=============Bubble&Bar Chart Functions=======================//

function buildCharts(sample) {

// Use `d3.json` to fetch the sample data for the plots
d3.json(url).then((data) => {
  let samples= data.samples;
  let resultsarray= samples.filter(sampleobject => 
      sampleobject.id == sample);
  let result= resultsarray[0]

  let ids = result.otu_ids;
  let labels = result.otu_labels;
  let values = result.sample_values;

//======================================================//
//================ Build a BUBBLE Chart=================// 
//======================================================//

  let LayoutBubble = {
    margin: { t: 0 },
    xaxis: { title: "OTU ID" },
    hovermode: "closest",
    };

    let DataBubble = [ 
    {
      x: ids,
      y: values,
      text: labels,
      mode: "markers",
      marker: {
        color: ids,
        size: values,
        }
    }
  ];

  Plotly.newPlot("bubble", DataBubble, LayoutBubble);


//=========================================================//
//===============  Build a BAR Chart=======================//
//=========================================================// 
  let bar_data =[
    {
      y:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
      x:values.slice(0,10).reverse(),
      text:labels.slice(0,10).reverse(),
      type:"bar",
      orientation:"h"

    }
  ];

  let barLayout = {
    title: "Top 10 Bacteria Cultures Found",
    margin: { t: 30, l: 150 }
  };

  Plotly.newPlot("bar", bar_data, barLayout);
});
}


//============= Function init =======================//

function init() {
// Grab a reference to the dropdown select element
let selector = d3.select("#selDataset");

// Use the list of sample names to populate the select options
d3.json(url).then((data) => {
  var sampleNames = data.names;
  sampleNames.forEach((sample) => {
    selector
      .append("option")
      .text(sample)
      .property("value", sample);
  });

  // Use the first sample from the list to build the initial plots
  const firstSample = sampleNames[0];
  buildMetadata(firstSample);
  buildCharts(firstSample);
  buildGaugeChart(firstSample)


});
}

function optionChanged(newSample) {
// Get new data each time a new sample is selected
buildMetadata(newSample);
buildCharts(newSample);
buildGaugeChart(newSample)

}



// Initialize the dashboard
init();