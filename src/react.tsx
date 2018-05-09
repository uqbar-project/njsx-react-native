import { Attributes, DetailedHTMLProps, HTMLAttributes, ImgHTMLAttributes } from 'react'
import njsx, { Rule } from './index'
import { Builder, BuilderArgument } from './index'
import RULES from './rules'

export const DEFAULT_REACT_RULES: Rule[] = [
  RULES.STRING_AS_CLASS,
  RULES.STRING_AS_CHILD,
  RULES.NUMBER_AS_CHILD,
  RULES.BOOLEAN_AS_CHILD,
  RULES.NJSX_COMPONENT_AS_CHILD,
  RULES.REACT_COMPONENT_AS_CHILD,
  RULES.HASH_AS_ATRIBUTES,
  RULES.IGNORE_NULL,
  RULES.IGNORE_UNDEFINED,
]

njsx.rules = njsx.rules || DEFAULT_REACT_RULES
njsx.dynamicSelectorHandler = njsx.dynamicSelectorHandler || ((arg: BuilderArgument<any>, state) => RULES.STRING_AS_CLASS.apply(arg, state))

export const a: Builder<Attributes> = njsx('a')
export const abbr = njsx('abbr')
export const address = njsx('address')
export const area = njsx('area')
export const article = njsx('article')
export const aside = njsx('aside')
export const audio = njsx('audio')
export const b = njsx('b')
export const base = njsx('base')
export const bdi = njsx('bdi')
export const bdo = njsx('bdo')
export const big = njsx('big')
export const blockquote = njsx('blockquote')
export const body = njsx('body')
export const br = njsx('br')
export const button = njsx('button')
export const canvas = njsx('canvas')
export const caption = njsx('caption')
export const cite = njsx('cite')
export const code = njsx('code')
export const col = njsx('col')
export const colgroup = njsx('colgroup')
export const data = njsx('data')
export const datalist = njsx('datalist')
export const dd = njsx('dd')
export const del = njsx('del')
export const details = njsx('details')
export const dfn = njsx('dfn')
export const dialog = njsx('dialog')
export const div = njsx<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>>('div')
export const dl = njsx('dl')
export const dt = njsx('dt')
export const em = njsx('em')
export const embed = njsx('embed')
export const fieldset = njsx('fieldset')
export const figcaption = njsx('figcaption')
export const figure = njsx('figure')
export const footer = njsx('footer')
export const form = njsx('form')
export const h1 = njsx('h1')
export const h2 = njsx('h2')
export const h3 = njsx('h3')
export const h4 = njsx('h4')
export const h5 = njsx('h5')
export const h6 = njsx('h6')
export const head = njsx('head')
export const header = njsx('header')
export const hgroup = njsx('hgroup')
export const hr = njsx('hr')
export const html = njsx('html')
export const i = njsx('i')
export const iframe = njsx('iframe')
export const img: Builder<DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>> = njsx('img')
export const input = njsx('input')
export const ins = njsx('ins')
export const kbd = njsx('kbd')
export const keygen = njsx('keygen')
export const label = njsx('label')
export const legend = njsx('legend')
export const li = njsx('li')
export const link = njsx('link')
export const main = njsx('main')
export const map = njsx('map')
export const mark = njsx('mark')
export const menu = njsx('menu')
export const menuitem = njsx('menuitem')
export const meta = njsx('meta')
export const meter = njsx('meter')
export const nav = njsx('nav')
export const noscript = njsx('noscript')
export const object = njsx('object')
export const ol = njsx('ol')
export const optgroup = njsx('optgroup')
export const option = njsx('option')
export const output = njsx('output')
export const p = njsx('p')
export const param = njsx('param')
export const picture = njsx('picture')
export const pre = njsx('pre')
export const progress = njsx('progress')
export const q = njsx('q')
export const rp = njsx('rp')
export const rt = njsx('rt')
export const ruby = njsx('ruby')
export const s = njsx('s')
export const samp = njsx('samp')
export const script = njsx('script')
export const section = njsx('section')
export const select = njsx('select')
export const small = njsx('small')
export const source = njsx('source')
export const span = njsx('span')
export const strong = njsx('strong')
export const style = njsx('style')
export const sub = njsx('sub')
export const summary = njsx('summary')
export const sup = njsx('sup')
export const table = njsx('table')
export const tbody = njsx('tbody')
export const td = njsx('td')
export const textarea = njsx('textarea')
export const tfoot = njsx('tfoot')
export const th = njsx('th')
export const thead = njsx('thead')
export const time = njsx('time')
export const title = njsx('title')
export const tr = njsx('tr')
export const track = njsx('track')
export const u = njsx('u')
export const ul = njsx('ul')
export const variable = njsx('var')
export const video = njsx('video')
export const wbr = njsx('wbr')
export const circle = njsx('circle')
export const clipPath = njsx('clipPath')
export const defs = njsx('defs')
export const ellipse = njsx('ellipse')
export const g = njsx('g')
export const image = njsx('image')
export const line = njsx('line')
export const linearGradient = njsx('linearGradient')
export const mask = njsx('mask')
export const path = njsx('path')
export const pattern = njsx('pattern')
export const polygon = njsx('polygon')
export const polyline = njsx('polyline')
export const radialGradient = njsx('radialGradient')
export const rect = njsx('rect')
export const stop = njsx('stop')
export const svg = njsx('svg')
export const text = njsx('text')
export const tspan = njsx('tspan')