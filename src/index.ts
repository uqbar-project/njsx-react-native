import { Attributes, createElement, ReactChild, ReactElement, ReactNode, ReactType } from 'react'

const { isArray } = Array

export interface NJSX {
  <P extends object>(type: ReactType<P>, props?: Partial<P & Attributes>, ...children: ReactNode[]): Builder<P>
  rules?: Rule[]
  dynamicSelectorHandler?: <P extends object>(arg: BuilderArgument<P>, current: BuilderState<{}>) => BuilderState<{}>
}

export type BuilderRefinement<P extends object> = (state: BuilderState<P>) => BuilderState<P>
export type BuilderArgument<P extends object>
  = BuilderRefinement<P>
  | null
  | undefined
  | boolean
  | (() => ReactElement<any>)
  | ReactChild
  | Partial<P>
  | BuilderArgumentArray<P>
export interface BuilderArgumentArray<P extends object> extends Array<BuilderArgument<P>> { }
export interface BuilderState<P extends object> { props: P, children: ReactNode[] }
export interface Builder<P extends object> {
  (): ReactElement<P>,
  (head: BuilderArgument<P>, ...tail: Array<BuilderArgument<P>>): Builder<P>
  [key: string]: Builder<P>
}

export interface Rule {
  appliesTo(arg: BuilderArgument<any>): boolean
  apply<P extends object>(arg: BuilderArgument<P>, current: BuilderState<P>): BuilderState<P>
}


function flatten<T>(array: Array<T | T[]>): T[] {
  return array.reduce((acum: T[], elem) => [...acum, ...isArray(elem) ? elem as T[] : [elem as T]], [])
}

const njsx: NJSX = <P extends object>(
  type: ReactType<P>,
  initialProps: Partial<P & Attributes> = {},
  ...initialChildren: ReactNode[]): Builder<P> => {

  const builder: Builder<P> = ((...args: Array<BuilderArgument<P>>): any => {
    if (!args.length) return createElement(type, initialProps as P & Attributes, ...initialChildren)

    const nextState: BuilderState<P> =
      flatten(args).reduce((previous, arg) => {
        const rule = njsx.rules && njsx.rules.find(r => r.appliesTo(arg))
        if (!rule) { throw new TypeError(`Unsupported NJSX argument: ${arg}`) }
        return rule.apply(arg as BuilderArgument<any>, previous)
      }, { props: initialProps, children: initialChildren })
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
