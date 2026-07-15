type StatusDotProps = {
  size?: "xs" | "sm" | "md";
  tone?: "online" | "warning";
};

export function StatusDot({ size = "sm", tone = "online" }: StatusDotProps) {
  return <span className={`status-dot status-dot--${size} ${tone === "warning" ? "status-dot--warning" : ""}`} aria-hidden="true" />;
}
