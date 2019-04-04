import React, { Component } from 'react'
import { randomRange, randomPop, round } from './utils'

import './App.css'

const width = 10
const height = 10

const gridworld = []
const qValues = []

for (let j = 0; j < height; j++) {
  const row = []
  const qValuesRow = []

  for (let i = 0; i < width; i++) {
    const reward = Math.random() > 0.95 ? randomRange(-100, 100) : 0

    row.push(reward)

    if (reward === 0) {
      const actionToQValue = {}

      if (j > 0) actionToQValue.north = 0
      if (j < height - 1) actionToQValue.south = 0
      if (i > 0) actionToQValue.west = 0
      if (i < width - 1) actionToQValue.east = 0

      qValuesRow.push(actionToQValue)
    }
    else {
      qValuesRow.push({ exit: 0 })
    }
  }

  gridworld.push(row)
  qValues.push(qValuesRow)
}

const a = randomRange(0, height - 1)
const b = randomRange(0, width - 1)

gridworld[a][b] = 100
qValues[a][b] = { exit: 0 }

const aa = randomRange(0, height - 1)
const bb = randomRange(0, width - 1)

gridworld[aa][bb] = -100
qValues[aa][bb] = { exit: 0 }

const margin = 100

const tileWidth = (window.innerWidth - 2 * margin) / width
const tileHeight = (window.innerHeight - 2 * margin) / height
const tileSize = Math.min(tileWidth, tileHeight)

let x = randomRange(0, width - 1)
let y = randomRange(0, height - 1)
let rerenderListener
const learningRate = 0.5
const rewardDecay = 1

console.log('x', x)
console.log('y', y)

function learn() {
  const intervalId = setInterval(() => {
    const action = randomPop(Object.keys(qValues[y][x]))

    let reward = 0
    const previousX = x
    const previousY = y

    if (action === 'north') y--
    else if (action === 'south') y++
    else if (action === 'west') x--
    else if (action === 'east') x++
    else if (action === 'exit') {
      reward = gridworld[y][x]
      x = randomRange(0, width - 1)
      y = randomRange(0, height - 1)
    }

    qValues[previousY][previousX][action] = reward === 0
      ? (1 - learningRate) * qValues[previousY][previousX][action] + learningRate * (reward + rewardDecay * Math.max(...Object.values(qValues[y][x])))
      : reward

    rerenderListener()
  }, 10)

  return () => clearInterval(intervalId)
}

class App extends Component {

  componentDidMount() {
    rerenderListener = this.forceUpdate.bind(this)
  }

  handleLearnClick = () => {
    this.stopLearning = learn()
  }

  render() {
    return (
      <React.Fragment>

        <div className="x5">
          <button type="button" onClick={this.handleLearnClick}>
            Learn
          </button>
        </div>

        <div style={{ margin }}>
          {gridworld.map((row, j) => (
            <div key={j} className="x5">
              {row.map((value, i) => value === 0 ? (
                <div
                  key={i}
                  className="App-tile x5"
                  style={{
                    width: tileSize,
                    height: tileSize,
                  }}
                >
                  <div className="App-tile-north">
                    {round(qValues[j][i].north, 1)}
                  </div>
                  <div className="App-tile-west">
                    {round(qValues[j][i].west, 1)}
                  </div>
                  <div className="App-tile-east">
                    {round(qValues[j][i].east, 1)}
                  </div>
                  <div className="App-tile-south">
                    {round(qValues[j][i].south, 1)}
                  </div>
                  {x === i && y === j && (
                    <div className="App-tile-dot" />
                  )}
                </div>
              ) : (
                <div
                  key={i}
                  className="App-tile App-exit x5"
                  style={{
                    width: tileSize,
                    height: tileSize,
                  }}
                >
                  {round(qValues[j][i].exit, 1)}
                  {x === i && y === j && (
                    <div className="App-tile-dot" />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

      </React.Fragment>
    )
  }
}

export default App
