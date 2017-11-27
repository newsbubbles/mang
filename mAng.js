/* mAng - Quadrant and Radial Slice based fast angle approximation and pooling
	by: Nathaniel D. Gibson
*/
var mAng = {
	table: [1.5, 0, -1.5],	/* slice values for non Infinity, begins at 1, this is n=2 slices */
	infs: [-Infinity, Infinity, Infinity, -Infinity], /* the 0th slice limit for each quadrant */ 
	getSlice: function(vector){
		var x = vector.x, y = vector.y;
		var q = (x <= 0 && y < 0) ? 0: (x < 0 && y >= 0) ? 1: (x >= 0 && y > 0) ? 2: 3;
		var sy = y / x, sx = x / y;
		var I = this.infs[q];
		var R = sy - sx;
		var s = 0;
		if (R != I){
			if (R > 0){
				if (R <= 1.5){
					s = 1;
				}else{
					s = 0;
				}
			}else{
				if (R > -1.5){
					s = 2;
				}else{
					s = 3;
				}
			}
		}
		return [q, s];
	}
}
