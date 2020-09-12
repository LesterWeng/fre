import { h, render, useState, useEffect, useTransition, Suspense } from '../../src/index'

const Child = () => {
  const [resource, setResource] = useState(undefined)
  const [startTransition, isPending] = useTransition()
  const [count, setCount] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setCount((c) => c + 1), 200)
    return () => clearInterval(id)
  }, [])
  return (
    <div>
      <button
        onClick={() => {
          startTransition(() => {
            setResource(wrapPromise(new Promise((r) => setTimeout(r, 3000)).then(() => 'FETCHED RESULT')))
          })
        }}
      >
        CLICK ME
      </button>
      <pre>{JSON.stringify({ count, isPending }, null, 2)}</pre>
      {resource ? resource.read() : 'Initial state'}
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

const wrapPromise = (promise) => {
  let result
  promise.then(
    (value) => {
      result = { type: 'success', value }
    },
    () => {}
  )
  return {
    read() {
      if (!result) throw promise
      return result.value
    },
  }
}

render(<App />, document.body)
