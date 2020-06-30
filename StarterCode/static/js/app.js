function unpack(rows, index) {
    return rows.map(function(row) {
      return row[index];
    });
  };

var sample;
function handleSubmit() {
    d3.event.preventDefault();
    sample = String(d3.select("#idselect").node().value);
    updateTable();
    buildPlot();
    buildTable();
    console.log(sample);
    };


function updateTable() {
    d3.selectAll("td").remove()
    d3.selectAll("tr").remove()
};

function buildPlot() {    
    d3.json("samples.json").then(function(samplestuff) {
    var samplechosen = sample;
    var sampleid = samplestuff.samples.map(row => row['id']);
    var otuvalues = samplestuff.samples.map(row => row['sample_values']);
    var otuids = samplestuff.samples.map(row => row['otu_ids']);
    var otulabels = samplestuff.samples.map(row => row['otu_labels']);

    var sampledictionary = [];
    for (var i = 0; i < otuvalues.length; i++){
       sampledictionary.push([{"id": sampleid[i]}, {"otu_values": otuvalues[i]}, {"otu_ids": otuids[i]}, {"otu_labels": otulabels[i]}])    
    };

    var idrow = Object.values(unpack(sampledictionary, 0))
    function search(id, idrow){
        for (var i=0; i < idrow.length; i++) {
            if (idrow[i].id === id) {
                return idrow[i]
            }};
        };
     var idvalue = search(samplechosen, idrow);
    
    
    plotinfo = []
    var samplerow;
    for (samplerow of sampledictionary) {
        for (i = 0; i < 4; i++) {
            if (samplerow[i] === idvalue) {
                plotinfo.push([samplerow])
    }}};
    
    console.log(samplechosen);
    console.log(sampledictionary);
    console.log(idvalue);
    console.log(plotinfo)

    var array_otuvalues = (Object.values(unpack(unpack(plotinfo, 0), 1)))
    var array_otuids = (Object.values(unpack(unpack(plotinfo, 0), 2)))
    var array_otulabels = (Object.values(unpack(unpack(plotinfo, 0), 3)))


    var value_otuvalues = Object.keys(array_otuvalues).map(function(key){
        return array_otuvalues[key];
    });
    var value_otuids = Object.keys(array_otuids).map(function(key){
        return array_otuids[key];
    });
    var value_otulabels = Object.keys(array_otulabels).map(function(key){
        return array_otulabels[key];
    });


    var finalotuvalues = value_otuvalues[0].otu_values.slice(0,10);
    var finalotuids = value_otuids[0].otu_ids.slice(0,10);
    var finalotulabels = value_otulabels[0].otu_labels.slice(0,10);

    var sampleotuvalues = value_otuvalues[0].otu_values
    var sampleotuids = value_otuids[0].otu_ids
    var sampleotulabels = value_otulabels[0].otu_labels


    console.log(finalotuvalues)
    console.log(finalotuids)
    console.log(finalotulabels)

    var trace1 = {
        x: finalotuvalues,
        y: finalotuids,
        type: "bar",
        orientation: "h",
        text: finalotulabels    
     };
 
     data = [trace1]
 
     var layout = {
        yaxis: {
            nticks: 10,
            type: 'category',
            autorange: 'reversed'
          },
        xaxis: {
            autorange: true

        }
     };
 
    Plotly.newPlot("bar", data, layout);
    
    var trace2 = {
        x: sampleotuids,
        y: sampleotuvalues,
        text: sampleotulabels,
        mode: 'markers',
        marker: {
          color: sampleotuids,
          size: sampleotuvalues
        }
      };
      
      var data2 = [trace2];
      
      var bubblelayout = {
        showlegend: false,
        height: 450,
        width: 1100
      };

      Plotly.newPlot('bubble', data2, bubblelayout);
})};

function buildTable() {
    d3.json("samples.json").then(function(samplestuff) {
        var samplechosen = sample;
        var testsubjectid = samplestuff.metadata.map(row => row['id']);
        var testsubjecteth = samplestuff.metadata.map(row => row['ethnicity']);
        var testsubjectgen = samplestuff.metadata.map(row => row['gender']);
        var testsubjectage = samplestuff.metadata.map(row => row['age']);
        var testsubjectloc = samplestuff.metadata.map(row => row['location']);
        var testsubjectbbt = samplestuff.metadata.map(row => row['bbtype']);
        var testsubjectfreq = samplestuff.metadata.map(row => row['wfreq']);
    
        var testsubjectdata = [];
        for (var i = 0; i < testsubjectid.length; i++){
            testsubjectdata.push([{"id": testsubjectid[i]}, {"ethnicity": testsubjecteth[i]}, {"gender": testsubjectgen[i]}, {"age": testsubjectage[i]}, {"location": testsubjectloc[i]}, {"bbtype": testsubjectbbt[i]}, {"wfreq": testsubjectfreq[i]}])    
        };
        console.log(testsubjectdata)


        var samplechosenid = Object.values(unpack(testsubjectdata, 0))
    function search1(id, samplechosenid){
        for (var i=0; i < samplechosenid.length; i++) {
            if (samplechosenid[i].id == id) {
                return samplechosenid[i]
            }};
        };
     var chosenidvalue = search1(samplechosen, samplechosenid);


    demographicInfo = []
    var subjectrow;
    for (subjectrow of testsubjectdata) {
        for (i = 0; i < 4; i++) {
            if (subjectrow[i] === chosenidvalue) {
                demographicInfo.push([subjectrow])
    }}};

    console.log(demographicInfo)
    testsubjectcategories = ["id", "ethnicity", "gender", "age", "location", "bbtype", "wfreq"]
    var table = d3.select("#metadata-box");
    var tbody = table.select("tbody");
    for (var i = 0; i < 7; i++) {
        trow = tbody.append("tr");
        trow.append("td").text(testsubjectcategories[i]);
        trow.append("td").text(Object.values(unpack(demographicInfo, 0)[0][i]));
    }

})};

d3.select("#submit").on("click", handleSubmit);
