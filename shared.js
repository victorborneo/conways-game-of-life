import { Board } from './classes/board.js'

export const mainGrid = new Board()
export const canvas = document.getElementById("grid")
export const ctx = canvas.getContext('2d')
export const rect = canvas.getBoundingClientRect()
