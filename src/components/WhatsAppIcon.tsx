import Image from "next/image";

type WhatsAppIconProps = { size?: number; className?: string };

export default function WhatsAppIcon({ size = 18, className = "" }: WhatsAppIconProps) {
  return (
    <Image
      src="/Whatsapp-3d.svg"
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={`shrink-0 object-contain ${className}`}
    />
  );
}
