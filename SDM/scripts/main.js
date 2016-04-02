window.onload=(function(){
				
	var svg1 = d3.select("#wrap1")
				.append("svg")
				.attr("width", 576)
				.attr("height", 400)
				.attr("id","graph1");
				
	var svg2 = d3.select("#wrap2")
				.append("svg")
				.attr("width", 576)
				.attr("height", 400)
				.attr("id","graph2");
				
	var pop= new Histogram("pops",svg1,72,$("#graph1").height(),$("#graph1").width(),960,200,false,"#b5d5ef");
	pop.draw(pop.inc,pop.height,pop.width,pop.y,10,true);	
	
	
	var pop2= new Histogram("sdms",svg1,144,$("#graph1").height(),$("#graph1").width(),960,30,true,"Green");
	pop2.draw(pop2.inc,pop2.height,pop2.width,pop2.y,10);

	var N = 0;
	
	$("#sample").click(function(){
		var s=drawSample(parseN($("#samplesize").val()),pop.true_data);
		if ($("#smsample").is(":checked")){
			displaySample(s,svg1,72);
			svg1.selectAll("#samplemean").remove();	
		}
		else{
			N += 1;
			$("#N").text(N);
		}
		displaySampleMean(getAverage(s),svg1,72);
		$("#lastmean").text(getAverage(s));
		$("#SEM").text((getSD(s)/parseN($("#samplesize").val())).toFixed(2));
	});
	
	$("#sample100").click(function(){
		$("#smmean").prop("checked", true);
		svg1.selectAll("#sample").remove();
		var s=drawHundredSample(parseN($("#samplesize").val()),pop.true_data);
		displayHundredMeans(s,svg1,72);
		N +=s.length;
		$("#N").text(N);
	});
	
	$("#reset").click(function(){
		reset();
	});
	
	$("#pmpop").click(function(){
		if ($(this).is(':checked')){
			pop.adjust(svg1,parseN($("#samplesize").val()));
			
		}
		else{pop.hidden();}
	});
	
	
	$("#pmsam").click(function(){
		if ($(this).is(':checked')){
			pop2.adjust(svg1,parseN($("#samplesize").val()));
			
		}
		else{pop2.hidden();}
	});
	
	$("#smmean").click(function(){
		reset();	
	});
	
	$("#smsample").click(function(){
		N = 0;
		$("#N").text(N);
		reset();
	});
	
	function parseN(nString){
	// Parses string from slider for n using regex
	// 
	// Args:
	//   nString: string from the slider
	// 
	// Returns:
	//   n: sample size n from the string
		return /\d\d*/.exec(nString)[0];
	}
	
	function reset(){
	// Resets the sketch
		svg1.selectAll("#samplemean").remove();	
		svg1.selectAll("#sample").remove();
		N = 0;
		$("#N").text("");
		$("#lastmean").text("");
		$("#SEM").text("");
	}
	
	// Slider functionality
	$("#slider").slider({
		slide: function( event, ui ) {
			$("#samplesize").val("N = " + ui.value);
			pop2.adjust(svg1, parseN($("#samplesize").val()));
		 },
		 stop: function (event, ui){
			$("#samplesize").val("N = " + ui.value);
			pop2.adjust(svg1, parseN($("#samplesize").val()));
			reset();
		 }
	});

	$( "#slider" ).slider({ max: 100 });
	$( "#slider" ).slider({ min: 10 });
	$( "#slider" ).slider({ step: 1 });
	$( "#slider" ).slider({ value: 5 });
	$("#samplesize").val("N = " + $( "#slider" ).slider("value"));
});