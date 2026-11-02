import Image from "next/image";

export default function WhatsAppIcon({ size = 18, className = "" }: { size?: number; className?: string }) {
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
