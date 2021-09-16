import * as d3 from 'd3'
export function formatThousands(value) {
  return Intl.NumberFormat().format(value)
}
export function formatMillions(value) {
  return d3.format('.3s')(value).replace(/G/, 'B')
}
