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
`

const Title = styled.h1`
  color: #1a1a1a;
  margin-bottom: 30px;
  text-align: center;
  font-size: 2.5em;
  font-weight: 600;
  
  // Adding a subtle text shadow for depth
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
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

      // Set canvas dimensions to match the image
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      // Split the image into a 3x3 grid
      // Note: In the future, this could be adjustable based on difficulty
      const pieces: string[] = []
      const pieceWidth = img.width / 3
      const pieceHeight = img.height / 3

      // Create individual puzzle pieces
      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
          const pieceCanvas = document.createElement('canvas')
          pieceCanvas.width = pieceWidth
          pieceCanvas.height = pieceHeight
          const pieceCtx = pieceCanvas.getContext('2d')
          
          if (pieceCtx) {
            // Extract piece from main image
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

      // Save the original configuration
      originalPiecesRef.current = [...pieces]

      // Shuffle pieces using Fisher-Yates algorithm
      const shuffledPieces = [...pieces]
      for (let i = shuffledPieces.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffledPieces[i], shuffledPieces[j]] = [shuffledPieces[j], shuffledPieces[i]]
      }

      setPuzzlePieces(shuffledPieces)
      setIsPlaying(true)
    }
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