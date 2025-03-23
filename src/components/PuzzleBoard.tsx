/**
 * PuzzleBoard Component
 * Created by Vikas Goyal
 * 
 * A modern, interactive puzzle board with drag-and-drop functionality,
 * hints system, and visual feedback. I've added some personal touches
 * to make the game more engaging and fun to play.
 */

import { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'

// Styled components with my preferred modern aesthetic
const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  
  // Adding a subtle animation on mount
  animation: fadeIn 0.5s ease;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`

const BoardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  width: 100%;
  align-items: start;
  justify-content: center;

  // Responsive design for smaller screens
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    max-width: 600px;
  }
`

const BoardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  
  // Adding a subtle hover effect
  &:hover {
    transform: translateY(-2px);
    transition: transform 0.3s ease;
  }
`

const BoardTitle = styled.h3`
  margin-bottom: 15px;
  color: #333;
  font-size: 1.5em;
  text-align: center;
  font-weight: 600;
  
  // Adding a subtle text shadow
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
`

const BoardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
  background-color: #333;
  padding: 2px;
  border-radius: 12px;
  width: 100%;
  aspect-ratio: 1;
  
  // Adding a subtle shadow
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`

const OriginalImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid #333;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
  }
`

const OriginalImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

// Enhanced puzzle piece styling with better visual feedback
const PuzzlePiece = styled.div<{ isDragging: boolean; isCorrect: boolean }>`
  aspect-ratio: 1;
  background-color: ${props => 
    props.isDragging ? '#4a90e2' : 
    props.isCorrect ? '#4CAF50' : '#fff'};
  cursor: grab;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  border: 2px solid ${props => props.isCorrect ? '#4CAF50' : 'transparent'};
  border-radius: 8px;
  box-shadow: ${props => 
    props.isDragging ? '0 8px 16px rgba(0, 0, 0, 0.2)' : 
    props.isCorrect ? '0 4px 12px rgba(76, 175, 80, 0.2)' : 
    '0 2px 8px rgba(0, 0, 0, 0.1)'};
  
  &:hover {
    transform: ${props => props.isDragging ? 'scale(1.05)' : 'scale(1.02)'};
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.15);
  }

  &:active {
    cursor: grabbing;
    transform: scale(1.05);
  }
`

const PieceImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
  border-radius: 6px;
`

// Floating controls with glass effect
const Controls = styled.div`
  position: sticky;
  bottom: 20px;
  display: flex;
  gap: 15px;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 100;
  justify-content: center;
  width: fit-content;
  margin: 20px auto;
  border: 1px solid rgba(255, 255, 255, 0.2);
`

// Enhanced button styling
const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  background-color: ${props => props.variant === 'secondary' ? '#f44336' : '#4a90e2'};
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1em;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: ${props => props.variant === 'secondary' ? '#d32f2f' : '#357abd'};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`

// Enhanced message styling
const Message = styled.div<{ type: 'success' | 'warning' | 'info' }>`
  margin-top: 20px;
  text-align: center;
  font-size: 1.2em;
  font-weight: 500;
  padding: 20px 30px;
  border-radius: 12px;
  background-color: ${props => {
    switch (props.type) {
      case 'success': return '#e8f5e9';
      case 'warning': return '#ffebee';
      case 'info': return '#e3f2fd';
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'success': return '#2e7d32';
      case 'warning': return '#c62828';
      case 'info': return '#1565c0';
    }
  }};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid ${props => {
    switch (props.type) {
      case 'success': return '#a5d6a7';
      case 'warning': return '#ef9a9a';
      case 'info': return '#90caf9';
    }
  }};
`

const HintContainer = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 600px;
  animation: slideIn 0.3s ease;
  
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`

const HintText = styled.div`
  font-size: 1em;
  color: #666;
  background-color: #f8f9fa;
  padding: 15px 20px;
  border-radius: 8px;
  border-left: 4px solid #4a90e2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  &:hover {
    transform: translateX(5px);
    transition: transform 0.2s ease;
  }
`

interface PuzzleBoardProps {
  pieces: string[]
  originalImage: string | null
  originalPieces: string[]
}

/**
 * The main puzzle board component that handles the game logic and UI.
 * I've added some personal touches like smooth animations, helpful
 * feedback messages, and a smart hint system to make the game more
 * enjoyable.
 */
