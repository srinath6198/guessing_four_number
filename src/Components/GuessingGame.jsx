import React, { useState, useEffect, useRef } from 'react';
import './GuessingGame.css';
import profile from '../Assets/profile.png'

const generateUniqueNumber = () => {
    const digits = '0123456789'.split('');
    let number = '';
    
    while (number.length < 4) {
        const index = Math.floor(Math.random() * digits.length);
        number += digits[index];
        digits.splice(index, 1);
    }
    console.log(number);
    return number;
};

const GuessingGame = () => {
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [guess, setGuess] = useState('');
    const [feedback, setFeedback] = useState('');
    const [guesses, setGuesses] = useState(0);
    const [bestScore, setBestScore] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [timeTaken, setTimeTaken] = useState(null);
    const [timer, setTimer] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (startTime) {
            intervalRef.current = setInterval(() => {
                setTimer(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }
        
        return () => clearInterval(intervalRef.current);
    }, [startTime]);

    const startNewGame = () => {
        const newNumber = generateUniqueNumber();
        setNumber(newNumber);
        setGuess('');
        setFeedback('');
        setGuesses(0);
        setStartTime(Date.now());
        setTimeTaken(null);
        setTimer(0);
    };

    const calculateScore = (time, guesses) => {
        const weightTime = 2;
        const weightGuesses = 1;
        return (weightTime * time + weightGuesses * guesses) / (weightTime + weightGuesses);
    };

    const handleGuess = () => {
        console.log('User Guess:', guess);
        let newFeedback = '';
        let computerNumber = number.split('');
        let userGuess = guess.split('');
        let correct = 0;
        let incorrect = 0;

        for (let i = 0; i < userGuess.length; i++) {
            if (userGuess[i] === computerNumber[i]) {
                correct++;
                computerNumber[i] = null;
            } else if (computerNumber.includes(userGuess[i])) {
                incorrect++;
            }
        }

        newFeedback = '+'.repeat(correct) + '-'.repeat(incorrect);
        setFeedback(newFeedback);
        setGuesses(guesses + 1);

        if (correct === 4) {
            const endTime = Date.now();
            const totalTimeTaken = (endTime - startTime) / 1000;
            setTimeTaken(totalTimeTaken);
            const score = calculateScore(totalTimeTaken, guesses + 1);

            localStorage.setItem(name, score.toFixed(2));
            setBestScore(score);
            clearInterval(intervalRef.current);
        }
    };

    return (
        <div className="container">
            <h1>Guess the Number Game</h1>
            {!number ? (
                <>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <button onClick={startNewGame}>Start New Game</button>
                </>
            ) : (
                <>
                    <h2>Guess the 4-digit number</h2>
                    <div className="timer"><h2>Time: {timer}s</h2></div>
                    <div className="userName"><span>
                        <img src={profile} alt="" /></span>
                        <p>{name}</p>
                        </div>
                    <input
                        type="text"
                        maxLength="4"
                        value={guess}
                        onChange={(e) => setGuess(e.target.value)}
                    />
                    <button onClick={handleGuess}>Submit Guess</button>
                    <p className="feedback">Feedback: {feedback}</p>
                    <p>Guesses: {guesses}</p>
                    {timeTaken !== null && (
                        <p className="congratulations">Congratulations {name}! You've guessed the number in {guesses} tries and {timeTaken.toFixed(2)} seconds.</p>
                    )}
                    {bestScore && <p className="best-score">Your Best Score: {bestScore}</p>}
                </>
            )}
            <p className='srinath'>Copyright @srinath 2024 - All Right Reserved.</p>
        </div>
    );
};

export default GuessingGame;
