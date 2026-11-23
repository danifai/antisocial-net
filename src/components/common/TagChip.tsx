interface TagChipProps {
  label: string
  /** Estado activo (filtro seleccionado): se pinta en verde. */
  active?: boolean
  /** Si se pasa, la etiqueta es un botón. */
  onClick?: () => void
}

export default function TagChip({ label, active = false, onClick }: TagChipProps) {
  const className = `tag-chip${active ? ' active' : ''}`

  if (!onClick) return <span className={className}>{label}</span>

  return (
    <button type="button" className={className} onClick={onClick} aria-pressed={active}>
      {label}
    </button>
  )
}
