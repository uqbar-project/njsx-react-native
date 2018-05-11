// TODO: Delete this file
// import { Builder, BuilderArgument, BuilderState, isBuilder, Rule } from './index'

// const { isArray } = Array

// function mergedStyle(props: any, style: any) {
//   if (!props.style && !style) return {}
//   if (!style) return { style: props.style }

//   const newStyle = style.styleId ? style.styleId : style
//   if (!props.style) return { style: newStyle }
//   if (isArray(props.style)) return { style: [...props.style, newStyle] }
//   return { style: [props.style, newStyle] }
// }

// export const STYLE_AS_STYLE: Rule = {
//   appliesTo(arg) { return !!arg && typeof arg === 'object' && Object.keys(arg).indexOf('styleId') >= 0 },
//   apply<P>(arg: BuilderArgument<P>, props: BuilderState<P>) {
//     return { ...props as {}, ...mergedStyle(props, arg) } as BuilderState<P>
//   },
// }