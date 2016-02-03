$.getJSON("static/regions.json", function(data) {
    var series = data;


    var dataset = {};
    // colors should be uniq for every value.
    // For this purpose we create palette(using min/max series-value)
    var onlyValues = series.map(function(obj) {
      return obj[1];
    });
    var minValue = Math.min.apply(null, onlyValues),
      maxValue = Math.max.apply(null, onlyValues);
    // create color palette function
    var paletteScale = d3.scale.linear()
      .domain([minValue, maxValue])
      .range(["#EFEFFF", "#02386F"]); // blue color
    // fill dataset in appropriate format
    series.forEach(function(item) { //
      // item example value ["CA", 70]
      var iso = item[0],
        value = item[1];
      dataset[iso] = {
        numberOfThings: value,
        fillColor: paletteScale(value)
      };
    });
    // render map

    var map = new Datamap({
      element: document.getElementById('container'),
      scope: 'usa',
      projection: 'mercator', //  USA map
      // countries don't listed in dataset will be painted with this color
      fills: {
        defaultFill: '#F5F5F5'
      },
      data: dataset,
      geographyConfig: {
        borderColor: '#DEDEDE',
        highlightBorderWidth: 2,
        // don't change color on mouse hover
        highlightFillColor: function(geo) {
          return geo['fillColor'] || '#F5F5F5';
        },
        // only change border
        highlightBorderColor: '#B7B7B7',
        // show desired information in tooltip
        popupTemplate: function(geo, data) {
          // don't show tooltip if country don't present in dataset
          if (!data) {
            return;
          }
          // tooltip content
          return ['<div class="hoverinfo">',
            '<strong>', geo.properties.name, '</strong>',
            '<br>Count: <strong>', data.numberOfThings, '</strong>',
            '</div>'
          ].join('');
        }
      }
    });

    //draw a legend for this map
    map.legend();
  });