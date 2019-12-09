function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    d3.json(`/metadata/${sample}`).then(function(data){
      var panel=d3.select("#sample-metadata");
      // Use `.html("") to clear any existing metadata
      panel.html("");
      //use object.entries to loop through key value pairs to the panel
      Object.entries(data).forEach(([key, value]) => {
        // Hint: Inside the loop, you will need to use d3 to append new
        // tags for each key-value in the metadata.
        row=panel.append("tr");
        row.append("td").text(`${key}:${value}`);
          //panel.append("p").text(`${key}:${value}`);
        })
      });

    // BONUS: Build the Gauge Chart
     buildGauge(sample);
}

function buildCharts(sample) {
  d3.json(`/samples/${sample}`).then(function(data){
    var otu_ids=data.otu_ids;
    var sample_values=data.sample_values;
    var otu_labels=data.otu_labels;
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
      plot_trace = {
        values: sample_values.slice(0,10),
        labels: otu_ids.slice(0,10),
        hoverinfo: otu_labels,
        type: "pie"
    }
      var data = [plot_trace];
      Plotly.newPlot("pie", data);
    // @TODO: Build a Bubble Chart using the sample data
     trace1 = {
      x: otu_ids,
      y: sample_values,
      mode: "markers",
      text: otu_labels,
      marker: {
        size: sample_values,
        color: otu_ids
        //textinfo: otu_labels,
        
       }
    }

      var data1 = [trace1];

      var layout = {
        title: 'Bubble Chart',
        height: 600,
        width: 1500
      };

    Plotly.newPlot('bubble', data1, layout);
      });
 }



function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
