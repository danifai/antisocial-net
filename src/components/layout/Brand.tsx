import logo from '../../assets/logo-tortuga.png'

/** Logo: tortuga + wordmark "anti-social" armado con texto (igual al logo original, escala en cualquier pantalla). */
export default function Brand() {
  return (
    <>
      <img src={logo} alt="" className="brand-icon" />
      <span className="brand-text">
        <span className="brand-anti">anti-</span>
        <span className="brand-social">social</span>
      </span>
    </>
  )
}
