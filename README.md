# PuzzlePix - Interactive Image Puzzle Game

A modern, interactive puzzle game created by Vikas Goyal where users can upload their own images and solve them as puzzles.

## Features

- Drag-and-drop puzzle interface
- Custom image upload support
- Progress tracking
- Hint system
- Responsive design
- Modern UI with smooth animations

## Development

To run the project locally:

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Deployment

This project is deployed on Netlify. To deploy your own instance:

1. Fork this repository
2. Sign up on [Netlify](https://www.netlify.com/)
3. Click "New site from Git"
4. Choose your forked repository
5. Deploy settings will be automatically configured by netlify.toml

## Build

To build the project:

```bash
npm run build
```

The build output will be in the `dist` directory.

## Technologies Used

- React
- TypeScript
- Vite
- Styled Components
- Netlify for hosting

## Installation and Setup

### Local Development
1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd image-puzzle-game
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser

## How to Play

### Getting Started
1. Open the game in your web browser
2. Click on the upload area or drag and drop an image to start
3. Once your image is uploaded, click "Start Puzzle" to begin

[Screenshot: Upload area with drag-and-drop zone]

### Playing the Game
1. **Moving Pieces**
   - Click and drag any puzzle piece to move it
   - Drop it on another piece to swap their positions
   - The pieces will automatically swap places when you drop

[Screenshot: Game interface showing puzzle pieces and original image]

2. **Game Interface**
   - Left side: Your puzzle in progress
   - Right side: Original image for reference
   - Both images are sized equally for easy comparison

### Game Controls
The control buttons are always visible at the bottom of the screen:

- **Reset Puzzle**: Start over with the same image
- **Check Solution**: Verify if your puzzle is correctly solved
- **Show/Hide Hints**: Get help with solving the puzzle

[Screenshot: Control buttons at the bottom of the screen]

### Hints System
1. First, click "Check Solution" to verify your progress
2. If the puzzle isn't complete, you can:
   - Click "Show Hints" to see detailed feedback
   - The hints will tell you:
     - How many pieces are in the correct position
     - Which specific pieces are correctly placed
   - Click "Hide Hints" to remove the hints

[Screenshot: Hints display showing piece positions]

### Tips for Solving
1. Start with the corner pieces
2. Use the original image as a reference
3. Look for distinct patterns or colors that should be connected
4. Use the hint system if you get stuck

### Image Selection Tips
1. **Best Types of Images**
   - Images with distinct colors and patterns
   - Photos with clear subjects or landmarks
   - Images with good contrast
   - Recommended size: 600x600 pixels or larger

2. **Avoid These Images**
   - Very dark or monochrome images
   - Images with repetitive patterns
   - Blurry or low-resolution photos
   - Images with very subtle color transitions

3. **Optimal Image Characteristics**
   - Clear edges and boundaries
   - Mix of colors or patterns
   - Recognizable features in each section
   - Good lighting and contrast

### Responsive Design
- The game works on both desktop and mobile devices
- On smaller screens, the puzzle and reference image will stack vertically

[Screenshot: Mobile view of the game interface]

## Technical Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Touch screen or mouse for drag and drop functionality

## Technical Details
- Built with React and TypeScript
- Uses Vite for fast development and building
- Styled with styled-components
- Implements HTML5 Drag and Drop API
- Canvas API for image processing
- Responsive design using CSS Grid and Flexbox

## Troubleshooting
- If pieces aren't dragging, ensure your browser supports drag and drop
- If the image doesn't upload, check if it's in a supported format (JPG, PNG, GIF)
- For the best experience, use images with clear, distinct features

### Common Issues and Solutions
1. **Image Upload Issues**
   - Maximum file size: 5MB
   - Supported formats: JPG, PNG, GIF
   - Try reducing image size if upload fails

2. **Performance Issues**
   - Clear browser cache
   - Refresh the page
   - Use smaller image sizes for better performance

3. **Display Issues**
   - Enable JavaScript
   - Use a modern browser
   - Check screen resolution settings

## Contributing
We welcome contributions! Please feel free to submit a Pull Request.

Enjoy playing the Image Puzzle Game! 