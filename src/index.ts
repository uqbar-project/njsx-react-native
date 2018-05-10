import { createElement, ReactChild, ReactElement, ReactNode, ReactType } from 'react'

const { isArray } = Array

// TODO: Check once more if all types are right and any cast can be removed.

export interface NJSX {
  <P>(type: ReactType<P>): Builder<P>

  argumentTransformations: (<P>(arg: BuilderArgument<P>) => BuilderArgument<P>)[]
  dynamicSelectorHandler: <P>(arg: string) => BuilderArgument<P>
}

export interface Builder<P> {
  (): ReactElement<{ children?: ReactNode[] } & P>,
  (head: BuilderArgument<P>, ...tail: BuilderArgument<P>[]): Builder<P>
  readonly [key: string]: Builder<P>
}

export type BuilderRefinement<P> = (state: BuilderState<P>) => BuilderState<P>
export interface BuilderArgumentArray<P> extends Array<BuilderArgument<P>> { }
export type BuilderArgument<P>
  = null
  | undefined
  | boolean
  | ReactChild
  | BuilderRefinement<P>
  | (() => ReactElement<any>)
  | Partial<P>
  | BuilderArgumentArray<P>


export type BuilderState<P> = { children?: ReactNode[] } & P


function addChild<P>(state: BuilderState<P>, child: ReactNode): BuilderState<P> {
  return { ...state as {}, children: [...state.children || [], child] } as BuilderState<P>
}

function isBuilder(target: any): target is Builder<any> { return target.__isNJSXBuilder__ }

const njsx = <P>(type: ReactType<P>, baseState: BuilderState<Partial<P>> = {}): Builder<P> => {
  const config = njsx as NJSX

  function applyArg(state: BuilderState<Partial<P>>, baseArg: BuilderArgument<P>): BuilderState<Partial<P>> {
    const arg = config.argumentTransformations.reduce((a, t) => t(a), baseArg)

    if (isArray(arg)) return arg.reduce(applyArg, state)

    if (arg === null) return state
    if (arg === undefined) return state
    if (typeof arg === 'boolean') return state

    if (typeof arg === 'number') return addChild(state, arg)
    if (typeof arg === 'string') return addChild(state, arg)
    if (typeof arg === 'object' && (arg as { props: any }).props) return addChild(state, arg)
    if (isBuilder(arg)) return addChild(state, arg())

    if (typeof arg === 'object') return { ...state as {}, ...arg as {} }

    if (typeof arg === 'function') return (arg as (s: BuilderState<any>) => BuilderState<any>)(state)

    throw new TypeError(`Unsupported NJSX argument: ${arg}`)
  }

  // TODO: (after checking if there is a Proxy for Native) Maybe refactor this to handle the apply in the ProxyHandler.
  const builder = ((...args: BuilderArgument<P>[]): any => {
    if (!args.length) {
      const { children = [], ...otherProps } = baseState as any
      return createElement(type, otherProps, ...children)
    }

    return njsx(type, args.reduce(applyArg, baseState))
  }) as Builder<P>

  return new Proxy(builder, {
    get(target, name) {
      if (name === '__isNJSXBuilder__') return true
      return target(config.dynamicSelectorHandler(name.toString()))
    },
  })
}


export default ((njsxInstance: NJSX) => {
  njsxInstance.argumentTransformations = []
  njsxInstance.dynamicSelectorHandler = (name) => {
    throw new TypeError(`Can't refine by ${name}: No handler for dynamic selector was provided`)
  }
  return njsxInstance
})(njsx as NJSX)
