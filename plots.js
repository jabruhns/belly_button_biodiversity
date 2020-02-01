// 1. Import json data

function unpack(rows, index) {
    return rows.map(function(row) {
        return row[index];
    });
}
var query = "data/samples.json"
var data = d3.json(query)

function buildSelect() {
    d3.json(query).then((data) => {
        console.log(data)
        var subjects = data.names
            // console.log(subjects)

        var select = document.getElementById("selDataset");
        for (var i = 0; i < subjects.length; i++) {
            var option = subjects[i];
            var element = document.createElement("option");
            element.textContent = option;
            element.value = option;
            select.append(element);
        }
    })
}
buildSelect()

// 2. Create a horizontal bar chart with a dropdown menu 
// to display the top 10 OTUs found in that individual.
// * Use `sample_values` as the values for the bar chart.

// d3.select("#selDataset").on("change", function() {
//     d3.event.preventDefault();
var selectMenu = d3.select("#selDataset")
var dataSelector = selectMenu.property('value')
d3.json(query).then((response) => {
        var samples = response.samples
            // console.log(samples)
        for (var i = 0; i < samples.length; i++) {
            var subject = samples[i].id
                // console.log(subject)
        }
    })
    // console.log(query)

d3.selectAll("#selDataset").on("change", updatePlots)

function updatePlots() {
    var subject = d3.select("#selDataset").property("value")
        // var index = []
    barChart(subject)
    bubbleChart(subject)
    metaData(subject)
}

function barChart(subject) {
    d3.json(query).then((response) => {
        var otuValues = response.samples
        console.log(otuValues)
        for (var i = 0; i < otuValues.length; i++) {
            if (otuValues[i].id === subject) {
                console.log(otuValues.otu_ids)
                var sortSamples = otuValues.sample_values.sort((a, b) => b.sample_values - a.sample_values)
                var slicedSamples = sortSamples.slice(0, 10).reverse()
                var trace1 = [{
                    x: slicedSamples.map(object => object.sample_values),
                    // * Use `otu_ids` as the labels for the bar chart.
                    y: slicedSamples.map(object => object.otu_ids),
                    // * Use `otu_labels` as the hovertext for the chart.
                    text: slicedSamples.map(object => object.otu_labels),
                    name: "OTUs",
                    type: "bar",
                    orientation: "h"
                }]
                var layout = {
                    title: "Top OTUs for Subject",
                    margin: {
                        l: 50,
                        r: 50,
                        t: 50,
                        b: 50
                    }
                }
                Plotly.newPlot("bar", trace1, layout)
            }
        }

    })
}

// 3. Create a bubble chart that displays each sample.
function bubbleChart(subject) {
    d3.json(query).then((response) => {
        var otuValues = response.samples
        for (var i = 0; i < otuValues.length; i++) {
            if (otuValues[i].id === subject) {
                var trace2 = [{
                    // * Use `otu_ids` for the x values.
                    x: otuValues[i].otu_ids,
                    // * Use `sample_values` for the y values.
                    y: otuValues[i].sample_values,
                    marker: {
                        // * Use `sample_values` for the marker size.
                        size: otuValues[i].sample_values
                    }
                }]
                var layout2 = {
                    title: 'OTUs per Subject',
                    showlegend: true,
                    height: 50,
                    width: 50
                }
                Plotly.newPlot("bubble", trace2, layout2)
            }
        }
    })
}



// * Use `otu_ids` for the marker colors.

// * Use `otu_labels` for the text values.



// 4. Display the sample metadata, i.e., an individual's demographic information.
function metaData(subject) {
    d3.json(query).then((response) => {
        var metaSamples = response.metadata
        console.log(metaSamples)
        for (var i = 0; i < metaSamples.length; i++) {
            if (metaSamples[i].id === subject) {
                var id = metaSamples[i].id
                var ethnicity = metaSamples[i].ethnicity
                var gender = metaSamples[i].gender
                var age = metaSamples[i].age
                var location = metaSamples[i].location
                var bbtype = metaSamples[i].bbtype
                var wfreq = metaSamples[i].wfreq
                buildTable(id, ethnicity, gender, age, location, bbtype, wfreq)
            }
        }
    })
}

function buildTable(id, ethnicity, gender, age, location, bbtype, wfreq) {
    var table = d3.select("sample-metadata")
    var tbody = table.append("tbody")
    tbody.text("")
    tbody.append("tr").append("td").text(id)
    tbody.append("tr").append("td").text(ethnicity)
    tbody.append("tr").append("td").text(gender)
    tbody.append("tr").append("td").text(age)
    tbody.append("tr").append("td").text(location)
    tbody.append("tr").append("td").text(bbtype)
    tbody.append("tr").append("td").text(wfreq)
}
// 5. Display each key-value pair from the metadata JSON object somewhere on the page