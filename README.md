# mAng JS

Approximate Angles of any vector using it's quadrant and a radial slice index.  Useful for rotation invariant indexing of a dynamic stream of x/y points. For instance, in creating pooled rotation-scale-translation invariant histograms.

One of the biggest challenges in creating a rotation invariant categorizer for video streams is the fact that trigonometric functions take so long to process.

## Usage

``` javascript
mAng.getSlice({x: 30, y: -14});
```

outputs
		
    [3, 0]
		
schema
		
    [quadrant, radial slice]
		
quadrant and radial slice each can equal 0 - 3

## Speed

Velocity of n=2 table approximation with an AMD 1.8Ghz quad-core

  361 points in 4 milliseconds
  90.25 angle calculations per millisecond
  or 90,250 angle approximations calculated per second

## How it Works

mAng gives you an indexed output of 1 of possible 4 quadrants and 1 of possible 4 radial slices inside of that quadrant that your vector angle belongs to.  This is done by making an x/y square grid with a center of 0, and a lower bound of -2 and higher bound of 2 (can be called an n=2 grid), then tracing each point along the square's circumference clockwise from (-2, -2) to (-2, 2) to (2, 2) to (2, -2) and back to the beginning.  You will end up with the following x,y points from the graph below in that order.  For each point, calculate y/x and then calculate x/y.  Take the difference of y/x and x/y and we will call that S... so S = y/x - x/y.  Now if you look at this in a chart format, you will notice that S (or the difference of slope to inverse slope) follows a pattern which repeats exactly 4 times.

| x, y | y/x | x/y | S | index | description |
| --- | --- | --- | --- | --- | --- |
| -2, -2 | 1 | 1 | 0 | 2 | bottom left corner |
| -2, -1 | 0.5 | 2 | -1.5 | 3 | |
| -2, 0 | 0 | -Infinity | Infinity | 0 | left horizontal |
| -2, 1 | -0.5 | -2 | 1.5 | 1 | |
| -2, 2 | -1 | -1 | 0 | 2 | top left corner |
| -1, 2 | -2 | -0.5 | -1.5 | 3 | |
| 0, 2 | Infinity | 0 | Infinity | 0 | top vertical |
| 1, 2 | 2 | 0.5 | 1.5 | 1 | |
| 2, 2 | 1 | 1 | 0 | 2 | top right corner |
| 2, 1 | 0.5 | 2 | -1.5 | 3 | | 
| 2, 0 | 0 | Infinity | -Infinity | 0 | right horizontal |
| 2, -1 | -0.5 | -2 | 1.5 | 1 | |
| 2, -2 | -1 | -1 | 0 | 2 | bottom right corner |
| 1, -2 | -2 | -0.5 | -1.5 | 3 | |
| 0, -2 | -Infinity | 0 | -Infinity | 0 | bottom vertical |
| -1, -2 | 2 | 0.5 | 1.5 | 1 | |

Whenever S is equal to -Infinity or +Infinity, that represents the edge of our square, or a line that is 100% horizontal or vertical to our grid (up, down, left, and right).  Thus, in a clockwise fashion, -Infinity or +Infinity represent the first angle in each quadrant of the grid, while after this each following S value is perfectly sorted from maximum to minimum value passing through 0. Whenever S=0, that means the point is on a corner of the gird.  In the case of n=2, one quadrant's S values for each radial slice starting point are +/-Infinity, 1.5, 0, -1.5. The only thing that changes is the polarity of Infinity, so if +/- infinity = slice index 0's marker.  Then any S above 1.5 is in slice 0, any slice lower than 1.5 but above 0 is in slice 1, 0 to -1.5 is slice 2, and less than -1.5 is in slice 3.

In order to make mAng quick, I just took the S values from a n=2 grid and made them be the cutoff points.  To deal with Infinity being either negative or positive for the x = 0 and y = 0 vectors, I made a 4 entry infinity lookup table where in quadrant 0, infinity is negative, in q1 and q2 it's positive and in q3 it's negative again.  Then it's just a simple matter of logic.  Adding the quadrant to the slice, you get an angle approximation within 22.5 degrees (or 16 radial slices of a circle).

## Better Resolution

If you want finer angular slices, you would need to up the value of n.  I have n=2 hardcoded currently into the mAng library, but with a bit of work, it could be changed to be arbitrary.  A good example would be doing an n=3 grid to calculate the S barrier values. In the case of n=3, the values are +/-Infinity, 2.66, 0.833, 0, -0.833, -2.66.  This means that Each slice represents a 15 degree angular slice.

## Proof Test

I took the standard sin(x), cos(x) way of drawing a circle and looked up the slice index of each ...

``` javascript
var r = 180;
for (x=0;x<=6.283;x+=0.333333) 
  console.log(mAng.getSlice({
    y:(Math.cos(x) * r),
    x: (Math.sin(x) * r)
  }));
```
The result is an ordered sequence of q,r values
