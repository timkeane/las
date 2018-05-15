var baseUrl = "https://maps.nyc.gov/geoclient/v1/search.json?app_id=legal-aid&app_key=95B2E2312F2ABD5F7&input=";
var input = document.getElementById('input-file');
var output = document.getElementById('output-box');
output.textContent = ''

function writeSuccesOutput(geoclientResp) {
  var address = geoclientResp.input;
  var cityCouncil = geoclientResp['results'][0].response.cityCouncilDistrict;
  var addressWithCcd = address + ' City Council District ' + cityCouncil + '\n';
  output.textContent += addressWithCcd;
}

function writeErrorOutput(error) {
  var address = geoclientResp.input;
  var message = address + ' ERROR ' + error + '\n';
  output.textContent += message;
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
  for (var i = 0; i < addressList.length; i++) {
    geocode(addressList[i]);
  }
}

input.onchange = function() {
  if (this.files && this.files[0]) {
    reader.readAsBinaryString(this.files[0]);
  }
}
