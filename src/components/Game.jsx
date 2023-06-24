import React from "react"
import { Dice } from "./Dice"
import { nanoid } from "nanoid"
import Confetti from 'react-confetti'


export const Game = (props) => {

    const [dice, setDice] = React.useState(allNewDice()) // ON INITIALISE NOTRE TABLEAU DE DES AVEC LES DES ALEATOIRES
    const [tenzies, setTenzies] = React.useState(false)
    const [currentRolls, setCurrentRolls] = React.useState(0)
    const storedLowestRoll = JSON.parse(localStorage.getItem('lowestRoll'));
    const storedLowestTime = JSON.parse(localStorage.getItem('lowestTime'))

    /**
     * TRACK THE TIME IT TOOK TO WIN
     * SAVE BEST TIME AND LOWEST ROLL ON LOCALSTORAGE
     */

    const [start, setStart] = React.useState(null);
    const [seconds, setSeconds] = React.useState(storedLowestTime || null)

    React.useEffect(() => { // Lorsque la partie commence et qu'on initialise tenzies, on lance le timer
        setStart(Date.now());
        console.log("timer....");
    }, [tenzies]);





    function getRandomDice() {
        return Math.ceil(Math.random() * 6)
    }


    function generateNewDice() {
        return {
            value: getRandomDice(),
            isHeld: false,
            id: nanoid()
        }
    }

    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDice())
        }
        return newDice
    }

    function handleRollDice() { // Si la partie n'est pas encore gagnée, on roll les dés qui ne sont pas gardés
        if (!tenzies) {
            setDice(
                oldDice => {
                    return oldDice.map(dice => {
                        return dice.isHeld ? dice : generateNewDice()
                    })
                }
            )
            setCurrentRolls(oldRolls => oldRolls + 1)
        }
        else { // CE QUI SE PASSE SI ON CLIQUE SUR "PLAY AGAIN" ALORS QUE LA PARTIE EST FINIE
            setCurrentRolls(0)
            setTenzies(false)
            setDice(allNewDice())
        }
    }


    React.useEffect(() => { // à chaque fois que dice change, on vérifie si la partie est gagnée ou non
        const isAllTrue = dice.every(die => die.isHeld === true)
        const isAllEqual = dice.every(die => die.value === dice[0].value)
        if (isAllEqual && isAllTrue) { // Si la partie est gagnée, on enregistre le meilleur score si il y en a un
            if (storedLowestRoll === null || storedLowestRoll === 0) {
                localStorage.setItem('lowestRoll', JSON.stringify(currentRolls));
            } else if (storedLowestRoll > currentRolls) {
                localStorage.setItem('lowestRoll', JSON.stringify(currentRolls));
            }
            const millis = Date.now() - start; // Si la partie est gagnée, on arrête le timer
            setSeconds(parseFloat((millis / 1000).toFixed(2))) // On définit seconds
            setTenzies(true) // La partie est gagnée
        }
    }, [dice])

    React.useEffect(() => { // Logique pour enregistrer le temps record dans le localstorage
        if (storedLowestTime === null || seconds < storedLowestTime) {
            localStorage.setItem('lowestTime', JSON.stringify(seconds));
        }
    }, [seconds])

    function handleHoldDice(id) { // Logique pour garder et modifier les dés à garder
        if (!tenzies) { // On appelle la fonction uniquement si la partie n'est pas encore gagnée, pour éviter de casser le timer
            setDice(
                prevDice => {
                    return prevDice.map(dice => {
                        return dice.id === id ? { ...dice, isHeld: !dice.isHeld } : dice
                    })
                }
            )
        }

    }











    const diceElements = dice.map(dice => // MAP SUR LE TABLEAU DE DES POUR GENERER LES 10 DES A L'ECRAN
        <Dice
            value={dice.value}
            isHeld={dice.isHeld}
            key={dice.id}
            handleHoldDice={() => handleHoldDice(dice.id)}
        />
    )

    return (
        <div className="game">
            {tenzies && <Confetti />}
            <h1>Tenzies</h1>
            <p>
                Roll until all dice are the same. Click each Dice to freeze it at its current value between rolls.
            </p>
            <div className="dice-container">
                {diceElements}
            </div>
            <div className="dice-stats">
                <span className="rollCount">Rolls: {currentRolls}</span>
            </div>
            <button onClick={handleRollDice}>{tenzies ? "Play Again" : "Roll"}</button>
            <div className="dice-stats">
                <span className="rollCount">Lowest Rolls: {storedLowestRoll > 0 && storedLowestRoll}</span>
                <span className="timeCount">Lowest Time: {storedLowestTime && storedLowestTime + 's'}</span>
            </div>
        </div >
    )
}