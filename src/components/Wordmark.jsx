// Brand rule: "the" sits small, "Blume" is highlighted.
export default function Wordmark({ className = '' }) {
  return (
    <span className={`wordmark ${className}`} aria-label="theBlume">
      <span className="wordmark-the" aria-hidden="true">the</span>
      <span className="wordmark-blume" aria-hidden="true">Blume</span>
    </span>
  )
}
