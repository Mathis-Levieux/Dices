import { useState } from 'react'
import './App.css'
import { Dice } from './components/Dice'
import { Game } from './components/Game'

function App() {

  return (
    <main>
      <Game />
    </main>
  )
}

export default App

/**
 * Challenge:
 * - Style the <main> and <Dice> components 
 *   to look like they do in the slide
 *      - Hints: Create a container to hold the 10 instances
 *        of the Dice component, and use CSS Grid to lay them
 *        out evenly in 2 rows of 5 columns
 *      - Use flexbox on main to center the dice container
 *        in the center of the page
 */