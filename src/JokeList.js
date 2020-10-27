import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Joke from './Joke';
import './JokeList.css';

class JokeList extends React.Component {
    state = {
        jokes: [],
    };

    componentDidMount() {
        this.generateNewJokes();
    }

    generateNewJokes = async () => {
        this.state.jokes.length = 0;
        let j = [...this.state.jokes];
        let seenJokes = new Set();
        try {
            while (j.length < 10) {
                let res = await axios.get('https://icanhazdadjoke.com', {
                    headers: { Accept: 'application/json' },
                });
                let { status, ...jokeObj } = res.data;

                if (!seenJokes.has(jokeObj.id)) {
                    seenJokes.add(jokeObj.id);
                    j.push({ ...jokeObj, votes: 0 });
                } else {
                    console.error('duplicate found!');
                }
            }
            this.setState({ jokes: j });
        } catch (e) {
            console.log(e);
        }
    };

    vote = (id, delta) => {
        this.setState({ jokes: this.state.jokes.map((j) => (j.id === id ? { ...j, votes: j.votes + delta } : j)) });
    };

    render() {
        if (this.state.jokes.length) {
            let sortedJokes = [...this.state.jokes].sort((a, b) => b.votes - a.votes);

            return (
                <div className="JokeList">
                    <button className="JokeList-getmore" onClick={this.generateNewJokes}>
                        Get New Jokes
                    </button>

                    {sortedJokes.map((j) => (
                        <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={this.vote} />
                    ))}
                </div>
            );
        } else {
            return (
                <div>
                    <p>Loading jokes.......</p>
                </div>
            );
        }
    }
}

export default JokeList;
