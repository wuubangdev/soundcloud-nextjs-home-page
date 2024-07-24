'use client'

import { useEffect, useRef } from 'react'
import WaveSurfer from 'wavesurfer.js'

const WaveTrack = () => {

    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (containerRef.current) {
            const wavesurfer = WaveSurfer.create({
                container: containerRef.current,
                waveColor: 'rgb(200, 0, 200)',
                progressColor: 'rgb(100, 0, 100)',
                url: '/audio/WORKOUT.mp3',
            })
            wavesurfer.on('click', () => {
                wavesurfer.play()
            })
        }

    }, [])

    return (
        <div ref={containerRef}>WaveTrack</div>
    )
}

export default WaveTrack;