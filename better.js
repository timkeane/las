var baseUrl = "https://maps.nyc.gov/geoclient/v1/search.json?app_id=legal-aid&app_key=95B2E2312F2ABD5F7&input=";
var input = document.getElementById('input-file');
var output = document.getElementById('output-box');
var responses;

function writeOutput() {
  if (responses.processed == responses.orderedRequests.length) {
    for (var i = 0; i < responses.orderedRequests.length; i++) {
      var address = responses.orderedRequests[i];
      output.textContent += (responses[address]);
    }
  }
}

function writeSuccesOutput(geoclientResp) {
  if (geoclientResp.status == 'REJECTED') {
    writeErrorOutput(geoclientResp);
  } else {
    var address = geoclientResp.input;
    /*
     * Beware of just peeling off the first result.
     * This will not always be the right answer.
     * For example: if the input is '2 Broadway'
     * with no city, borough or zip provided, there
     * will be 3 results, each from a different borough
     */
    var cityCouncil = geoclientResp['results'][0].response.cityCouncilDistrict;
    var addressWithCcd = address + ' City Council District ' + cityCouncil + '\n';
    responses[address] = addressWithCcd;
    responses.processed = responses.processed + 1;
    writeOutput();
  }
}

function writeErrorOutput(error) {
  var address = error.input || '';
  var message = address + ' ERROR ' + JSON.stringify(error) + '\n';
  responses[address] = message;
  responses.processed = responses.processed + 1;
  console.warn(error);
  writeOutput();
}

function geocode(address) {
  var querystring = encodeURI(address);
  var url = baseUrl + querystring;
  fetch(url).then(function(response) {
    response.json().then(writeSuccesOutput);
  }).catch(writeErrorOutput);
}

var reader = new FileReader();
reader.onloadend = function (event) {
  var addressList = event.target.result.split("\n");
  responses = {orderedRequests: [], processed: 0};
  output.textContent = '';
  for (var i = 0; i < addressList.length; i++) {
    var address = addressList[i].trim()
    responses.orderedRequests.push(address);
    geocode(address);
  }
}

input.onchange = function() {
  if (this.files && this.files[0]) {
    reader.readAsBinaryString(this.files[0]);
  }
}
