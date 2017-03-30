/* === GRAB JSON ====== */

$.ajaxSetup({
	// a must -- otherwise, img_set = null
	async: false
});

var img_set = null;

$.getJSON("data/full_res.json", function(json) {
		img_set = json;
});

// ___________________________________________________________ ||
// ___________________________________________________________ ||

/* ===  SWAPPING EVERYWHERE	================== */

/* TODO: Encapsulate */
/* Global Values */
var SLIDES_PER_ROW = 4;
var current_section = "fur";
var current_slide_count = img_set[current_section].length;
var  current_max_pages = Math.ceil( current_slide_count / SLIDES_PER_ROW);
var current_page = 1;

/* Colors are: lavender, maroon, shamrock green, turquoise  */
function swapColors(selection){
	var color_options = ["#CC99CC", "#AA0114", "#009E60", "#009ba2"];
	$('body').animate({backgroundColor: color_options[selection-1]});
}

function swapEntry(selection, container){
	var fileIndex = 4*(current_page-1) + (selection-1);
	var selectedData = img_set[current_section][fileIndex].filename;
	$(container).fadeOut(function() { 
		$(this).load(function() { $(this).fadeIn(); }); 
		$(this).attr("src",  current_section + "/" + selectedData); 
		heightComputer();
	}); 
}

/* ---	ADJUSTS CONTEXT FROM BUTTON CLICK --------- */
function swapSection(selection){
	current_section = selection;
	current_slide_count  = img_set[current_section].length;
	current_max_pages = Math.ceil( current_slide_count / SLIDES_PER_ROW);
	current_page = 1;
	
	swapEntry(1, "#presentation_img");
	swapPreviews(current_page); 
	updateTracker(selection, current_page);
	
}

/*---	ARROW CLICK	--------- */
function shiftDeck(direction){
	/* flip through pages */
	if (direction === 'left'){
		current_page--;
	} else {
		current_page++;
	}
	
	/* to stay within bounds */
	if (current_page < 1){
		current_page = current_max_pages;
	} else if (current_page > current_max_pages){
		current_page = 1;
	}
	
	/* update to 1st img of new page */
	swapEntry(1, "#presentation_img");
	
	/* update UI */
	updateTracker();
}

/*---	CHANGES TRACKER NUMBERS	--------- */
function updateTracker(){
	var page_count = Math.ceil(current_section.length / SLIDES_PER_ROW);
	 current_max_pages = Math.ceil(img_set[current_section].length / SLIDES_PER_ROW);
	$("#tracker").html(current_page + " of " +  current_max_pages);
	swapPreviews();
}

/*---	UPDATES THUMBNAILS	--------- */
function	swapPreviews(){
		var selection = 1;
		var maxed = false;
		var selectedData = null;
		$("#choice_block ul>li>img").each(function() { 
			var fileIndex = selection + 4*(current_page-1) - 1;
			if (fileIndex == current_slide_count){
				maxed = true;
			} else{
				selectedData = img_set[current_section][fileIndex].filename;
			}
			selection++;
			
			if (!maxed){
				var img_selection = current_section + "/" + selectedData;
				$(this).show();
				$(this).attr("src",  img_selection);
			} else {
				$(this).hide();
				selection = 1;
			}
			
			
		}
	); // end of loop
}
/* ===  FAUX COLUMN ADJUNCT ================== */

function heightComputer(){
	var height_delta = $(document).height() - $("#banner").height();
        $('#panel_wrapper').css('height', height_delta);
}

$(function() {
    function unifyHeights() {
        heightComputer();
    }
    unifyHeights();
});


/* ===  TRACKER INIT ================== */

$("document").ready(function() {
    setTimeout(function() {
        $("#left_slider")[0].click()
        $("#right_slider")[0].click()
    },10);
});
