const relative = new Intl.RelativeTimeFormat('es-AR', { numeric: 'auto' })

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 31_536_000],
  ['month', 2_592_000],
  ['day', 86_400],
  ['hour', 3_600],
  ['minute', 60],
]

/** "hace 3 horas", "ayer", "hace 2 meses"... */
export function timeAgo(iso: string): string {
  const seconds = (new Date(iso).getTime() - Date.now()) / 1000
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) {
      return relative.format(Math.round(seconds / size), unit)
    }
  }
  return 'recién'
}

/** "23 de noviembre de 2026, 17:48" */
export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('es-AR', {
    dateStyle: 'long',
    timeStyle: 'short',
  })
}
