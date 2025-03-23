/**
 * PuzzleBoard Component
 * Created by Vikas Goyal
 * 
 * A modern, interactive puzzle board with drag-and-drop functionality,
 * hints system, and visual feedback. I've added some personal touches
 * to make the game more engaging and fun to play.
 */

import { useState, useEffect } from 'react'
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

  @media (max-width: 768px) {
    padding: 10px;
    gap: 15px;
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
    gap: 20px;
  }

  @media (max-width: 480px) {
    gap: 15px;
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

  @media (max-width: 768px) {
    &:hover {
      transform: none;
    }
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

  @media (max-width: 768px) {
    font-size: 1.3em;
    margin-bottom: 12px;
  }

  @media (max-width: 480px) {
    font-size: 1.2em;
    margin-bottom: 10px;
  }
`

const BoardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  background-color: #333;
  padding: 1px;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  aspect-ratio: auto;
  margin: 0 auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  @media (max-width: 480px) {
    padding: 1px;
    border-radius: 8px;
  }
`

const OriginalImageContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid #333;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
  
  &:hover {
    transform: scale(1.02);
  }
`

const OriginalImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  display: block;
  object-fit: contain;
`

// Enhanced puzzle piece styling with better visual feedback
const PuzzlePiece = styled.div<{ isDragging: boolean; isCorrect: boolean }>`
  aspect-ratio: auto;
  width: 100%;
  height: 100%;
  background-color: ${props => 
    props.isDragging ? '#4a90e2' : '#fff'};
  cursor: grab;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  border: ${props => 
    props.isCorrect ? '3px solid #4CAF50' : 
    '1px solid #333'};
  border-radius: 0;
  box-shadow: ${props => 
    props.isDragging ? '0 8px 16px rgba(0, 0, 0, 0.2)' : 
    props.isCorrect ? '0 4px 12px rgba(76, 175, 80, 0.3)' : 
    'none'};
  
  &:hover {
    transform: ${props => props.isDragging ? 'scale(1.05)' : 'scale(1.02)'};
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.15);
    z-index: 1;
  }

  &:active {
    cursor: grabbing;
    transform: scale(1.05);
    z-index: 2;
  }

  @media (hover: none) {
    &:hover {
      transform: none;
    }
  }
`

const PieceImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
  display: block;
  background-color: #f0f2f5;
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
  flex-wrap: wrap;

  @media (max-width: 768px) {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    border-radius: 16px 16px 0 0;
    padding: 15px;
    margin: 0;
  }

  @media (max-width: 480px) {
    padding: 10px;
    gap: 10px;
  }
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
  min-width: 120px;

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 0.9em;
    min-width: 100px;
  }

  @media (max-width: 480px) {
    padding: 8px 16px;
    font-size: 0.85em;
    min-width: 90px;
  }

  &:hover {
    background-color: ${props => props.variant === 'secondary' ? '#d32f2f' : '#357abd'};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  @media (hover: none) {
    &:hover {
      transform: none;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
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
  text-align: center;
  font-size: 1.2em;
  font-weight: 500;
  padding: 20px;
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
  margin-bottom: 20px;
  border: 1px solid ${props => {
    switch (props.type) {
      case 'success': return '#a5d6a7';
      case 'warning': return '#ef9a9a';
      case 'info': return '#90caf9';
    }
  }};

  @media (max-width: 768px) {
    font-size: 1.1em;
    padding: 15px;
  }
`

const HintContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  animation: slideIn 0.3s ease;

  @media (max-width: 768px) {
    gap: 10px;
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
  
  @media (max-width: 768px) {
    font-size: 0.95em;
    padding: 12px 16px;
  }

  @media (max-width: 480px) {
    font-size: 0.9em;
    padding: 10px 14px;
  }

  &:hover {
    transform: translateX(5px);
    transition: transform 0.2s ease;
  }

  @media (hover: none) {
    &:hover {
      transform: none;
    }
  }
`

// Add these new styled components after the existing styled components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
`

const ModalContent = styled.div`
  background: white;
  padding: 25px;
  border-radius: 16px;
  max-width: 90%;
  width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease;

  @keyframes slideIn {
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @media (max-width: 768px) {
    padding: 20px;
    width: 90%;
  }
`

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 5px;
  line-height: 1;
  
  &:hover {
    color: #333;
  }
`

// Modal component
const Modal = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        {children}
      </ModalContent>
    </ModalOverlay>
  );
};

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
  const [currentPieces, setCurrentPieces] = useState(pieces)
  const [draggedPiece, setDraggedPiece] = useState<number | null>(null)
  const [correctPieces, setCorrectPieces] = useState<boolean[]>(Array(pieces.length).fill(false))
  const [showVerification, setShowVerification] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [moves, setMoves] = useState(0)
  const [gameStartTime, setGameStartTime] = useState<Date | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(null)

  // Reset game state when pieces change
  useEffect(() => {
    setCurrentPieces(pieces)
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
    
    if (complete && gameStartTime) {
      const endTime = new Date()
      const timeTaken = Math.floor((endTime.getTime() - gameStartTime.getTime()) / 1000)
      console.log(`Puzzle completed in ${moves} moves and ${timeTaken} seconds!`)
    }
  }

  const resetPuzzle = () => {
    setCurrentPieces(pieces)
    setCorrectPieces(new Array(pieces.length).fill(false))
    setMoves(0)
    setGameStartTime(new Date())
  }

  const verifyPuzzle = () => {
    setShowVerification(true)
    setShowHints(false)
    
    // Calculate correct pieces first
    const newCorrectPieces = currentPieces.map((piece, i) => piece === originalPieces[i])
    const correctCount = newCorrectPieces.filter(Boolean).length
    
    // Update state with the new correct pieces
    setCorrectPieces(newCorrectPieces)
    const complete = newCorrectPieces.every(isCorrect => isCorrect)
    
    // Set modal content with the accurate count
    const content = complete ? (
      <Message type="success">
        🎉 Congratulations! You've completed the puzzle in {moves} moves!
      </Message>
    ) : (
      <Message type="info">
        Keep going! You've got {correctCount} pieces in the right place.
      </Message>
    )
    
    setModalContent(content)
    setShowModal(true)
  }

  const toggleHints = () => {
    if (!showHints) {
      // Calculate correct pieces first
      const newCorrectPieces = currentPieces.map((piece, i) => piece === originalPieces[i])
      setCorrectPieces(newCorrectPieces)
      
      const hints = getHints(newCorrectPieces)
      setModalContent(
        <HintContainer>
          {hints.map((hint, index) => (
            <HintText key={index}>{hint}</HintText>
          ))}
        </HintContainer>
      )
      setShowModal(true)
    }
    setShowHints(!showHints)
    setShowVerification(false)
  }

  // Updated helper function to get hints based on current state
  const getHints = (currentCorrectPieces: boolean[]) => {
    const hints = []
    let correctCount = currentCorrectPieces.filter(Boolean).length

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
          Show Hints
        </Button>
      </Controls>

      {showModal && modalContent && (
        <Modal onClose={() => setShowModal(false)}>
          {modalContent}
        </Modal>
      )}
    </GameContainer>
  )
}

export default PuzzleBoard 