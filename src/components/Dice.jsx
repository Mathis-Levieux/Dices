export const Dice = (props) => {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    }

    return (
        <div onClick={props.handleHoldDice} className="dice" style={styles}>
            {props.value}
        </div>
    )
}