import { Attributes, createElement, ReactChild, ReactElement, ReactNode, ReactType } from 'react'

const { isArray } = Array

export interface NJSX {
  <P>(type: ReactType<P>, props?: Partial<P & Attributes>, ...children: Array<ReactNode | Builder<any>>): Builder<P>
  rules?: Rule[]
  dynamicSelectorHandler?: <P>(arg: BuilderArgument<P>, current: BuilderState<{}>) => BuilderState<{}>
}


export interface Builder<P> {
  (): ReactElement<P>,
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

export interface BuilderState<P> { props: P, children: ReactNode[] }
export function isBuilder(target: any): target is Builder<any> { return target.__isNJSXBuilder__ }


export interface Rule {
  appliesTo(arg: BuilderArgument<any>): boolean
  apply<P>(arg: BuilderArgument<P>, current: BuilderState<P>): BuilderState<P>
}


const njsx: NJSX = <P>(
  type: ReactType<P>,
  baseProps: Partial<P & Attributes> = {},
  ...baseChildren: Array<ReactNode | Builder<any>>): Builder<P> => {

  function applyArg(state: BuilderState<P>, arg: BuilderArgument<P>): BuilderState<P> {
    if (isArray(arg)) return arg.reduce(applyArg, state)
    const rule = njsx.rules && njsx.rules.find(r => r.appliesTo(arg))
    if (!rule) { throw new TypeError(`Unsupported NJSX argument: ${arg}`) }
    return rule.apply(arg as BuilderArgument<any>, state)
  }

  const builder = ((...args: Array<BuilderArgument<P>>): any => {
    if (!args.length) return createElement(type, baseProps as P & Attributes, ...baseChildren)
    const nextState: BuilderState<P> = args.reduce(applyArg, { props: baseProps, children: baseChildren } as BuilderState<P>)
    return njsx(type, nextState.props, ...nextState.children)
  }) as Builder<P>

  return new Proxy(builder, {
    get(_, name) {
      if (name === '__isNJSXBuilder__') return true

      const currentProps: any = builder().props
      const { children = [], ...props } = currentProps

      if (!njsx.dynamicSelectorHandler) { throw new TypeError(`Can't refine by ${name}: No handler for dynamic selector was provided`) }
      const next = njsx.dynamicSelectorHandler(name as string, { props, children })
      return njsx(type, next.props, ...next.children)
    },
  })
}

export default njsx