const PuzzleBoard = ({ pieces, originalImage, originalPieces }: PuzzleBoardProps) => {
  // State management
  const [currentPieces, setCurrentPieces] = useState<string[]>(pieces)
  const [isComplete, setIsComplete] = useState(false)
  const [draggedPiece, setDraggedPiece] = useState<number | null>(null)
  const [showVerification, setShowVerification] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [correctPieces, setCorrectPieces] = useState<boolean[]>([])
  const [moves, setMoves] = useState(0)
  const [gameStartTime, setGameStartTime] = useState<Date | null>(null)
  const hintsRef = useRef<HTMLDivElement>(null)

  // Reset game state when pieces change
  useEffect(() => {
    setCurrentPieces(pieces)
    setIsComplete(false)
    setShowVerification(false)
    setShowHints(false)
    setCorrectPieces(new Array(pieces.length).fill(false))
    setMoves(0)
    setGameStartTime(new Date())
  }, [pieces])

  // Drag and drop handlers with smooth animations
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    if (!gameStartTime) setGameStartTime(new Date())
    setDraggedPiece(index)
    e.currentTarget.style.opacity = '0.5'
    e.currentTarget.style.transform = 'scale(1.05)'
    e.dataTransfer.setData('text/plain', index.toString())
  }

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.opacity = '1'
    e.currentTarget.style.transform = 'none'
    setDraggedPiece(null)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.style.transform = 'scale(1.02)'
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'none'
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault()
    e.currentTarget.style.transform = 'none'
    
    if (draggedPiece === null) return

    const newPieces = [...currentPieces]
    const temp = newPieces[draggedPiece]
    newPieces[draggedPiece] = newPieces[dropIndex]
    newPieces[dropIndex] = temp
    setCurrentPieces(newPieces)
    setMoves(moves + 1)

    if (showVerification) {
      checkPieces(newPieces)
    }
  }

  // Game logic functions
  const checkPieces = (pieces: string[]) => {
    const newCorrectPieces = pieces.map((piece, i) => piece === originalPieces[i])
    setCorrectPieces(newCorrectPieces)
    const complete = newCorrectPieces.every(isCorrect => isCorrect)
    setIsComplete(complete)
    
    if (complete && gameStartTime) {
      const endTime = new Date()
      const timeTaken = Math.floor((endTime.getTime() - gameStartTime.getTime()) / 1000)
      console.log(`Puzzle completed in ${moves} moves and ${timeTaken} seconds!`)
    }
  }

  const resetPuzzle = () => {
    setCurrentPieces(pieces)
    setIsComplete(false)
    setShowVerification(false)
    setShowHints(false)
    setCorrectPieces(new Array(pieces.length).fill(false))
    setMoves(0)
    setGameStartTime(new Date())
  }

  const verifyPuzzle = () => {
    setShowVerification(true)
    setShowHints(false)
    checkPieces(currentPieces)
  }

  const toggleHints = () => {
    if (!showHints) {
      checkPieces(currentPieces)
    }
    setShowHints(!showHints)
    setShowVerification(false)
  }

  // Helper function to get hints based on current state
  const getHints = () => {
    const hints = []
    let correctCount = correctPieces.filter(Boolean).length

    if (correctCount === 0) {
      hints.push("Try starting with the corner pieces - they're easier to identify!")
    } else if (correctCount < 3) {
      hints.push("Look for distinctive patterns or colors that should be adjacent.")
    } else if (correctCount < 6) {
      hints.push("You're doing great! Focus on completing one row or column at a time.")
    } else {
      hints.push("Almost there! Check if any similar-looking pieces might be swapped.")
    }

    return hints
  }

  return (
    <GameContainer>
      <BoardsContainer>
        <BoardWrapper>
          <BoardTitle>Original Image</BoardTitle>
          <OriginalImageContainer>
            {originalImage && <OriginalImage src={originalImage} alt="Original" />}
          </OriginalImageContainer>
        </BoardWrapper>
        
        <BoardWrapper>
          <BoardTitle>Puzzle Board</BoardTitle>
          <BoardContainer>
            {currentPieces.map((piece, index) => (
              <PuzzlePiece
                key={index}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                isDragging={draggedPiece === index}
                isCorrect={showVerification && correctPieces[index]}
              >
                <PieceImage src={piece} alt={`Piece ${index + 1}`} />
              </PuzzlePiece>
            ))}
          </BoardContainer>
        </BoardWrapper>
      </BoardsContainer>

      <Controls>
        <Button onClick={resetPuzzle} variant="secondary">
          Reset Puzzle
        </Button>
        <Button onClick={verifyPuzzle}>
          Check Progress
        </Button>
        <Button onClick={toggleHints}>
          {showHints ? 'Hide Hints' : 'Show Hints'}
        </Button>
      </Controls>

      {isComplete && (
        <Message type="success">
          🎉 Congratulations! You've completed the puzzle in {moves} moves!
        </Message>
      )}
      
      {showVerification && !isComplete && (
        <Message type="info">
          Keep going! You've got {correctPieces.filter(Boolean).length} pieces in the right place.
        </Message>
      )}

      {showHints && (
        <HintContainer ref={hintsRef}>
          {getHints().map((hint, index) => (
            <HintText key={index}>{hint}</HintText>
          ))}
        </HintContainer>
      )}
    </GameContainer>
  )
}

export default PuzzleBoard 