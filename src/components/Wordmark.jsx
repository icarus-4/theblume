// Brand: the company name is "Ivies", set in white (green belongs to the logo only).
export default function Wordmark({ className = '' }) {
  return (
    <span className={`wordmark ${className}`}>
      <span className="wordmark-name">Ivies</span>
    </span>
  )
}
