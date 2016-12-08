window.onload=(function(){ 
    /**
      * Initializes the demo
      */
    function __init__(){
        // Initial parameter values.
        BINS = 1000;
        POP_MEAN = 100;
        POP_SD = 10;
        DEFAULT_SAMPLE_SIZE = 25; 
        
        // Set initial parameter values.
        document.getElementById("samplesize").value = DEFAULT_SAMPLE_SIZE;
        
        // Create the histograms.
        graphDimensions = calculateGraphDimensions(window.innerWidth);
        svg = createGraph("graph", graphDimensions.width, graphDimensions.height);
        POPULATION = new histogram(svg, id="population", fill="steelblue", mean=POP_MEAN, sd=POP_SD, numBins=BINS);
        sem = new histogram(svg, id="sem", fill="green", mean=POP_MEAN, sd=POP_SD/Math.sqrt(DEFAULT_SAMPLE_SIZE), numBins=BINS);
        
        document.getElementById('sample').onclick = function() {
           n = document.getElementById("samplesize").value;            
           var sample = sampleData(POPULATION.data, n);
           var sampleMean = roundNumber(calculateAverage(sample), 2);
           var sampleSD = roundNumber(calculateStandardDev(sample), 2);
           drawSampleData(svg, sample); 
           drawSampleMean(svg, sampleMean);
           displaySampleStats(sampleMean, sampleSD);

        }
    }
    
    
    function adjustDistribution(distribution){
        /* TOOD */
    }
    
    
    /**
      * Appends a child element to a parent.
      *
      * @param {string} child The content to be added in between the tags.
      * @param {DOM Object} parent The element in the DOM to which the child is to be added.
      * @param {string} tag The tag that will wrap the content.
      */
    function appendChildElement(child, parent, tag){
        var node = document.createElement(tag);
        var text = document.createTextNode(child);
        node.appendChild(text);
        parent.appendChild(node);
    }
    
    
    /**
      * Calculates the dimensions of the graph based on the window size.
      * @param {int} width The width of the window.
      * @return {array} graphDimensions - [x, y] dimensions of the graph. 
      */
    function calculateGraphDimensions(width){
        var graphDimensions = {};
        var wRatio = 1600;
        var hRatio = 900;
        graphDimensions['width'] = Math.min(width - 200, 1200);
        graphDimensions['height'] = Math.min((graphDimensions.width * hRatio) / wRatio, 450);
        return graphDimensions;
    }
    
    
    /** 
      * Creates an svg object to graph on.
      * @param {string} elementId The id of the DOM object to append a graph.
      * @param {int} w The width of the graph.
      * @param {int} h The height of the graph.
      */
    function createGraph(elementId, w, h){
        var graph = d3.select("#" + elementId)
            .append('svg')
            .attr('width', w)
            .attr('height', h)
            .attr('id', elementId + 'graph')
            .style('background-color', 'white');
        return graph;
    }
    
    
    /**
      * A bar object representing a histogram bin.
      * @param {svg} svg The class of this bar to be drawn.
      * @param {int} x The x position of the bar in pixels.
      * @param {int} y The y position in pixels to plot the top of the bar.
      * @param {int} w The width of the bar in pixels.
      * @param {int} h The height of the bar in pixels.
      */   
    function bar(c, x, y, w, h, svg){
        /**
          * Draws the bar.
          * @param {string} fill The hexcode or color name  to color the bar.
          */
        this.draw = function(fill, opacity=.5){
            var aBar = svg.append('rect');
            aBar.attr('x', x)
            .attr('y', y)
            .attr('width', w)
            .attr('height', h)
            .attr('fill', fill)
            .attr('class', c)
            .style({'opacity': opacity});
            aBar.transition().attr('y', y + Math.random(0, 1)).duration(1000);
        }
    }
    
    
    /**
      * Creates a histogram of a distribution.
      * @param {svg} svg The svg object to plot the bar on.
      * @param {string} id The id of the histogram.
      * @param {string} fill The color to fill the bars.
      * @param {float} mean The mean of the distribution.
      * @param {float} sd The standard deviation of the distributions.
      * @param {int} numBins The number of bins to be draw in the histogram.
      * @return {object} this The this histogram.
      */
    function histogram(svg, id, fill, mean, sd, numBins){
        this.id = id;
        this.fill = fill;
        this.mean = mean;
        this.sd = sd;
        this.binValue = 0; 
        this.bars = [];
        this.heights = [];
        this.data = [];
        this.barWidth = graphDimensions.width / numBins;
        this.binValue = (6 / numBins) * POP_SD; // .000005 * numBins; /*(6 / numBins) * sd;*/
        this.minBin = mean - (numBins / 2) * this.binValue;
        for (var i = 0; i < numBins; i++){
            var iValue = i * this.binValue + this.binValue + this.minBin;
            var x = i * this.barWidth;
            var distValue = calculateNormalDistribution(mean, sd, iValue);
            this.heights.push(distValue);
            var y = graphDimensions.height - distValue;
            var height = graphDimensions.height - y;
            var b = new bar("histogram", x, y, this.barWidth, height, svg);
            this.bars.push(b);
            b.draw(fill);
            var binData = createDataFromDistribution(distValue, iValue, this.binValue);
            for (n = 0; n < binData.length; n++) {
                this.data.push(binData[n]);
            }
        }
        // Verify similar area under curve
        /*var sum = this.heights.reduce((pv, cv) => pv+cv, 0); 
        console.log(sum);*/
        return this;
    }
    
    
    /**
      * Calculates the y values of the probability density function.
      * @param {float} mean The mean of the distribution.
      * @param {float} sd The standard deviation of the distribution.
      * @param {float} iValue The (nth) value position value associated with the bar.
      * @return {float} height The y value of the given x for the normal PDF.
      */
    function calculateNormalDistribution(mean, sd, iValue){
        var diff = iValue - mean;
		var numerator = Math.pow(diff, 2);
		var denominator = 2 * (Math.pow(sd, 2));
		var exponent = -(numerator/denominator);
		var eterm = Math.pow(Math.E, exponent);
        var fraction = 1 / ((Math.sqrt(2 * 3.14 * Math.pow(sd, 2))));
		var height = fraction * eterm * (window.innerHeight);
        return height;
    }
    
    
    /**
      * Samples uniformly from the bin to create real data.
      * 
      * Should not be used with large bin sizes, as will not technically be normal.
      * 
      * @param {int} n The frequency of values in the bin; the number of cases to be drawn.
      * @param {float} minBinValue The minimum numeric value of the bin.
      * @param {float} binSize The width of the bin.
      * @return {array} data A uniformly sampled random set of data from the bin.
      */
    function createDataFromDistribution(n, minBinValue, binSize){
        var data = [];
        var probability = (n < 1) ? 1 : n
        for(var s = 0; s < n; s++){
            data.push(Math.random() * binSize + minBinValue);
        }
        return data; 
    }
    
    
    /**
      * Removes all children from a container.
      *
      * @param {string} container The id of the container.
      */
    function clearContainer(container){
       var parent = document.getElementById(container);
       while(parent.firstChild){
           parent.removeChild(parent.firstChild);
       }
    }
    
    
    /**
      * Dislpays statistics of the sample.
      * 
      * @param {float} sampleMean The mean of the sample.
      * @param {float} sampleSD The standard deviation of the sample.
      */
    function displaySampleStats(sampleMean, sampleSD){
        var meanText = "Sample mean: " +  sampleMean;
        var sdText = "Sample sd: " + sampleSD;
        var container = document.getElementById("stats");
        clearContainer("stats");
        appendChildElement(meanText, container, "div");
        appendChildElement(sdText, container, "div");
    }
     
     
    /**
      * Samples data randomly from an array.
      *
      * @param {array} data The data to be sampled from.
      * @param {int} n The size of the desired sample.
      * @return {array} sample An array of the sampled data.
      */
    function sampleData(data, n){
          var sample = [];
          for (var i = 0; i < n; i++){
            var r = Math.round(Math.random() * (data.length-1));
			var choice = data[r];
			sample.push(choice);
          }
          return sample;
    }
    
    
    /**
      * Bins each datapoint based on a histogram's bin sizes and values.
      *
      * @param {object} histogram The histogram for which binning is to be applied.
      * @param {array} data The data to be binned.
      * @return {array} allBins An array with the frequency (height) of each bin.
      */
    function getBins(histogram, data){
        var allBins = new Array(BINS).fill(0);  
        for (var i = 0; i < data.length; i++){
            var bin = Math.floor((data[i] - histogram.minBin) / histogram.binValue);
            allBins[bin] += 1;
        }
        return allBins;  
    }
    
    
    /**
      * Draws a histogram based on frequencies of each value.
      *
      * @param {object} svg The svg object to draw the histogram on.
      * @param {array} sampleBins The frequencies associated with each bin in the histogram.
      * @param {string} color The color to draw the histogram.
      * @return draws the histogram on the svg.
      */
    function drawSampleData(svg, sampleBins, color="orange"){
      clearFromGraph(".sample");
      var binnedSample = getBins(POPULATION, sampleBins);
      for (var i = 0; i < binnedSample.length; i++){
          var dimensions = getPointDimensions(binnedSample[i], i);
          try{
            var b = new bar("sample", dimensions.x, dimensions.y, dimensions.width, dimensions.height, svg);
            b.draw(color, opacity=1);
          }
          catch(e){ };
      }
    }
    
    
    /**
      * Gets the dimensions of a sampled point in the graph.
      *
      * @param {integer} magnitude The number of times this point occurs.
      * @param {integer} pixels The pixel position of the point.
      * @return {object} dimensions of the point {x:int, y:int, height:int, width:int}
      */
    function getPointDimensions(magnitude, pixels){
        var dimensions = {
            x: 0,
            y: 0,
            height: 0,
            width: graphDimensions['width'] / BINS
        }
        dimensions.x = pixels * dimensions.width;
        dimensions.y = graphDimensions['height'] - magnitude * 10;
        dimensions.height = graphDimensions['height'] - dimensions.y
        return dimensions;
    }
    
    
    /**
      * Draws the sample mean on the graph.
      *
      * @param {float} mean The sample mean.
      * @param {SVG Object} svg The graph object on which to draw the mean.
      */
    function drawSampleMean(svg, mean){
        clearFromGraph(".samplemean");
        var magnitude = Math.floor((mean - POPULATION.minBin) / POPULATION.binValue);
        var dimensions = getPointDimensions(1, magnitude);
        var meanBar = new bar("samplemean", dimensions.x, dimensions.y, dimensions.width, dimensions.height, svg);
        meanBar.draw("red", opacity=1);    
    }
    
    
    /**
      * Calculates the average of an array of values.
      *
      * @param {array} data The data to calculate the average from.
      * @return {float} avg The average of the array.
      */
    function calculateAverage(data){
        var sum = 0;
        for (var i = 0; i < data.length; i++){
            sum += data[i];
        }
        var avg = sum / data.length;
        return(avg);
    }
    
    
    /**
      * Calculates the standard deviation of an array of data.
      *
      * @param {array} data The data.
      * @return {float} sd The standard deviation of the data.
      */
    function calculateStandardDev(data){
        var mean = calculateAverage(data);
	    var n = data.length;
	    var sum = 0;
	    for (i = 0; i < data.length; i++){
            var x = data[i] - mean;
            var xs = x * x;
		    sum += xs
	    }
        var sd = Math.sqrt((sum / n));
	    sd = +(Math.round(sd + "e+2") + "e-2");
	    return sd;
    }
    
    /**
      * Clears all elements of a specific identifer from the graph.
      * 
      * @param {string} identifier The class, id, or SVG type of the element.
      */
    function clearFromGraph(identifier){
        var selection = d3.selectAll(identifier).remove();
    }
   
    
    function keyHandler(e){
    }
    
    /**
      * Rounds a number to a certain number of decimal places.
      *
      * @param {numeric} number The number to be rounded.
      * @param {integer} places The number of decimal places to be rounded to.
      * @return {numeric} roundedNumber The original number rounded to the number of places.
      */
    function roundNumber(number, places){
        var roundedNumber = Math.round(number * Math.pow(10, places)) / Math.pow(10, places);
        return roundedNumber;
    }
    
    
    __init__();
    
});