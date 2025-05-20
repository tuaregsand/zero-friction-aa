"use client";
export default function LedgerButton({ onConnect }: { onConnect: () => void }) {
  if (typeof navigator === 'undefined' || !(navigator as any).usb) return null;
  return (
    <button type="button" aria-label="Connect Ledger" onClick={onConnect}>
      Connect Ledger
    </button>
  );
}
