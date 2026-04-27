function TicTacToeBoard({ board }) {
    return (
        <div>
            {
                board.map((row, rowi) => (
                    <div key={rowi}>
                        {row.map((cell, coli) => (
                            <button key={coli}>{cell ?? "-"}</button>
                        ))}
                    </div>
                ))
            }
        </div>
    )
}

export default TicTacToeBoard