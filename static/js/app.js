// Belly Button Biodiversity - Plotly.js
//samples.json> got data for names, metadata, samples
// BONUS: Build the Gauge Chart

const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

// Fetch the JSON data and console log it //x or data like a variable dont need to define
d3.json(url).then(function(data) {
  console.log(data);
});


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

//---------------------------------------------------------//
//----- //  Build a BAR Chart
//---------------------------------------------------------//  
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

//------------------------------------------------------//
//----Build a BUBBLE Chart 
//------------------------------------------------------//

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





function buildMetadata(sample) {
    d3.json(url).then((data) => {
      let metadata= data.metadata;
      let resultsarray= metadata.filter(sampleobject => 
        sampleobject.id == sample);
      let result= resultsarray[0]
      let panel = d3.select("#sample-metadata");
      panel.html("");
      Object.entries(result).forEach(([key, value]) => {
        panel.append("h6").text(`${key}: ${value}`);
      });
  
    buildGauge(result.wfreq)
  
  
  
    });
  }
  
  function buildGauge(wfreq) {
  
  
  }



function init() {
// Grab a reference to the dropdown select element
let selector = d3.select("#selDataset");

// Use the list of sample names to populate the select options
d3.json(url).then((data) => {
  let sampleNames = data.names;
  sampleNames.forEach((sample) => {
    selector
      .append("option")
      .text(sample)
      .property("value", sample);
  });

  // Use the first sample from the list to build the initial plots
  const firstSample = sampleNames[0];
  buildCharts(firstSample);
  //buildMetadata(firstSample);
});
}

function optionChanged(newSample) {
// Fetch new data each time a new sample is selected
buildCharts(newSample);
buildMetadata(newSample);
}



// Initialize the dashboard
init();
