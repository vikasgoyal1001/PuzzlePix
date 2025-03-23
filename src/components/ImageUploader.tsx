/**
 * ImageUploader Component
 * Created by Vikas Goyal
 * 
 * A modern, user-friendly image upload component with drag-and-drop support
 * and visual feedback. I've added some personal touches to make it more
 * engaging and intuitive.
 */

import { useCallback, useState } from 'react'
import styled from 'styled-components'

// Styled components with my preferred aesthetic
const UploadContainer = styled.div<{ isDragging: boolean }>`
  width: 100%;
  max-width: 500px;
  height: 300px;
  border: ${props => props.isDragging ? '2px dashed #4a90e2' : '2px dashed #ccc'};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.isDragging ? '#f0f7ff' : 'white'};
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    height: 250px;
    padding: 15px;
  }

  @media (max-width: 480px) {
    height: 200px;
    padding: 10px;
  }

  &:hover {
    border-color: #4a90e2;
    background-color: #f8f8f8;
    transform: translateY(-2px);
  }
`

const UploadText = styled.p`
  margin: 10px 0;
  color: #666;
  font-size: 1.2em;
  text-align: center;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 1.1em;
  }

  @media (max-width: 480px) {
    font-size: 1em;
    margin: 8px 0;
  }
`

const UploadIcon = styled.div`
  font-size: 3em;
  color: #4a90e2;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    font-size: 2.5em;
    margin-bottom: 12px;
  }

  @media (max-width: 480px) {
    font-size: 2em;
    margin-bottom: 10px;
  }
`

const SupportedFormats = styled.p`
  font-size: 0.9em;
  color: #999;
  margin-top: 10px;
  text-align: center;

  @media (max-width: 480px) {
    font-size: 0.8em;
    margin-top: 8px;
  }
`

const ErrorMessage = styled.p`
  color: #ff4444;
  margin-top: 10px;
  font-size: 0.9em;
  text-align: center;
  max-width: 100%;
  padding: 0 10px;

  @media (max-width: 480px) {
    font-size: 0.8em;
    margin-top: 8px;
  }
`

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void
}

const ImageUploader = ({ onImageUpload }: ImageUploaderProps) => {
  // Added state for drag feedback and error handling
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateAndProcessFile = (file: File) => {
    setError(null)
    
    // Some basic file validation
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        onImageUpload(event.target.result as string)
      }
    }
    reader.onerror = () => {
      setError('Error reading the file')
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      validateAndProcessFile(file)
    }
  }, [onImageUpload])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      validateAndProcessFile(file)
    }
  }, [onImageUpload])

  return (
    <>
      <UploadContainer
        isDragging={isDragging}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <UploadIcon>📸</UploadIcon>
        <UploadText>
          {isDragging 
            ? "Drop your image here!"
            : "Drag and drop an image here, or click to select"}
        </UploadText>
        <input
          type="file"
          id="file-input"
          accept="image/*"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />
        <SupportedFormats>
          Supported formats: JPG, PNG, GIF (max 5MB)
        </SupportedFormats>
      </UploadContainer>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </>
  )
}

export default ImageUploader 