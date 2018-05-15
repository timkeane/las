var base_url="https://maps.nyc.gov/geoclient/v1/search.json?app_id=legal-aid&app_key=95B2E2312F2ABD5F7&input=";
var input_file = document.getElementById("input_file");
var output_box = document.getElementById("output_box");
output_box.textContent = ''

input_file.addEventListener("change", function () {
  if (this.files && this.files[0]) {
    var file = this.files[0];
		var reader = new FileReader();

    reader.addEventListener('load', function (file_loaded_event) {
      console.log(file_loaded_event);
      var address_list = file_loaded_event.target.result.split("\n");
      var address_list_with_ccd = [];
      for(var int = 0; int < address_list.length; int++) {
        var querystring = encodeURI(address_list[int]);
        var url = base_url + querystring;
				fetch(url).then(function(response) {
					console.log('Status:', response.status);
					response.json().then(function(response) {
            var input_address = response.input;
            var city_council_district = response['results'][0].response.cityCouncilDistrict;
						output_box.textContent = output_box.textContent + input_address + ' City Council District ' + city_council_district + '\n';
					}).catch(function(err) {
            output_box.textContent = output_box.textContent + input_address + ' ERROR ' + err + '\n';
					});
				});
      }
    });
    reader.readAsBinaryString(file);
   }
});
