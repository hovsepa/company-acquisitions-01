acqdata();

function acqdata() {
  var cleanData = [];
  var data2 = [];
  var acqNumbers = {
    "Software": "bar",
    "Mobile": "bar-silver",
    "Hardware": "bar-green",
    "Advertising": "bar-purple",
    "Media": "bar-violet",
    "Search": "bar-yellow",
    "eCommerce": "bar-turquoise",
    "Other": "bar-pink"
  };

  d3.csv("data/tenormore.csv", function(error, root) {
    if (error) throw error;
    var bigCompanyNames = [];
    var acquisitions = [];
    console.log(root);

    for (var i = 0; i < root.length; i++) {
      for (var j = i + 1; j < root.length; j++) {
        if ((root[i].name == root[j].name) && (root[i].startDate == root[j].startDate)) {
          acquisitions.push(root[j].acquisition);
        } else {
          break;
        }
      }
      acquisitions.push(root[i].acquisition);
      data2.push({
        "name": root[i].name,
        "year": root[i].startDate,
        "acquisitions": acquisitions
      });
      acquisitions = [];
    }

    console.log(data2);

    for (var i = 0; i < root.length; i++) {
      for (var j = 0; j < data2.length; j++) {
        if ((data2[j].name == root[i].name) && (data2[j].year == root[i].startDate)) {
          cleanData.push({
            "startDate": new Date(root[i].startDate),
            "endDate": new Date(root[i].endDate),
            "taskName": root[i].name,
            "status": root[i].sectors,
            "acquisitions": data2[j].acquisitions
          });
          break;
        }
      }
    }

    console.log(cleanData);

    var sortedata = cleanData.sort(function(a, b) {
      return a.startDate - b.startDate;
    });
    console.log(sortedata);

    //to get the viz in order by time
    for (var i = 0; i < sortedata.length; i++) {
      if (bigCompanyNames.indexOf(sortedata[i].taskName) == -1) {
        bigCompanyNames.push(sortedata[i].taskName);
      }
    }

    var format = "%Y";
    var gantt = d3.gantt().taskTypes(bigCompanyNames).taskStatus(acqNumbers).tickFormat(format);
    gantt(sortedata);

  });
}
