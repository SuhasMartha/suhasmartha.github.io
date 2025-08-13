import React, { useState, useEffect, useCallback } from 'react';

// --- Helper Functions & Constants ---
const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];
const humanPlayer = 'X';
const aiPlayer = 'O';

// --- Custom Styles Component ---
const CustomStyles = () => (
    <style>{`
        :root {
            --font-fira: "Fira Code", monospace;
            --bg-light: #e5e7eb; --text-light: #111111; --board-bg-light: #f9fafb;
            --cell-bg-light: #ffffff; --cell-hover-light: #f3f4f6; --highlight-light: #9e3dc1;
            --x-color-light: #be0eec; --o-color-light: #7b2cbf; --border-light: #abb2bf;

            --bg-dark: #111111; --text-dark: #e5e7eb; --board-bg-dark: #161318;
            --cell-bg-dark: #1d1e21; --cell-hover-dark: #282C33; --highlight-dark: #9d4edd;
            --x-color-dark: #be0eec; --o-color-dark: #9d4edd; --border-dark: #282C33;
        }
        body {
            font-family: var(--font-fira);
            background-color: var(--bg-light);
            color: var(--text-light);
            transition: background-color 0.3s, color 0.3s;
            overflow: hidden;
        }
        .dark body { background-color: var(--bg-dark); color: var(--text-dark); }
        .game-board { background-color: var(--board-bg-light); border-color: var(--border-light); }
        .dark .game-board { background-color: var(--board-bg-dark); border-color: var(--border-dark); }
        .cell { background-color: var(--cell-bg-light); border-color: var(--border-light); }
        .dark .cell { background-color: var(--cell-bg-dark); border-color: var(--border-dark); }
        .cell:not(.x):not(.o):hover { background-color: var(--cell-hover-light); }
        .dark .cell:not(.x):not(.o):hover { background-color: var(--cell-hover-dark); }
        .cell.x { color: var(--x-color-light); } .dark .cell.x { color: var(--x-color-dark); }
        .cell.o { color: var(--o-color-light); } .dark .cell.o { color: var(--o-color-dark); }
        .cell.win { background-color: var(--highlight-light) !important; color: white !important; }
        .dark .cell.win { background-color: var(--highlight-dark) !important; }
        .btn-primary { background-color: var(--highlight-light); color: white; transition: background-color 0.3s; }
        .dark .btn-primary { background-color: var(--highlight-dark); }
        .btn-primary:hover { opacity: 0.9; }
        .btn-secondary { background-color: var(--cell-bg-light); color: var(--text-light); border: 1px solid var(--border-light); }
        .dark .btn-secondary { background-color: var(--cell-bg-dark); color: var(--text-dark); border-color: var(--border-dark); }
        .modal { background-color: rgba(0,0,0,0.5); }
        .modal-content { background-color: var(--board-bg-light); }
        .dark .modal-content { background-color: var(--board-bg-dark); }
        .rules-heading { color: var(--o-color-light); } .dark .rules-heading { color: var(--highlight-dark); }
        .rules-text { color: var(--text-light); } .dark .rules-text { color: var(--text-dark); }
        
        /* Custom Confetti Animation */
        .confetti-piece {
            position: absolute;
            width: 10px;
            height: 20px;
            top: -20px;
            opacity: 0;
            animation: fall 5s linear forwards;
        }
        @keyframes fall {
            0% { top: -20px; opacity: 1; transform: rotate(0deg); }
            100% { top: 100vh; opacity: 1; transform: rotate(720deg); }
        }
    `}</style>
);

