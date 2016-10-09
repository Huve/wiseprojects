window.onload=(function(){
    /* TODO () Maybe randomly generate a set of data and plot it instead of this nonsense? */
    
    function __init__(){
        /**
         * Initializes the demo
         */
        WIDTH = window.innerWidth;
        HEIGHT = window.innerHeight;
        BINS = 1000;
        graphDimensions = calculateGraphDimensions(WIDTH);
        console.log(graphDimensions);
        svg = createGraph("#graph", graphDimensions.width, graphDimensions.height);
        POPULATION = new histogram(svg, id="population", fill="steelblue", mean=100, sd=1, numBins=BINS);
        sem = new histogram(svg, id="sem", fill="green", mean=100, sd=.2, numBins=BINS);
        
        document.getElementById('sample').onclick = function() {    
           var sample = sampleData(POPULATION.data, 100);
           drawSampleData(POPULATION, sample);
        }
        
    }
    
    
    function adjustDistribution(){
        /* TOOD */
    }
    
    
    function calculateGraphDimensions(width){
        /**
         * Calculates the dimensions of the graph based on the window size.
         * @param {int} width - width of the window.
         * @return {array} graphDimensions - [x, y] dimensions of the graph. 
         */
        var graphDimensions = {};
        var wRatio = 1600;
        var hRatio = 900;
        graphDimensions['width'] = Math.min(width - 200, 800);
        graphDimensions['height'] = Math.min((graphDimensions.width * hRatio) / wRatio, 450);
        return graphDimensions;
    }
    
    
    function createGraph(elementId, w, h){
        /** 
         * Creates an svg object to graph on.
         * @param {string} elementId - id of the DOM object to append a graph.
         * @param {int} w - width of the graph.
         * @param {int} h - height of the graph.
         */
        var graph = d3.select(elementId)
            .append('svg')
            .attr('width', w)
            .attr('height', h)
            .attr('id', elementId + 'graph')
            .style('background-color', 'light gray');
        return graph;
    }
    
    
    function bar(c, x, y, w, h){
        /**
         * A bar object representing a histogram bin.
         * @param {svg} svg - svg object to plot the bar.
         * @param {int} x - x position of the bar in pixels.
         * @param {int} y - y position in pixels to plot the top of the bar.
         * @param {int} w - width of the bar in pixels.
         * @param {int} h - heigh of the bar in pixels.
         */
        this.draw = function(fill){
            /**
             * Draws the bar.
             */
            var aBar = d3.select('svg').append('rect');
            aBar.attr('x', x)
            .attr('y', y)
            .attr('width', w)
            .attr('height', h)
            .attr('fill', fill)
            .attr('class', c)
            .style({'opacity': .5});
            aBar.transition().attr('y', y + Math.random(0, 1)).duration(1000);
        }
    }
    
    
    function histogram(svg, id, fill, mean, sd, numBins){
        /**
          * Creates a histogram of a distribution.
          * @param {svg} svg - svg object to plot the bar on.
          * @param {string} id - id of the histogram.
          * @param {string} fill - color to fill the bars.
          * @param {float} mean - mean of the distribution.
          * @param {float} sd - standard deviation of the distributions.
          * @param {int} numBins - number of bins to be draw in the histogram.
          * @return {object} this - this histogram.
        */
        this.id = id;
        this.fill = fill;
        this.mean = mean;
        this.sd = sd;
        this.binValue = 0; 
        this.bars = [];
        this.heights = [];
        this.data = [];
        this.barWidth = graphDimensions.width / numBins;
        this.binValue = .000005 * numBins; /*(6 / numBins) * sd;*/
        this.minBin = mean - (numBins / 2) * this.binValue;
        for (var i = 0; i < numBins; i++){
            var iValue = i * this.binValue + this.binValue + this.minBin;
            var x = i * this.barWidth;
            var distValue = calculateNormalDistribution(mean, sd, iValue);
            this.heights.push(distValue);
            var y = graphDimensions.height - distValue;
            var height = graphDimensions.height - y;
            var b = new bar("histogram", x, y, this.barWidth, height);
            this.bars.push(b);
            b.draw(fill);
            var binData = createDataFromDistribution(distValue, iValue, this.binValue);
            for (n = 0; n < binData.length; n++) {
                this.data.push(binData[n]);
            }
        }
        /* var sum = this.heights.reduce((pv, cv) => pv+cv, 0);  Verify similar area under curve */
        return this;
    }
    
    
    function calculateNormalDistribution(mean, sd, iValue){
        /**
          * Calculates the y values of the probability density function.
          * @param {float} mean - mean of the distribution.
          * @param {float} sd - standard deviation of the distribution.
          * @param {float} iValue - ?
          * @return {float} height - y value of the given x for the normal PDF.
          */
        var diff = iValue - mean;
		var numerator = Math.pow(diff, 2);
		var denominator = 2 * (Math.pow(sd, 2));
		var exponent = -(numerator/denominator);
		var eterm = Math.pow(Math.E, exponent);
        var fraction = 1 / ((Math.sqrt(2 * 3.14 * Math.pow(sd, 2))));
		var height = fraction * eterm * (HEIGHT/5);
        return height;
    }
    
    
    function createDataFromDistribution(n, minBinValue, binSize){
        /**
          * Samples uniformly from the bin to create real data.
          * 
          * Should not be used with large bin sizes, as will not technically be normal.
          * 
          * @param {int} n - the frequency of values in the bin; the number of cases to be drawn.
          * @param {float} minBinValue - the minimum numeric value of the bin.
          * @param {float} binSize - the width of the bin.
          * @return {array} data - a uniformly sampled random set of data from the bin.
          */
        var data = [];
        var probability = (n < 1) ? 1 : n
        for(var s = 0; s < n; s++){
            data.push(Math.random() * binSize + minBinValue);
        }
        return data; 
    }
     
    function sampleData(data, n){
        /**
          * Samples data randomly from an array.
          *
          * @param {array} data - the data to be sampled from.
          * @param {int} n - the size of the desired sample.
          * @return {array} sample - an array of the sampled data.
          */
          var sample = [];
          for (var i = 0; i < n; i++){
            var r = Math.round(Math.random() * (data.length-1));
			var choice = data[r];
			sample.push(choice);
          }
          console.log(sample);
          console.log(calculateAverage(sample));
          return sample;
    }
    
    function getBins(histogram, data){
        /**
          * Bins each datapoint based on a histogram's bin sizes and values.
          *
          * @param {object} histogram - histogram for which binning is to be applied.
          * @param {array} data - data to be binned.
          * @return {array} allBins - an array with the frequency (height) of each bin.
          */
        var allBins = new Array(BINS).fill(0);  
        for (var i = 0; i < data.length; i++){
            var bin = Math.floor((data[i] - histogram.minBin) / histogram.binValue);
            allBins[bin] += 1;
        }
        return allBins;  
    }
    
    function drawSampleData(histogram, sampleBins, color="red"){
        /**
          * Draws a histogram based on frequencies of each value.
          *
          * @param {object} svg - svg object to draw the histogram on.
          * @param {array} sampleBins - frequency of each bin in the histogram.
          * @param {string} color - color to draw the histogram.
          * @return draws the histogram on the svg.
          */
          clearSample();
          var binnedSample = getBins(POPULATION, sampleBins);
          for (var i = 0; i < binnedSample.length; i++){
              var width = graphDimensions['width'] / BINS;
              var x = i * width;
              var y = graphDimensions['height'] - binnedSample[i] * 10;
              var height = graphDimensions['height'] - y;
        
              try{
                var b = new bar("sample", x, y, width, height); /* TODO(): SVG param not necessary here */
                b.draw(color);
              }
              catch(e){ };
          }
    }
    
    function calculateAverage(data){
        /*TODO () */
        var sum = 0;
        for (var i = 0; i < data.length; i++){
            sum += data[i];
        }
        var avg = sum / data.length;
        return(avg);
    }
    
    function calculateStandardDev(data){
        /*TODO() */
    }
    
    
    function clearSample(){
        /* TODO()*/
        var sampleBars = d3.selectAll(".sample").remove();
    }
    
    function keyHandler(e){
    }
    
    
    __init__();
    
});