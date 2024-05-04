import {
    mainGrid,
    canvas,
    ctx, rect
} from './shared.js'
import { 
    FPS,
    gridX, gridY,
    tileSize
} from '../consts.js'

let state = 0
let idTimeOut
canvas.width = gridX * tileSize
canvas.height = gridY * tileSize

function gameLoop() {
    idTimeOut = setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        mainGrid.populate()
        mainGrid.draw()
        
        window.requestAnimationFrame(gameLoop)
    }, 1000 / FPS)
}

function main() {
    mainGrid.draw()
    document.getElementById("startButton").addEventListener("click", ev => {
        if (state === 0)
            window.requestAnimationFrame(gameLoop)
        else
            clearTimeout(idTimeOut)
        state = (state + 1) % 2
    })

    document.getElementById("randomButton").addEventListener("click", ev => {
        if (state === 1) {
            clearTimeout(idTimeOut)
            state = 0
        }
        const rate = document.getElementById("spawnRate").value
        mainGrid.clear(rate)
    })

    document.getElementById("clearButton").addEventListener("click", ev => {
        if (state === 1) {
            clearTimeout(idTimeOut)
            state = 0
        }
        mainGrid.clear()
    })

    document.getElementById("grid").addEventListener("click", ev => {
        if (state !== 0) return
        const x = ev.clientX - rect.left
        const y = ev.clientY - rect.top
        const i = Math.floor(y / tileSize)
        const j = Math.floor(x / tileSize)
        mainGrid.switchTileAlive(i, j)
    })
}

if (typeof window !== 'undefined') {
    window.onload = function() {
        main()
    }
}
