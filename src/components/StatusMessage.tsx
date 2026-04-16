interface StatusMessageProps {
  title: string
  message: string
  actionLabel?: string
  onAction?: () => void
}

export function StatusMessage({ title, message, actionLabel, onAction }: StatusMessageProps) {
  return (
    <section className="status-panel">
      <strong>{title}</strong>
      <p>{message}</p>
      {actionLabel && onAction && (
        <button className="cta-button" type="button" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </section>
  )
}
