function createData(populationData){
	var popData=[];
	for (i=0;i<populationData.length;i++){
		if (populationData[i]!=0){
			for (j=0;j<populationData[i];j++){
				var x=Math.random();
				var r=(i*20)+x*20;
				popData.push(r);
			}	
		}
	}
	return popData;
}

function getAverage(dataArray){
	var sum = 0;
	for(var i = 0; i < dataArray.length; i++){
		sum += dataArray[i];
	}
	var avg = +(Math.round(sum/dataArray.length + "e+2")+"e-2");
	return avg;
}

function getSD(dataArray){
	var mean=getAverage(dataArray);
	var n=dataArray.length;
	var sum=0;
	for (i=0;i<dataArray.length;i++){
		var x=dataArray[i]-mean;
		var xs=x*x;
		sum+=xs
	}
	var sd=Math.sqrt((sum/n));
	sd=+(Math.round(sd+"e+2")+"e-2");
	return sd;
}

function drawSample(size,array){
	var sample = [];
	for (i=0;i<size;i++){
		var r=Math.round(Math.random()*(array.length-1));
		var choice=array[r];
		sample.push(choice);
	}
	return sample;
}

function displaySample(sample,graph,bins){
	var binner=[];
	graph.selectAll("#sample").remove();	
	graph.selectAll("#samplemean").remove();
	
	for (i=0;i<bins;i++){
		binner.push(0);
	}

	for (i=0;i<sample.length;i++){
		var value=Math.floor(sample[i]);
		binner[value]+=1
	}

	var rects = graph.selectAll("#sample")
		.data(binner)
		.enter()
		.append("rect")
		.attr("id","sample");
	
	rects.attr("x", function(d, i) {
					return (i*8);
		})
		.attr("y", function(d, i){
			return $("#graph1").height()-gmap(d,50,$("#graph1").height());
		})
		.attr("height", function(d,i){
			return gmap(d,50,$("#graph1").height());
		})
		.attr("width",8)
		.attr("fill", "#b89349");
}

function displaySampleMean(mean,graph,bins){
	
	var data = graph.selectAll("#samplemean").data()
	var bin=Math.floor(mean);
	
	if (data.length==0){
		for(i=0;i<bins;i++){
			data.push(0);
		}
		data[bin]+=1;
	
		var rects = graph.selectAll("#samplemean")
			.data(data)
			.enter()
			.append("rect")
			.attr("id","samplemean");
	
		rects.attr("x", function(d, i) {
						return (i*8-1);
			})
			.attr("y", function(d, i){
				return $("#graph1").height()-gmap(d,150,$("#graph1").height());
			})
			.attr("height", function(d,i){
				return gmap(d,150,$("#graph1").height());
			})
			.attr("width",8)
			.attr("fill", "red");
	}
	else{
		data[bin]+=1;
		var rects = graph.selectAll("#samplemean")
		rects.data(data).enter();
		rects.transition()
		.attr("x", function(d, i) {
						return (i*8-1);
			})
			.attr("y", function(d, i){
				return $("#graph1").height()-gmap(d,150,$("#graph1").height());
			})	
			.attr("height", function(d,i){
				return gmap(d,150,$("#graph1").height());
			})
			.attr("width",8)
			.attr("fill", "red");	
	}
}


function drawHundredSample(size,array){
	var sampleMeans = [];
	for (k=0;k<100;k++){
		var sample=[];
		for (i=0;i<size;i++){
			var r=Math.round(Math.random()*(array.length-1));
			var choice=array[r];
			sample.push(choice);
		}
		sampleMeans.push(getAverage(sample));
	}
	return sampleMeans;
}

function displayHundredMeans(means,graph,bins){
	var data = graph.selectAll("#samplemean").data()
	if (data.length==0){
			for(i=0;i<bins;i++){
				data.push(0);
			}
		for (k=0;k<means.length;k++){
			var bin=Math.floor(means[k]);
			data[bin]+=1;
		}
		var rects = graph.selectAll("#samplemean")
			.data(data)
			.enter()
			.append("rect")
			.attr("id","samplemean");
	
		rects.attr("x", function(d, i) {
						return (i*8-1);
			})
			.attr("y", function(d, i){
				return $("#graph1").height()-gmap(d,150,$("#graph1").height());
			})
			.attr("height", function(d,i){
				return gmap(d,150,$("#graph1").height());
			})
			.attr("width",8)
			.attr("fill", "red");
	}
		else{
			for (k=0;k<means.length;k++){
				var bin=Math.floor(means[k]);
				data[bin]+=1;
				}

			var rects = graph.selectAll("#samplemean")
			rects.data(data).enter();
			rects.transition()
			.attr("x", function(d, i) {
					return (i*8-1);
			})
			.attr("y", function(d, i){
				return $("#graph1").height()-gmap(d,150,$("#graph1").height());
			})
			.attr("height", function(d,i){
				return gmap(d,150,$("#graph1").height());
			})
			.attr("width",8)
			.attr("fill", "red");	
			}	
	}
