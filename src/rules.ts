import { Builder, BuilderArgument, BuilderState, Rule } from './index'

const { isArray } = Array

function mergedStyle(props: any, style: any) {
  if (!props.style && !style) return {}
  if (!style) return { style: props.style }

  const newStyle = style.styleId ? style.styleId : style
  if (!props.style) return { style: newStyle }
  if (isArray(props.style)) return { style: [...props.style, newStyle] }
  return { style: [props.style, newStyle] }
}

export const HASH_AS_ATRIBUTES: Rule = {
  appliesTo(arg) { return !!arg && typeof arg === 'object' },
  apply<P>(arg: BuilderArgument<P>, { props }: BuilderState<P>): BuilderState<P> {
    return { props: { ...props as {}, ...(arg as {}), ...mergedStyle(props, (arg as any as { style: any }).style) } as P }
  },
}

export const STRING_AS_CLASS: Rule = {
  appliesTo(arg) { return typeof arg === 'string' && arg.trim().startsWith('.') },
  apply<P>(arg: BuilderArgument<P>, { props }: BuilderState<P>) {
    const { className, ...otherProps } = { className: '', ...props as {} }
    return {
      props: {
        ...otherProps,
        className: [...className.split(' '), ...(arg as string).split('.')].map(c => c.trim()).filter(String).join(' '),
      } as any as P,
    } as BuilderState<P>
  },
}

export const STYLE_AS_STYLE: Rule = {
  appliesTo(arg) { return !!arg && typeof arg === 'object' && Object.keys(arg).indexOf('styleId') >= 0 },
  apply<P>(arg: BuilderArgument<P>, { props }: BuilderState<P>) {
    return { props: { ...props as {}, ...mergedStyle(props, arg) } } as BuilderState<P>
  },
}

export const STRING_AS_CHILD: Rule = {
  appliesTo(arg) { return typeof arg === 'string' },
  apply(arg, { props }) {
    return { props: { ...props as {}, children: [...props.children || [], arg as string] } } as BuilderState<any>
  },
}

export const NUMBER_AS_CHILD: Rule = {
  appliesTo(arg) { return typeof arg === 'number' },
  apply(arg, { props }) {
    return { props: { ...props as {}, children: [...(props.children || []), (arg as number).toString()] } } as BuilderState<any>
  },
}

export const BOOLEAN_AS_CHILD: Rule = {
  appliesTo(arg) { return typeof arg === 'boolean' },
  apply(arg, { props }) {
    return { props: { ...props as {}, children: [...(props.children || []), (arg as boolean).toString()] } } as BuilderState<any>
  },
}

export const NJSX_COMPONENT_AS_CHILD: Rule = {
  appliesTo(arg) { return (arg as any).__isNJSXBuilder__ },
  apply(arg, { props }) {
    return { props: { ...props as {}, children: [...(props.children || []), (arg as Builder<any>)()] } } as BuilderState<any>
  },
}

export const REACT_COMPONENT_AS_CHILD: Rule = {
  appliesTo(arg) { return arg && typeof arg === 'object' && (arg as { props: any }).props },
  apply(arg, { props }) {
    return { props: { ...props as {}, children: [...(props.children || []), arg] } } as BuilderState<any>
  },
}

export const IGNORE_NULL: Rule = {
  appliesTo(arg) { return arg === null },
  apply(_, previous) { return previous },
}

export const IGNORE_BOOLEANS: Rule = {
  appliesTo(arg) { return typeof arg === 'boolean' },
  apply(_, previous) { return previous },
}

export const IGNORE_UNDEFINED: Rule = {
  appliesTo(arg) { return arg === undefined },
  apply(_, previous) { return previous },
}

export const APPLY_REFINEMENTS: Rule = {
  appliesTo(arg) { return typeof arg === 'function' },
  apply(arg, state) { return (arg as (s: BuilderState<any>) => BuilderState<any>)(state) },
}