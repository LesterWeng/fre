import { h, render, useState } from '../../src/index'

function A() {
    console.log('a')
  const [count, setCount] = useState(0)
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>{count}</button>
    </div>
  )
}

function B() {
    console.log('b')
  return <div>b</div>
}

function App() {
  return (
    <div>
      <A />
      <B />
    </div>
  )
}

render(<App />, document.body)
