// Select Dropdown menu 
var dropdown = d3.select("#selDataset")
var demographics = d3.select("#sample-metadata")

// Fetch the Data and call our Default Page Function
d3.json("samples.json").then(populateDefaultPage);
// Define Default Page Function
function populateDefaultPage(samples){
        // Populate Dropdown
        var names = samples.names;
        names.forEach((name) => {
          var cell = dropdown.append("option");
          cell.text(name);
        });
        // Populate Demographic Info
        var metadata = samples.metadata[0];
        Object.entries(metadata).forEach(([key, value]) => {
           var line = demographics.append("p");
           line.text(`${key} : ${value}`);
        });
        // Grab the first ID for Default Page
        var defaultPage = samples.samples[0];
        // Create Bar Chart
        var dataBar = [{
                type: "bar",
                x: defaultPage.sample_values.slice(0,11),
                y: defaultPage.otu_labels.slice(0,11),
                text: defaultPage.otu_labels.slice(0,11),
                orientation: "h"
        }];
        var layoutBar = {
                title: 'Top 10 OTUs',
        }
        Plotly.newPlot('bar', dataBar, layoutBar);
        // Create Bubble Chart 
        var dataBubble = [{
                x: defaultPage.otu_ids.slice(0,11),
                y: defaultPage.sample_values.slice(0,11),
                text: defaultPage.otu_labels.slice(0,11),
                mode: 'markers',
                marker: {
                  color: defaultPage.otu_ids.slice(0,11),
                  size: defaultPage.sample_values.slice(0,11)
                }
        }];
        var layoutBubble = {
                title: "Samples Bubble Chart"
        }
        Plotly.newPlot('bubble', dataBubble, layoutBubble);
        // Create Gauge
        var dataGauge = [
                {
                  domain: { x: [0, 1], y: [0, 1] },
                  value: metadata.wfreq,
                  title: { text: "Washing Frequency" },
                  type: "indicator",
                  mode: "gauge+number",
                  gauge: { axis: { range: [null, 9] } }
                }
              ];
        Plotly.newPlot('gauge', dataGauge);

};

// Setup the Event Listener
dropdown.on("change", updatePage);

// Event Handler Function
function updatePage(){
        // Grab the Input
        var input = this.value;
        // Call the JSON again
        d3.json('samples.json').then(function(samples){
                // Update Demographics to selected id
                var metadata = samples.metadata;
                var filteredData = metadata.filter(metadata => metadata.id == input)
                demographics.html("")
                Object.entries(filteredData[0]).forEach(([key, value]) => {
                        var line = demographics.append("p");
                        line.text(`${key} : ${value}`);
                })
                // Update Bar Chart
                var selection = samples.samples.filter(sample => sample.id == input)
                var x = selection[0].sample_values.slice(0,11);
                var y = selection[0].otu_labels.slice(0,11);
                var text= selection[0].otu_ids.slice(0,11);
                Plotly.restyle('bar', "x", [x]);
                Plotly.restyle('bar', 'y',[y]);
                Plotly.restyle('bar', 'text', [text]);
                // Update Bubble Chart 
                var x= selection[0].otu_ids.slice(0,11);
                var y= selection[0].sample_values.slice(0,11);
                var text= selection[0].otu_labels.slice(0,11);
                var marker= {'marker': {
                          color: selection[0].otu_ids.slice(0,11),
                          size: selection[0].sample_values.slice(0,11)
                        }}
                Plotly.restyle('bubble', "x", [x]);
                Plotly.restyle('bubble', 'y',[y]);
                Plotly.restyle('bubble', 'text', [text]);
                Plotly.restyle('bubble', marker);
                // Update Gauge
                var value= filteredData[0].wfreq;

                Plotly.restyle('gauge', 'value', [value]);
        })
};

