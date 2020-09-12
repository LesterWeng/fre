import { h } from './h'
import { useEffect, useState } from './hooks'
import { scheduleCallback } from './scheduler'
import { ITaskCallback } from './type'

export function lazy(loader) {
  let p
  let comp
  let err
  return function Lazy(props) {
    if (!p) {
      p = loader()
      p.then(
        (exports) => (comp = exports.default || exports),
        (e) => (err = e)
      )
    }

    if (err) throw err
    if (!comp) throw p
    return h(comp, props)
  }
}

export function Suspense(props) {
  const [suspend, setSuspend] = useState(false)
  useEffect((current) => {
      console.log(current.promises)
    current.promises && Promise.all(current.promises).then(() => setSuspend(true))
  }, [])
  return [props.children, !suspend && props.fallback]
}

export function useTransition() {
  const [isPending, setPending] = useState(false)
  const startTransition = (cb) => {
    setPending(true)
    const transtion = (t: boolean) => {
      setPending(false)
      cb()
    }
    scheduleCallback(transtion as ITaskCallback)
  }
  return [startTransition as any, isPending]
}
