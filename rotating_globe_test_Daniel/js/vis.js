//--VIS.JS--//
  var feature // eventually: all svg paths (countries) of the world
    , countries
    //, toggle; animation on/off control

  var projection = d3.geo.azimuthal()
      .scale(250)
      .origin([-71.03,42.37])
      .mode("orthographic")
      .translate([250, 250]);

  var circle = d3.geo.greatCircle()
      .origin(projection.origin());

  // TODO fix d3.geo.azimuthal to be consistent with scale
  var scale =
  { orthographic: 250
  , stereographic: 250
  , gnomonic: 250
  , equidistant: 250 / Math.PI * 2
  , equalarea: 250 / Math.SQRT2
  };

  var path = d3.geo.path()
      .projection(projection);

  var svg = d3.select("#canvas_globe_svg")
      .on("mousedown", mousedown);

  if (frameElement) frameElement.style.height = '800px';

  d3.json("json/world-countries.json", function(collection) {
    countries = collection;
    feature = svg.selectAll("path")
        .data(collection.features)
      .enter().append("#canvas_glove_svg:path")
        .attr('id', function(d) { return d.id; })
        .attr("d", clip);

    feature.append("#canvas_glove_svg:title")
        .text(function(d) { return d.properties.name; });

    // startAnimation();

    // d3.select('#animate').on('click', function () {
    //   if (done) startAnimation(); else stopAnimation();
    // });
    
  });

  function stopAnimation() {
    done = true;
    d3.select('#animate').node().checked = false;
  }

  function startAnimation() {
    done = false;
    d3.timer(function() {
      var origin = projection.origin();
      origin = [origin[0] + .18, origin[1] + .06];
      projection.origin(origin);
      circle.origin(origin);
      refresh();
      return done;
    });
  }

  function animationState() {
    return 'animation: '+ (done ? 'off' : 'on');
  }

  d3.select(window)
      .on("mousemove", mousemove)
      .on("mouseup", mouseup);

  d3.select("select").on("change", function() {
    stopAnimation();
    projection.mode(this.value).scale(scale[this.value]);
    refresh(750);
  });

  var m0
    , o0
    , done
    ;

  function mousedown() {
    stopAnimation();
    m0 = [d3.event.pageX, d3.event.pageY];
    o0 = projection.origin();
    d3.event.preventDefault();
  }

  function mousemove() {
    if (m0) {
      var m1 = [d3.event.pageX, d3.event.pageY]
        , o1 = [o0[0] + (m0[0] - m1[0]) / 8, o0[1] + (m1[1] - m0[1]) / 8];
      projection.origin(o1);
      circle.origin(o1);
      refresh();
    }
  }

  function mouseup() {
    if (m0) {
      mousemove();
      m0 = null;
    }
  }

  function refresh(duration) {
    (duration ? feature.transition().duration(duration) : feature).attr("d", clip);
  }

  function clip(d) {
    return path(circle.clip(d));
  }

  function reframe(css) {
    for (var name in css)
      frameElement.style[name] = css[name] + 'px';
  }
//--END VIS.JS--//



//---DND.JS---//
  // http://www.html5rocks.com/en/tutorials/file/dndfiles/
  d3.select('svg#canvas_globe_svg')
    .on('dragover', handleDragOver)
    .on('drop', handleFileSelect)
    ;

  function handleFileSelect() {
    var event = d3.event
      , files = event.dataTransfer.files // FileList object
      , about = []
      , shape = null;
    event.stopPropagation();
    event.preventDefault();

    for (var i = 0, file; file = files[i]; i++) {
      // f.name, f.size, f.type (doesn't grok "json"), f.lastModifiedDate
      readGeojson(file, draw);
    }
  }

  function readGeojson(file, cb) {
    var reader = new FileReader;
    reader.onload = function(e) {
      cb(e.target.result, file);
    };
    reader.readAsText(file);
  }

  function handleDragOver() {
    var ev = d3.event;
    ev.stopPropagation();
    ev.preventDefault();
    ev.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }

  function draw(content, file) {
    var json = JSON.parse(content)
      , what = json.features;
    feature.data(countries = countries.features.concat(what))
      .enter().append('svg:path')
        .classed('new', true)
        .attr('id', function(d) { return d.id; })
        .attr('d', clip);
    feature = svg.selectAll('path');
    refresh();
  }
//--END DND.JS--//