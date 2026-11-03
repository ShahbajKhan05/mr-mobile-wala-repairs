type WhatsAppIconProps = { size?: number; className?: string };

export default function WhatsAppIcon({ size = 18, className = "" }: WhatsAppIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="16" cy="16" r="15" fill="#25D366" />
      <path
        d="M23.2 8.8A10.1 10.1 0 0 0 7.3 20.9L6 26l5.2-1.4A10.1 10.1 0 0 0 23.2 8.8Z"
        fill="white"
      />
      <path
        d="M12.1 10.7c-.3-.7-.6-.7-.9-.7h-.7c-.3 0-.7.1-1 .5-.4.4-1.3 1.3-1.3 3.1s1.3 3.6 1.5 3.9c.2.3 2.5 4 6.1 5.4 3 .1 3.6-.2 4.3-.3.7-.1 2.3-.9 2.6-1.8.3-.9.3-1.6.2-1.8-.1-.2-.4-.3-.8-.5l-2.6-1.2c-.4-.2-.7-.2-.9.2-.3.4-1 1.2-1.2 1.5-.2.3-.5.3-.9.1-.4-.2-1.7-.6-3.2-2-.9-.8-1.5-1.8-1.7-2.2-.2-.4 0-.6.2-.8l.6-.7c.2-.2.3-.4.4-.7.1-.3 0-.5 0-.7l-1.1-2.7Z"
        fill="#25D366"
      />
    </svg>
  );
}
