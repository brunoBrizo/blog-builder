/**
 * Feature 16: wire CMP / consent. No-op until then.
 */
export function setConsent(granted: boolean): void {
  void granted;
}

export function ConsentPlaceholder() {
  return (
    <div data-consent-placeholder aria-hidden className="hidden">
      {/* <!-- consent / CMP bootstrap --> */}
    </div>
  );
}
