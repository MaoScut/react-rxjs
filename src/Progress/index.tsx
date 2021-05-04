import React, { useEffect, useState } from 'react'
import { interval } from 'rxjs'

export default function ProgressExample() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    if (progress < 100) {
      const s = interval(2000).subscribe(() => {
        setProgress(pre => {
          const next = pre + 10
          if (next > 100) {
            return 100
          }
          return next
        })
      })
      return () => s.unsubscribe()
    }
  }, [progress])
  return <div>progress: {progress}%</div>
}