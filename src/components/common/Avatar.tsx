interface AvatarProps {
  nickName: string
  size?: number
}

/** Círculo con la inicial; el tono sale del nickName, siempre apagado para no romper el tema. */
export default function Avatar({ nickName, size = 40 }: AvatarProps) {
  const hue = [...nickName].reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) % 360, 7)

  return (
    <span
      className="avatar"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.42,
        backgroundColor: `hsl(${hue} 35% 30%)`,
      }}
      aria-hidden="true"
    >
      {nickName.charAt(0).toUpperCase()}
    </span>
  )
}
