// Define global variables to control blob properties
let numBlobs = 3; // Number of blobs
let blobSize = 50; // Initial size of the blobs
let minDistance = 200; // Minimum distance between blobs
let noiseOffset = 0; // Initial noise offset
let noiseScale = 0.005; // Initial noise scale
let noiseStrength = 25; // Initial noise strength
let numPoints = 100; // Number of points used to draw each blob
let elasticity = 0.05; // Elasticity coefficient
let pressure = 0.1; // Pressure coefficient

let blobs = []; // Array to store blob objects

function setup()
{
  createCanvas(window.innerWidth, window.innerHeight); // Create a canvas with window width and height
  
  for (let i = 0; i < numBlobs; i++)
  {
    let isOverlapping = true; // Flag to check if a blob is overlapping with another
    let x, y;
    
    // Keep generating random x and y coordinates until no overlap is detected
    while (isOverlapping)
    {
      isOverlapping = false; // Reset overlap flag
      
      // Generate random x and y coordinates within 20% to 80% of the scene's width and height
      x = random((width - blobSize) * 0.2, (width - blobSize) * 0.8);
      y = random((height - blobSize) * 0.2, (height - blobSize) * 0.8);
      
      // Check if the newly generated blob overlaps with any existing blobs or is too close to them
      for (let j = 0; j < blobs.length; j++)
      {
        let distance = dist(x, y, blobs[j].x, blobs[j].y);
        if (distance < (blobSize + minDistance))
        { // Check for overlap or minimum distance
          isOverlapping = true;
          break; // Exit the loop if overlap or insufficient distance is detected
        }
      }
    }
    
    blobs.push(new Jelly(x, y, blobSize, elasticity, noiseScale, noiseStrength)); // Create a new Jelly object with random position and other parameters, and add it to the blobs array
  }
}

function draw()
{
  background(0); // Set background color to black
  
  // Loop through each blob in the blobs array
  for (let i = 0; i < blobs.length; i++)
  {
    blobs[i].display(); // Display each blob
  }
  noiseOffset++; // Increment noise offset for continuous animation
}

// Define the Jelly class to create and display blobs
class Jelly
{
  constructor(x, y, size, elasticity, noiseScale, noiseStrength)
  {
    this.x = x; // x coordinate of the blob's center
    this.y = y; // y coordinate of the blob's center
    this.size = size; // Size of the blob
    this.elasticity = elasticity; // Elasticity coefficient
    this.noiseScale = noiseScale; // Noise scale used for Perlin noise
    this.noiseStrength = noiseStrength; // Noise strength used for Perlin noise
  }
  
  display()
  {
    beginShape(); // Begin drawing the shape of the blob
    // Loop through each point to create the blob shape
    for (let i = 0; i < numPoints; i++)
    {
      let angle = map(i, 0, numPoints, 0, TWO_PI); // Map the angle for each point within a full circle
      let noiseValue = noise((this.x + cos(angle) * this.size) * this.noiseScale, (this.y + sin(angle) * this.size) * this.noiseScale, noiseOffset * this.noiseScale);
      let offset = map(noiseValue, 0, 1, -this.noiseStrength, this.noiseStrength); // Map noise value to offset
      let r = this.size + offset; // Calculate radius for each point
      
      // Calculate elastic forces based on neighboring points
      let elasticForce = createVector(0, 0); // Initialize elastic force vector
      let nextAngle = map((i + 1) % numPoints, 0, numPoints, 0, TWO_PI); // Calculate angle of the next point
      let prevAngle = map((i - 1 + numPoints) % numPoints, 0, numPoints, 0, TWO_PI); // Calculate angle of the previous point
      let nextX = this.x + (r + offset) * cos(nextAngle); // Calculate x coordinate of the next point
      let nextY = this.y + (r + offset) * sin(nextAngle); // Calculate y coordinate of the next point
      let prevX = this.x + (r + offset) * cos(prevAngle); // Calculate x coordinate of the previous point
      let prevY = this.y + (r + offset) * sin(prevAngle); // Calculate y coordinate of the previous point
      let dx1 = nextX - this.x; // Calculate difference in x coordinates with the next point
      let dy1 = nextY - this.y; // Calculate difference in y coordinates with the next point
      let dx2 = prevX - this.x; // Calculate difference in x coordinates with the previous point
      let dy2 = prevY - this.y; // Calculate difference in y coordinates with the previous point
      elasticForce.x += (dx1 + dx2) * this.elasticity; // Update elastic force in x direction
      elasticForce.y += (dy1 + dy2) * this.elasticity; // Update elastic force in y direction
      
      // Apply pressure forces towards the center of the canvas
      let pressureForce = createVector(this.x - width / 2, this.y - height / 2); // Calculate vector towards the center of the canvas
      pressureForce.mult(pressure); // Scale pressure force by pressure coefficient
      
      let x = this.x + r * cos(angle) + elasticForce.x + pressureForce.x; // Calculate final x coordinate for the point
      let y = this.y + r * sin(angle) + elasticForce.y + pressureForce.y; // Calculate final y coordinate for the point
      
      vertex(x, y); // Add vertex to the blob shape
    }
    endShape(CLOSE); // Close the shape of the blob
  }
}
