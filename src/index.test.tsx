import { assert, expect } from 'chai'
// import * as mock from 'mock-require'
import * as React from 'react'
import njsx from './index'
import { BuilderState } from './index'
import { CLASSES_FROM_STRINGS } from './react'

// const { keys, assign } = Object

// TODO: test that class names are acumulative:
// div('.lala')({className: 'bar'})

// mock('react-native', {
//   StyleSheet: {
//     create: (styleDefinition: any) => keys(styleDefinition).reduce((acum, key) => assign(acum, { [key]: 1 }), {}),
//   },
// })
// const { StyleSheet } = require("react-native.js")

describe('NJSX', () => {

  describe('components', () => {
    it('should be creatable from a type name', () => {
      const component = njsx('div')()

      expect(component).to.deep.equal(<div />)
    })

    it('should be creatable from a React component', () => {
      class Component extends React.Component {
        render() {
          return <div />
        }
      }
      const component = njsx(Component)()

      expect(component).to.deep.equal(<Component />)
    })

    it('should be creatable from a React functional component', () => {
      const FunctionalComponent = () => <div />
      const component = njsx(FunctionalComponent)()

      expect(component).to.deep.equal(<FunctionalComponent />)
    })

    it('should be refinable by passing attributes as a hash', () => {
      const component = njsx('div')({ className: 'none' })()

      expect(component).to.deep.equal(<div className='none' />)
    })

    it('should be refinable by passing a string representing a class name', () => {
      njsx.argumentTransformations = [CLASSES_FROM_STRINGS]
      const component = njsx('div')('.bar.baz')('.qux')()

      expect(component).to.deep.equal(<div className='bar baz qux' />)
    })

    it('should be refinable by passing a string representing content', () => {
      const component = njsx('div')('bar')()

      expect(component).to.deep.equal(<div>bar</div>)
    })

    it('should be refinable by passing a number representing content', () => {
      const component = njsx('div')(5)()

      expect(component).to.deep.equal(<div>{5}</div>)
    })

    it('should be refinable by passing other React components as children', () => {
      const component = njsx('div')(<span />, <p />)()

      expect(component).to.deep.equal(<div><span /><p /></div>)
    })

    it('should be refinable by passing other NJSX components as children', () => {
      const component = njsx('div')(njsx('span'), njsx('p'))()

      expect(component).to.deep.equal(<div><span /><p /></div>)
    })

    it('should be refinable by passing an array of children', () => {
      const component = njsx('div')([njsx('span'), njsx('p')])()

      expect(component).to.deep.equal(<div><span /><p /></div>)
    })

    it('should ignore null arguments', () => {
      const component = njsx('div')(null, [null])()

      expect(component).to.deep.equal(<div />)
    })

    it('should ignore undefined arguments', () => {
      const component = njsx('div')(undefined, [undefined])()

      expect(component).to.deep.equal(<div />)
    })

    it('should ignore boolean arguments', () => {
      const component = njsx('div')(false)()

      expect(component).to.deep.equal(<div />)
    })

    it('should be refinable by functional refinements', () => {
      const foo = ({ props }: BuilderState<any>) => ({ ...props, className: 'foo' })
      const component = njsx('div')(foo)()

      expect(component).to.deep.equal(<div className='foo' />)
    })

    it('should be refinable by dynamic messages if a handler is defined', () => {
      njsx.argumentTransformations = [CLASSES_FROM_STRINGS]
      njsx.dynamicSelectorHandler = (arg: string) => `.${arg}`
      const component = njsx('div').bar.baz.qux()

      expect(component).to.deep.equal(<div className='bar baz qux' />)
    })

    it('should be refinable by property key accessing if a handler is defined', () => {
      njsx.argumentTransformations = [CLASSES_FROM_STRINGS]
      njsx.dynamicSelectorHandler = (arg: string) => `.${arg}`
      const component = njsx('div')['.bar']['baz qux']()

      expect(component).to.deep.equal(<div className='bar baz qux' />)
    })

    it('should not be refinable by dynamic messages after the component is built', () => {
      njsx.dynamicSelectorHandler = (_) => { assert.fail(); throw new Error('Test failed') }
      expect(() => njsx('div')().key).to.not.throw()
    })

    describe('should be refinable by njsx styles when', () => {
      // const styleSheet = StyleSheet.create({ style: { bar: "baz" } })

      // it('no previous style is defined', () => {
      //   njsx.rules = [Rules.STYLE_AS_STYLE]
      //   const component = njsx('div')(styleSheet.style)()

      //   expect(component).to.deep.equal(<div style={1} />)
      // })

      // it('style is already defined as array', () => {
      //   njsx.rules = [Rules.STYLE_AS_STYLE, Rules.HASH_AS_ATRIBUTES]
      //   const component = njsx('div')({ style: [5] })(styleSheet.style)()

      //   expect(component).to.deep.equal(<div style={[5, 1]} />)
      // })

      // it('style is already defined as object', () => {
      //   njsx.rules = [Rules.STYLE_AS_STYLE, Rules.HASH_AS_ATRIBUTES]
      //   const component = njsx('div')({ style: { bar: "baz" } })(styleSheet.style)()

      //   expect(component).to.deep.equal(<div style={[{ bar: "baz" }, 1]} />)
      // })

      // it('style is already defined as id', () => {
      //   njsx.rules = [Rules.STYLE_AS_STYLE, Rules.HASH_AS_ATRIBUTES]
      //   const component = njsx('div')({ style: 5 })(styleSheet.style)()

      //   expect(component).to.deep.equal(<div style={[5, 1]} />)
      // })

      // it('style is already defined and a new style is set as hash attribute', () => {
      //   njsx.rules = [Rules.STYLE_AS_STYLE, Rules.HASH_AS_ATRIBUTES]
      //   const component = njsx('div')(styleSheet.style)({ style: 5 })()

      //   expect(component).to.deep.equal(<div style={[1, 5]} />)
      // })

    })

  })

})
