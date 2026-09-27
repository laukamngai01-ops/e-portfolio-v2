// Procedural optical layers, not an image asset or native Apple material.
// All movement stays behind the interactive foreground.
export default function LiquidGlass() {
  return <span className="liquid-material" aria-hidden="true">
    <span className="liquid-wash" />
    <span className="liquid-caustic liquid-caustic-mint" />
    <span className="liquid-caustic liquid-caustic-rose" />
    <span className="liquid-caustic liquid-caustic-violet" />
    <span className="liquid-rim"><span className="liquid-rim-light" /></span>
    <span className="liquid-bevel" />
  </span>;
}
