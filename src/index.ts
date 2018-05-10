import { createElement, ReactChild, ReactElement, ReactNode, ReactType } from 'react'

const { isArray } = Array


export interface NJSX {
  <P>(type: ReactType<P>): Builder<P>

  rules: Rule[]
  dynamicSelectorHandler: <P>(arg: BuilderArgument<P>, current: BuilderState<P>) => BuilderState<P>
}


export interface Builder<P> {
  (): ReactElement<{ children?: ReactNode[] } & P>,
  (head: BuilderArgument<P>, ...tail: Array<BuilderArgument<P>>): Builder<P>
  [key: string]: Builder<P>
}
export interface BuilderArgumentArray<P> extends Array<BuilderArgument<P>> { }
export type BuilderArgument<P>
  = null
  | undefined
  | boolean
  | ReactChild
  | ((state: BuilderState<P>) => BuilderState<P>)
  | (() => ReactElement<any>)
  | Partial<P>
  | BuilderArgumentArray<P>

// TODO: { children?: ReactNode[] } dónde debería

export type BuilderState<P> = { children?: ReactNode[] } & P
export function isBuilder(target: any): target is Builder<any> { return target.__isNJSXBuilder__ }


export interface Rule {
  appliesTo(arg: BuilderArgument<any>): boolean
  apply<P>(arg: BuilderArgument<P>, current: BuilderState<P>): BuilderState<P>
}


const njsx = <P>(type: ReactType<P>, baseProps: { children?: ReactNode[] } & Partial<P> = {}): Builder<P> => {
  const config = njsx as NJSX

  function applyArg(state: BuilderState<Partial<P>>, arg: BuilderArgument<P>): BuilderState<P> {
    if (isArray(arg)) return arg.reduce(applyArg, state) as BuilderState<P>
    const rule = config.rules.find(r => r.appliesTo(arg))
    if (!rule) { throw new TypeError(`Unsupported NJSX argument: ${arg}`) }
    return rule.apply(arg as BuilderArgument<any>, state)
  }

  const builder = ((...args: Array<BuilderArgument<P>>): any => {
    if (!args.length) {
      const { children = [], ...otherProps } = baseProps as any
      return createElement(type, otherProps, ...children)
    }

    const nextState = args.reduce(applyArg, baseProps) as BuilderState<P>
    return njsx(type, nextState)
  }) as Builder<P>

  return new Proxy(builder, {
    get(_, name) {
      if (name === '__isNJSXBuilder__') return true
      return njsx(type, config.dynamicSelectorHandler(name.toString(), builder().props))
    },
  })
}

(njsx as NJSX).dynamicSelectorHandler = (name) => {
  throw new TypeError(`Can't refine by ${name}: No handler for dynamic selector was provided`)
}

export default njsx as NJSX
