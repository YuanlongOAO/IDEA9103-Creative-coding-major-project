/* Based on the Structure of Sample Code 1 from Week 7 “Color Block Redrawing (Center Pixel Sampling)” Version
 Render the image as a 64-grid color block mosaic (without outlines to avoid gaps)
 Boundaries are accumulated using rounding, while center pixels are sampled.
 */


//Need a variable to hold our image
let img;

//Divide the image into segments, this is the number of segments in each dimension
//The total number of segments will be 4096 (64 * 64)
let numSegments = 64;

//Store the segments in an array
let segments = [];

//Load the image from disk
function preload() {
  img = loadImage('Piet_Mondrian Broadway_Boogie_Woogie.jpeg');
}

function setup() {
  //Make the canvas the same size as the image using its properties
  createCanvas(img.width, img.height);

  //Use the width and height of the image to calculate the size of each segment
  let segmentWidth = img.width / numSegments;
  let segmentHeight = img.height / numSegments;

  /*
  Divide the original image into segments, we are going to use nested loops
  first we use a loop to move down the image, 
  we will use the height of the image as the limit of the loop
  then we use a loop to move across the image, 
  we will use the width of the image as the limit of the loop
  Let's look carefully at what happens, the outer loop runs once, so we start at the top of the image
  Then the inner loop runs to completion, moving from left to right across the image
  Then the outer loop runs again, moving down 1 row image, and the inner loop runs again,
  moving all the way from left to right
  */

  //this is looping over the height
  for (let segYPos=0; segYPos<img.height; segYPos+=segmentHeight) {

    //this loops over width
    for (let segXPos=0; segXPos<img.width; segXPos+=segmentWidth) {
      
      //This will create a segment for each x and y position

      // Using the “current floating boundary + rounding” method yields integer pixel boundaries,
      // ensuring the reproduced image remains complete and seamless without gaps
      const segXPos0 = Math.round(segXPos);
      const segYPos0 = Math.round(segYPos);
      const segXPos1 = Math.round(segXPos + segmentWidth);
      const segYPos1 = Math.round(segYPos + segmentHeight);

      //Actual integer size of this block
      const segWidth  = segXPos1 - segXPos0;
      const segHeight  = segYPos1 - segYPos0;

      //If rounding results in width or height being <= 0, skip it
      if (segWidth <= 0 || segHeight <= 0) continue;

      // Find the center pixel of this block
      //Constrain the results within the image boundaries.
      const colorX = Math.min(segXPos0 + Math.floor(segWidth / 2), img.width  - 1);
      const colorY = Math.min(segYPos0 + Math.floor(segHeight / 2), img.height - 1);
      
      //Sample the color at that center pixel. Returns [r, g, b, a].
      const color  = img.get(colorX, colorY);

      //This will create a segment for each x and y position
      let segment = new ImageSegment(segXPos0, segYPos0, segWidth, segHeight, color);

      //Save it for drawing later in draw()
      segments.push(segment);
    }
  }
}

function draw() {
  background(255);//Set background color white

  //Repaint by color block
  for (const segment of segments) {
    segment.draw();
  }
}

//Class for the image segments, we start with the class keyword
class ImageSegment {

  //Give the class a constructor
  constructor(srcImgSegXPosInPrm,srcImgSegYPosInPrm,srcImgSegWidthInPrm,srcImgSegHeightInPrm, fillColorInPrm) {

    //these parameters are used to set the internal properties of an instance of the segment
    //These parameters are named as imageSource as they are derived from the image we are using
    this.srcImgSegXPos = srcImgSegXPosInPrm;
    this.srcImgSegYPos = srcImgSegYPosInPrm;
    this.srcImgSegWidth = srcImgSegWidthInPrm;
    this.srcImgSegHeight = srcImgSegHeightInPrm;

    //Convert the [r,g,b,a] array into a p5 color object, cache it during construction
    //and use it directly in draw()
   this.fillColor = color(
    fillColorInPrm[0],
    fillColorInPrm[1],
    fillColorInPrm[2],
    fillColorInPrm[3]
  );
}

//draw the segment to the canvas
  draw() {
    //Apply the cached fill color
    fill(this.fillColor);

    //Turn off outlines to prevent visible seams
    noStroke();

    //Paint the rectangle for this block
    rect(this.srcImgSegXPos,this.srcImgSegYPos,this.srcImgSegWidth,this.srcImgSegHeight);
  }
}