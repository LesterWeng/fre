import { h, render, useState, useEffect, useTransition, Suspense } from '../../src/index'

const Child = () => {
  const [resource, setResource] = useState(undefined)
  const [startTransition, isPending] = useTransition()
  const [count, setCount] = useState(0)
  useEffect(() => {
    const id = setInterval(() => {
      setCount((c) => c + 1)
    }, 200)
    return () => clearInterval(id)
  }, [])
  return (
    <div>
      <button
        onClick={() => {
          startTransition(() => {
            setResource(createResource(4000))
          })
        }}
      >
        CLICK ME
      </button>
      <pre>{JSON.stringify({ count, isPending }, null, 2)}</pre>
      {resource === undefined ? 'Initial state' : resource.read()}
    </div>
  )
}

const App = () => {
  return (
    <Suspense>
      <Child />
    </Suspense>
  )
}

const sleep = (durationMs) => new Promise((resolve) => setTimeout(() => resolve(), durationMs))
const wrapPromise = (promise) => {
  let result
  promise.then(
    (value) => {
      result = { type: 'success', value }
    },
    (value) => {
      result = { type: 'error', value }
    }
  )
  return {
    read() {
      if (result === undefined) {
        throw promise
      }
      if (result.type === 'error') {
        throw result.value
      }
      return result.value
    },
  }
}

const createResource = (durationMs) => {
  return wrapPromise(sleep(durationMs).then(() => 'FETCHED RESULT'))
}

render(<App />, document.body)
