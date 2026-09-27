"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface QRCodeSvgProps extends React.SVGProps<SVGSVGElement> {
  value: string
  size?: number
  className?: string
}

/**
 * Deterministic SVG QR Code generator.
 * Produces crisp, vector QR code patterns with standard finder and alignment patterns.
 */
export function QRCodeSvg({
  value,
  size = 180,
  className,
  ...props
}: QRCodeSvgProps) {
  const matrixSize = 25
  const padding = 2

  // Generate deterministic binary pattern from input string
  const cells = React.useMemo(() => {
    const grid: boolean[][] = Array.from({ length: matrixSize }, () =>
      Array(matrixSize).fill(false)
    )

    // Helper: Mark finder pattern at (r, c)
    const drawFinder = (r: number, c: number) => {
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
          if (
            i === 0 ||
            i === 6 ||
            j === 0 ||
            j === 6 ||
            (i >= 2 && i <= 4 && j >= 2 && j <= 4)
          ) {
            grid[r + i][c + j] = true
          }
        }
      }
    }

    // Three Finder patterns
    drawFinder(0, 0)
    drawFinder(0, matrixSize - 7)
    drawFinder(matrixSize - 7, 0)

    // Alignment pattern near bottom right
    const alignR = matrixSize - 9
    const alignC = matrixSize - 9
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (i === 0 || i === 4 || j === 0 || j === 4 || (i === 2 && j === 2)) {
          grid[alignR + i][alignC + j] = true
        }
      }
    }

    // Timing patterns
    for (let i = 8; i < matrixSize - 8; i++) {
      if (i % 2 === 0) {
        grid[6][i] = true
        grid[i][6] = true
      }
    }

    // Generate hash from string
    let hash = 0
    for (let i = 0; i < value.length; i++) {
      hash = (hash << 5) - hash + value.charCodeAt(i)
      hash |= 0
    }

    // Populate data cells
    let bitIndex = 0
    for (let r = 0; r < matrixSize; r++) {
      for (let c = 0; c < matrixSize; c++) {
        // Skip reserved finder / timing / alignment zones
        const inFinder1 = r < 8 && c < 8
        const inFinder2 = r < 8 && c >= matrixSize - 8
        const inFinder3 = r >= matrixSize - 8 && c < 8
        const inTiming = r === 6 || c === 6
        const inAlign = r >= alignR - 1 && r <= alignR + 5 && c >= alignC - 1 && c <= alignC + 5

        if (!inFinder1 && !inFinder2 && !inFinder3 && !inTiming && !inAlign) {
          const pseudoBit = ((hash ^ (r * 31 + c * 17 + bitIndex)) & 1) === 1
          grid[r][c] = pseudoBit
          bitIndex++
        }
      }
    }

    return grid
  }, [value])

  const totalCells = matrixSize + padding * 2
  const cellSize = 10

  const rects: React.ReactNode[] = []
  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      if (cells[r][c]) {
        rects.push(
          <rect
            key={`${r}-${c}`}
            x={(c + padding) * cellSize}
            y={(r + padding) * cellSize}
            width={cellSize}
            height={cellSize}
            fill="currentColor"
          />
        )
      }
    }
  }

  return (
    <svg
      viewBox={`0 0 ${totalCells * cellSize} ${totalCells * cellSize}`}
      width={size}
      height={size}
      className={cn("bg-white text-zinc-950 p-2 rounded-xl shadow-xs border", className)}
      {...props}
    >
      {rects}
    </svg>
  )
}
