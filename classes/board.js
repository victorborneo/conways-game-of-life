import {
    gridX, gridY,
    tileSize
} from '../consts.js'
import { ctx } from '../shared.js'

export class Board {
    #gridX
    #gridY
    #matrix
    #alives

    constructor() {
        this.#gridX = gridX
        this.#gridY = gridY
        this.#alives = new Set()
        this.#matrix = this.#initMatrix(0)
    }

    draw() {
        for (let line of this.#matrix) {
            for (let tile of line) {
                tile.draw()
            }
        }
    }

    populate() {
        const kill = new Set()
        const born = new Set()
        for (let tile of this.#alives) {
            let [neighs, c] = tile.countNeighbors(this.#matrix)
            if (c < 2 || c > 3) {
                kill.add(tile)
            }
            for (let neigh of neighs) {
                if (neigh.getAlive()) continue
                let [_, c] = neigh.countNeighbors(this.#matrix)
                if (c === 3)
                    born.add(neigh)
            }
        }
        for (let tile of kill) {
            tile.switchAlive()
            this.#alives.delete(tile)
        }
        for (let tile of born) {
            tile.switchAlive()
            this.#alives.add(tile)
        }
    }

    clear(rate=0) {
        this.#alives = new Set()
        this.#matrix = this.#initMatrix(rate)
        this.draw()
    }

    switchTileAlive(i, j) {
        const alive = this.#matrix[i][j].switchAlive()
        if (alive) this.#alives.add(this.#matrix[i][j])
        else this.#alives.delete(this.#matrix[i][j])
        this.draw()
    }

    #initMatrix(rate) {
        const mat = []

        for (let i = 0; i < this.#gridY; i++) {
            const line = []

            for (let j = 0; j < this.#gridX; j++) {
                line.push(new Tile(
                    i * tileSize,
                    j * tileSize,
                    i, j
                ))
                if (Math.random() <= rate) {
                    line[j].switchAlive()
                    this.#alives.add(line[j])
                }
            }

            mat.push(line)
        }

        return mat
    }
}

class Tile {
    #x
    #y
    #idxI
    #idxJ
    #tileSize
    #colors
    #colorIdx
    #alive

    constructor(x, y, idxI, idxJ) {
        this.#x = x
        this.#y = y
        this.#idxI = idxI
        this.#idxJ = idxJ
        this.#alive = false
        this.#tileSize = tileSize
        this.#colors = ['#808080', '#FFFF00']
        this.#colorIdx = 0
    }

    draw() {
        ctx.fillStyle = this.#colors[this.#colorIdx]
        ctx.fillRect(this.#y, this.#x, this.#tileSize, this.#tileSize)
        ctx.strokeRect(this.#y, this.#x, this.#tileSize, this.#tileSize)
    }

    getAlive() {
        return this.#alive
    }

    switchAlive() {
        this.#alive = !this.#alive
        this.#colorIdx = (this.#colorIdx + 1) % 2
        return this.#alive
    }
    
    countNeighbors(mat) {
        const neighbors = []
        let c = 0
        debugger
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue
                let newI = this.#idxI + i
                let newJ = this.#idxJ + j
                if (newI < 0 || newI >= gridY || newJ < 0 || newJ >= gridX) continue
                if (mat[newI][newJ].getAlive()) c++
                neighbors.push(mat[newI][newJ])
            }
        }
        return [neighbors, c]
    }
}
