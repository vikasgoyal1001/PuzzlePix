/**
 * PuzzlePix - A fun image puzzle game
 * Created by Vikas Goyal
 * Last updated: March 2025
 * 
 * This is my take on a classic puzzle game with a modern twist.
 * Feel free to use and modify, but please keep the attribution!
 */

import { useState, useRef } from 'react'
import styled from 'styled-components'
import ImageUploader from './components/ImageUploader'
import PuzzleBoard from './components/PuzzleBoard'

// TODO: Add difficulty levels in the future
// const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard']

// Styled components for a clean and modern UI
const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f0f2f5; // Soft background that's easy on the eyes
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

  @media (max-width: 768px) {
    padding: 10px;
  }
`

const Title = styled.h1`
  color: #1a1a1a;
  margin-bottom: 30px;
  text-align: center;
  font-size: 2.5em;
  font-weight: 600;
  
  // Adding a subtle text shadow for depth
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    font-size: 2em;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    font-size: 1.8em;
    margin-bottom: 15px;
  }
`

const StartButton = styled.button`
  padding: 12px 24px;
  font-size: 1.1em;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 20px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: auto;
  min-width: 200px;

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 1em;
    min-width: 180px;
  }

  @media (max-width: 480px) {
    width: 100%;
    max-width: 300px;
  }

  &:hover {
    background-color: #357abd;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`

// Main App component
function App() {
  // State management
  const [image, setImage] = useState<string | null>(null)
  const [puzzlePieces, setPuzzlePieces] = useState<string[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  
  // Refs for canvas and tracking original piece order
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const originalPiecesRef = useRef<string[]>([])

  // Constants for puzzle dimensions
  const PUZZLE_SIZE = 600 // Fixed size for the puzzle board
  const GRID_SIZE = 3 // 3x3 grid

  // Handler for when a new image is uploaded
  const handleImageUpload = (imageUrl: string) => {
    setImage(imageUrl)
    setIsPlaying(false)
    setPuzzlePieces([])
  }

  // Initialize the puzzle game
  const startPuzzle = () => {
    if (!image) return
    
    const img = new Image()
    img.src = image
    img.onload = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Calculate the aspect ratio
      const aspectRatio = img.width / img.height

      // Set canvas dimensions based on aspect ratio
      let scaledWidth, scaledHeight
      if (aspectRatio > 1) {
        // Landscape image
        scaledWidth = PUZZLE_SIZE
        scaledHeight = PUZZLE_SIZE / aspectRatio
      } else {
        // Portrait or square image
        scaledHeight = PUZZLE_SIZE
        scaledWidth = PUZZLE_SIZE * aspectRatio
      }

      // Set canvas dimensions
      canvas.width = scaledWidth
      canvas.height = scaledHeight

      // Clear and draw the image
      ctx.clearRect(0, 0, scaledWidth, scaledHeight)
      ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight)

      // Calculate piece dimensions
      const pieceWidth = scaledWidth / GRID_SIZE
      const pieceHeight = scaledHeight / GRID_SIZE

      // Create individual puzzle pieces
      const pieces: string[] = []
      for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
          const pieceCanvas = document.createElement('canvas')
          pieceCanvas.width = pieceWidth
          pieceCanvas.height = pieceHeight
          const pieceCtx = pieceCanvas.getContext('2d')
          
          if (pieceCtx) {
            pieceCtx.drawImage(
              canvas,
              x * pieceWidth,
              y * pieceHeight,
              pieceWidth,
              pieceHeight,
              0,
              0,
              pieceWidth,
              pieceHeight
            )
            pieces.push(pieceCanvas.toDataURL())
          }
        }
      }

      // Save the original configuration and aspect ratio
      originalPiecesRef.current = [...pieces]
      setPuzzlePieces(shufflePieces(pieces))
      setIsPlaying(true)
    }
  }

  // Helper function to shuffle pieces
  const shufflePieces = (pieces: string[]) => {
    const shuffled = [...pieces]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  return (
    <AppContainer>
      <Title>PuzzlePix</Title>
      {!isPlaying ? (
        <ImageUploader onImageUpload={handleImageUpload} />
      ) : (
        <PuzzleBoard 
          pieces={puzzlePieces} 
          originalImage={image}
          originalPieces={originalPiecesRef.current}
        />
      )}
      {image && !isPlaying && (
        <StartButton onClick={startPuzzle}>Start the Challenge!</StartButton>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </AppContainer>
  )
}

export default App 