// --- Built-in Confetti Component ---
const ConfettiEffect = () => {
    const [pieces, setPieces] = useState([]);

    useEffect(() => {
        const newPieces = Array.from({ length: 150 }).map((_, i) => {
            const colors = ['#be0eec', '#9e3dc1', '#9d4edd', '#7b2cbf'];
            return {
                id: i,
                style: {
                    left: `${Math.random() * 100}vw`,
                    backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                    animationDelay: `${Math.random() * 5}s`,
                    transform: `rotate(${Math.random() * 360}deg)`
                }
            };
        });
        setPieces(newPieces);
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50">
            {pieces.map(piece => (
                <div key={piece.id} className="confetti-piece" style={piece.style}></div>
            ))}
        </div>
    );
};


// --- Reusable Components ---

const Cell = ({ value, onClick, isWinning }) => (
    <div
        className={`cell flex items-center justify-center text-5xl md:text-7xl font-bold cursor-pointer rounded-md border-2 ${value ? value.toLowerCase() : ''} ${isWinning ? 'win' : ''}`}
        onClick={onClick}
    >
        <span className="h-full flex items-center">{value || '\u00A0'}</span>
    </div>
);

const GameBoard = ({ board, onCellClick, winningCombo }) => (
    <div className="game-board grid grid-cols-3 gap-2 p-3 rounded-lg shadow-lg border-2 w-72 h-72 md:w-96 md:h-96 mx-auto">
        {board.map((value, index) => (
            <Cell
                key={index}
                value={value}
                onClick={() => onCellClick(index)}
                isWinning={winningCombo.includes(index)}
            />
        ))}
    </div>
);

const WelcomeScreen = ({ onEnter }) => (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-6xl md:text-8xl font-bold mb-6">Tic-Tac-Toe</h1>
        <div className="max-w-md mb-8">
            <h2 className="rules-heading text-2xl font-bold mb-2">Rules</h2>
            <p className="rules-text">The game is played on a 3x3 grid. Player X goes first. Players take turns putting their marks in empty squares. The first player to get 3 of their marks in a row (up, down, across, or diagonally) is the winner. If all 9 squares are full, the game is a draw.</p>
        </div>
        <button onClick={onEnter} className="btn-primary text-2xl font-semibold py-3 px-12 rounded-lg shadow-lg transition-transform transform hover:scale-105">Enter</button>
    </div>
);

const AnalysisModal = ({ isOpen, onClose, analysis }) => {
    if (!isOpen) return null;
    return (
        <div className="modal fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="modal-content w-full max-w-md p-6 rounded-lg shadow-xl">
                <h3 className="text-2xl font-bold mb-4">Game Analysis ✨</h3>
                <div className="text-left whitespace-pre-wrap">{analysis}</div>
                <button onClick={onClose} className="btn-secondary mt-6 w-full py-2 rounded-lg">Close</button>
            </div>
        </div>
    );
};

const GameOverScreen = ({ status, onPlayAgain, onBack, onAnalyze }) => (
    <div className="flex flex-col items-center justify-center text-center h-full">
        <h2 className="text-4xl md:text-5xl font-bold mb-8">{status}</h2>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button onClick={onPlayAgain} className="btn-primary text-lg font-semibold py-3 px-8 rounded-lg">Play Again</button>
            <button onClick={onAnalyze} className="btn-primary text-lg font-semibold py-3 px-8 rounded-lg">Analyze Game ✨</button>
            <button onClick={onBack} className="btn-secondary text-lg font-semibold py-3 px-8 rounded-lg">Back</button>
        </div>
    </div>
);


// --- Main App Component ---
export default function App() {
    const [screen, setScreen] = useState('welcome');
    const [theme, setTheme] = useState('light');
    const [board, setBoard] = useState(Array(9).fill(null));
    const [currentPlayer, setCurrentPlayer] = useState('X');
    const [gameMode, setGameMode] = useState('');
    const [isGameActive, setIsGameActive] = useState(false);
    const [status, setStatus] = useState('');
    const [winningCombo, setWinningCombo] = useState([]);
    const [moveHistory, setMoveHistory] = useState([]);
    const [trashTalk, setTrashTalk] = useState('');
    const [analysis, setAnalysis] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    // --- Theme Handling ---
    useEffect(() => {
        const savedTheme = localStorage.getItem('tictactoe-theme') || 'light';
        setTheme(savedTheme);
    }, []);

    useEffect(() => {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
        localStorage.setItem('tictactoe-theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');

    // --- Game Logic ---
    const startGame = (mode) => {
        setGameMode(mode);
        setIsGameActive(true);
        setBoard(Array(9).fill(null));
        setCurrentPlayer('X');
        setStatus("Player X's Turn");
        setWinningCombo([]);
        setMoveHistory([]);
        setTrashTalk('');
        setShowConfetti(false);
    };
    
    const checkWinner = useCallback((currentBoard) => {
        for (const condition of winningConditions) {
            const [a, b, c] = condition;
            if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
                return { winner: currentBoard[a], combo: condition };
            }
        }
        if (currentBoard.every(cell => cell !== null)) {
            return { winner: 'Tie', combo: [] };
        }
        return null;
    }, []);

    const processMove = useCallback((boardWithMove, playerWhoMoved) => {
        setBoard(boardWithMove);
        setMoveHistory(prev => [...prev, { player: playerWhoMoved, index: boardWithMove.lastIndexOf(playerWhoMoved) }]);

        const winnerInfo = checkWinner(boardWithMove);
        if (winnerInfo) {
            setIsGameActive(false);
            const newStatus = winnerInfo.winner === 'Tie' ? "It's a Draw!" : `Player ${winnerInfo.winner} Wins!`;
            setStatus(newStatus);
            setWinningCombo(winnerInfo.combo);
            if (winnerInfo.winner !== 'Tie') {
                setShowConfetti(true);
            }
        } else {
            const nextPlayer = playerWhoMoved === 'X' ? 'O' : 'X';
            setCurrentPlayer(nextPlayer);
            setStatus(`Player ${nextPlayer}'s Turn`);
        }
    }, [checkWinner]);

    const handleCellClick = (index) => {
        if (!isGameActive || board[index] || (gameMode === 'single' && currentPlayer === aiPlayer)) return;
        
        const newBoard = [...board];
        newBoard[index] = currentPlayer;
        processMove(newBoard, currentPlayer);
    };

    const minimax = useCallback((newBoard, depth, isMaximizing) => {
        const scores = { [aiPlayer]: 10, [humanPlayer]: -10, 'Tie': 0 };
        const result = checkWinner(newBoard);
        if (result) {
            return scores[result.winner] - (isMaximizing ? depth : -depth);
        }

        let bestScore = isMaximizing ? -Infinity : Infinity;
        for (let i = 0; i < 9; i++) {
            if (!newBoard[i]) {
                newBoard[i] = isMaximizing ? aiPlayer : humanPlayer;
                const score = minimax(newBoard, depth + 1, !isMaximizing);
                newBoard[i] = null;
                bestScore = isMaximizing ? Math.max(score, bestScore) : Math.min(score, bestScore);
            }
        }
        return bestScore;
    }, [checkWinner]);

    const findBestMove = useCallback((currentBoard) => {
        let bestScore = -Infinity;
        let move = -1;
        for (let i = 0; i < 9; i++) {
            if (!currentBoard[i]) {
                currentBoard[i] = aiPlayer;
                let score = minimax(currentBoard, 0, false);
                currentBoard[i] = null;
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        return move;
    }, [minimax]);
    
    const callGemini = async (prompt) => {
        const apiKey = "";
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });
            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            const result = await response.json();
            return result.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error("Gemini API Error:", error);
            return "My circuits are buzzing... can't think of anything clever right now.";
        }
    };

    const getAiTrashTalk = async () => {
        setTrashTalk('AI is thinking of a taunt...');
        const prompt = "You are a witty and slightly arrogant Tic-Tac-Toe AI that never loses. Give me a short, clever, one-line taunt about the human's last move or your impending victory. Keep it family-friendly and under 15 words.";
        const taunt = await callGemini(prompt);
        setTrashTalk(`🤖: "${taunt}"`);
    };

    const handleAnalysis = async () => {
        setAnalysis('Analyzing the game...');
        setIsModalOpen(true);
        const history = moveHistory.map((m, i) => `Turn ${i + 1}: Player ${m.player} places on square ${m.index}.`).join('\n');
        const prompt = `You are a Tic-Tac-Toe expert. Analyze the following game and provide a brief, insightful summary for a beginner. Point out the winning move or the critical mistake. The game ended with the status: "${status}".\n\nGame History:\n${history}`;
        const result = await callGemini(prompt);
        setAnalysis(result);
    };

    useEffect(() => {
        if (gameMode === 'single' && currentPlayer === aiPlayer && isGameActive) {
            setStatus('Player O is thinking...');
            const timeoutId = setTimeout(() => {
                const bestMove = findBestMove(board);
                if (bestMove !== -1) {
                    const newBoard = [...board];
                    newBoard[bestMove] = aiPlayer;
                    processMove(newBoard, aiPlayer);
                    getAiTrashTalk();
                }
            }, 700);
            return () => clearTimeout(timeoutId);
        }
    }, [currentPlayer, board, gameMode, isGameActive, findBestMove, processMove]);


    const resetGame = () => {
        setGameMode('');
        setIsGameActive(false);
        setTrashTalk('');
        setShowConfetti(false);
    };
    
    const playAgain = () => {
        startGame(gameMode);
    };

    if (screen === 'welcome') {
        return (
            <>
                <CustomStyles />
                <WelcomeScreen onEnter={() => setScreen('game')} />
                <button onClick={toggleTheme} className="fixed top-4 right-4 z-30 p-2 text-2xl transition-transform transform hover:scale-110">
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>
                <a href="https://suhasmartha.github.io/#/games" target="_blank" rel="noopener noreferrer" className="fixed bottom-4 right-4 z-30 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105">
                    Back to Fun-Zone
                </a>
            </>
        );
    }

    return (
        <>
            <CustomStyles />
            {showConfetti && <ConfettiEffect />}
            <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
                <div className="text-center">
                    {!gameMode ? (
                        <>
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">Choose a Mode</h1>
                            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                                <button onClick={() => startGame('single')} className="btn-primary w-full sm:w-48 text-lg font-semibold py-3 px-6 rounded-lg shadow-md">Single Player</button>
                                <button onClick={() => startGame('double')} className="btn-primary w-full sm:w-48 text-lg font-semibold py-3 px-6 rounded-lg shadow-md">Two Player</button>
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center">
                           <h1 className="text-4xl md:text-5xl font-bold mb-2">Tic-Tac-Toe</h1>
                           {isGameActive ? (
                            <>
                                <p className="text-lg md:text-xl h-8 mb-4">{status}</p>
                                <GameBoard board={board} onCellClick={handleCellClick} winningCombo={winningCombo} />
                                <div className="mt-4 h-12 flex items-center justify-center">
                                    <p className="text-sm italic">{trashTalk}</p>
                                </div>
                            </>
                           ) : (
                             <div className="w-full h-96 flex items-center justify-center">
                                <GameOverScreen status={status} onPlayAgain={playAgain} onBack={resetGame} onAnalyze={handleAnalysis} />
                             </div>
                           )}
                        </div>
                    )}
                </div>
            </div>
            <AnalysisModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} analysis={analysis} />
            <button onClick={toggleTheme} className="fixed top-4 right-4 z-30 p-2 text-2xl transition-transform transform hover:scale-110">
                {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <a href="https://suhasmartha.github.io/#/games" target="_blank" rel="noopener noreferrer" className="fixed bottom-4 right-4 z-30 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105">
                Back to Fun-Zone
            </a>
        </>
    );
}
