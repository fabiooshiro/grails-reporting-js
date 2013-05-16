/**
 * Baby steps
 */
function step(description, fn, timeout){
	var done = fn.length != 1; // has done arg in fn?
	var waitsForFn = function(){return true;};
	runs(function(){
		fn(function(wff){
			if(typeof(wff) == 'function'){
				waitsForFn = wff;
			}
			done = true;
		});
	});
	waitsFor(function(){
		return done && waitsForFn(); 
	}, 'step "' + description + '"', timeout?timeout:5000);
}
