interface AvatarProps {
  nickName: string
  size?: number
}

const AVATAR_COLORS = [
  'var(--as-avatar-blue)',
  'var(--as-avatar-cyan)',
  'var(--as-avatar-purple)',
  'var(--as-avatar-rose)',
  'var(--as-avatar-red)',
  'var(--as-avatar-ochre)',
]

/** Círculo con la inicial y un color estable elegido de la paleta del tema. */
export default function Avatar({ nickName, size = 40 }: AvatarProps) {
  const hash = [...nickName].reduce(
    (acc, char) => (Math.imul(acc, 31) + char.charCodeAt(0)) >>> 0,
    7,
  )
  const colorIndex = hash % AVATAR_COLORS.length

  return (
    <span
      className="avatar"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.42,
        backgroundColor: AVATAR_COLORS[colorIndex],
      }}
      aria-hidden="true"
    >
      {nickName.charAt(0).toUpperCase()}
    </span>
  )
}
