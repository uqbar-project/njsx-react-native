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

const HASH_AS_ATRIBUTES: Rule = {
  appliesTo(arg) { return !!arg && typeof arg === 'object' },
  apply<P extends object>(arg: BuilderArgument<P>, { props, children }: BuilderState<P>): BuilderState<P> {
    return { props: { ...props as object, ...(arg as {}), ...mergedStyle(props, (arg as any as { style: any }).style) } as P, children }
  },
}

const STRING_AS_CLASS: Rule = {
  appliesTo(arg) { return typeof arg === 'string' && arg.trim().startsWith('.') },
  apply<P extends object>(arg: BuilderArgument<P>, { props, children }: BuilderState<P>) {
    const { className, ...otherProps } = { className: '', ...props as object }
    return {
      props: {
        ...otherProps,
        className: [...className.split(' '), ...(arg as string).split('.')].map(c => c.trim()).filter(String).join(' '),
      },
      children,
    } as BuilderState<P>
  },
}

const STYLE_AS_STYLE: Rule = {
  appliesTo(arg) { return !!arg && typeof arg === 'object' && Object.keys(arg).indexOf('styleId') >= 0 },
  apply<P extends object>(arg: BuilderArgument<P>, { props, children }: BuilderState<P>) {
    return { props: { ...props as object, ...mergedStyle(props, arg) }, children } as BuilderState<P>
  },
}

const STRING_AS_CHILD: Rule = {
  appliesTo(arg) { return typeof arg === 'string' },
  apply(arg, { props, children }) { return { props, children: [...children, arg] } },
}

export default {
  HASH_AS_ATRIBUTES,
  STRING_AS_CLASS,
  STYLE_AS_STYLE,
  STRING_AS_CHILD,

  NUMBER_AS_CHILD: {
    appliesTo(arg) { return typeof arg === 'number' },
    apply(arg, { props, children }) { return { props, children: [...children, (arg as number).toString()] } },
  } as Rule,

  BOOLEAN_AS_CHILD: {
    appliesTo(arg) { return typeof arg === 'boolean' },
    apply(arg, { props, children }) { return { props, children: [...children, (arg as boolean).toString()] } },
  } as Rule,

  NJSX_COMPONENT_AS_CHILD: {
    appliesTo(arg) { return (arg as any).__isNJSXBuilder__ },
    apply(arg, { props, children }) { return { props, children: [...children, (arg as Builder<any>)()] } },
  } as Rule,

  REACT_COMPONENT_AS_CHILD: {
    appliesTo(arg) { return arg && typeof arg === 'object' && (arg as { props: any }).props },
    apply(arg, { props, children }) { return { props, children: [...children, arg] } },
  } as Rule,

  IGNORE_NULL: {
    appliesTo(arg) { return arg === null },
    apply(_, previous) { return previous },
  } as Rule,

  IGNORE_BOOLEANS: {
    appliesTo(arg) { return typeof arg === 'boolean' },
    apply(_, previous) { return previous },
  } as Rule,

  IGNORE_UNDEFINED: {
    appliesTo(arg) { return arg === undefined },
    apply(_, previous) { return previous },
  } as Rule,

  APPLY_REFINEMENTS: {
    appliesTo(arg) { return typeof arg === 'function' },
    apply(arg, state) { return (arg as (s: BuilderState<any>) => BuilderState<any>)(state) },
  } as Rule,
}
