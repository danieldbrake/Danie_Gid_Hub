$.getJSON('json/world-countries.json', function(data) {
	for (var i = 0; i < data.features.length; i++ ) { 

		var country_abbrv = data.features[i].id;

		var country_title = data.features[i].properties.name
		
		$(document).on('click', '#' + country_abbrv, function(){

			var country_title = $(this).find('title').text();

			$(this).siblings().attr('class', '#aaa')
			$(this).attr('class', 'red');

			$('.project_title').find('p').remove();
			$('.project_title').append("<p>" + country_title + "</p>");

		});

	}
});





