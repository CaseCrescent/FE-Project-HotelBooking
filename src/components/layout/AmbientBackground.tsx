// Global drifting blurred blobs + grain overlay. Mount once in the root layout.
export default function AmbientBackground() {
  return (
    <div className="ambient-layer" aria-hidden>
      <div className="ambient-blob b-1" />
      <div className="ambient-blob b-2" />
      <div className="ambient-blob b-3" />
      <div className="ambient-grain" />
    </div>
  );
}
