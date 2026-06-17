import type { Request, Response, NextFunction } from 'express'
import { sensitiveWords } from '../data/mockData.js'

export function filterSensitiveContent(text: string): { filtered: string; hasSensitive: boolean; foundWords: string[] } {
  let filtered = text
  const foundWords: string[] = []

  for (const word of sensitiveWords) {
    const regex = new RegExp(word, 'gi')
    if (regex.test(text)) {
      foundWords.push(word)
      filtered = filtered.replace(regex, '*'.repeat(word.length))
    }
  }

  return {
    filtered,
    hasSensitive: foundWords.length > 0,
    foundWords
  }
}

export function sensitiveContentFilter(req: Request, res: Response, next: NextFunction): void {
  if (req.body) {
    const fieldsToCheck = ['content', 'title', 'comment', 'text']
    
    for (const field of fieldsToCheck) {
      if (req.body[field] && typeof req.body[field] === 'string') {
        const { filtered, hasSensitive, foundWords } = filterSensitiveContent(req.body[field])
        
        if (hasSensitive) {
          res.status(400).json({
            success: false,
            error: '内容包含敏感词，请修改后重新提交',
            details: {
              foundWords,
              suggestion: filtered
            }
          })
          return
        }
      }
    }
  }
  
  next()
}

export function checkSensitiveContent(req: Request, res: Response): void {
  const { text } = req.body
  
  if (!text || typeof text !== 'string') {
    res.status(400).json({
      success: false,
      error: '请提供要检查的文本内容'
    })
    return
  }
  
  const result = filterSensitiveContent(text)
  
  res.status(200).json({
    success: true,
    data: result
  })
}
