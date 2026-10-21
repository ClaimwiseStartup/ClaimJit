// A CMS-1500-style field box: red drop-out ink, box number on the left, field name on the right.
// Box numbers match the real claim form, so billers will recognize them.
export default function FieldLabel({
  box,
  label,
  tone = "light",
}: {
  box: string;
  label: string;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <span
      className={`inline-flex items-stretch border font-mono text-[10.5px] uppercase tracking-[0.12em] ${
        dark ? "border-[#F87171]/40 text-[#FCA5A5]" : "border-[#C2362F]/45 text-[#C2362F]"
      }`}
    >
      <span className={`px-1.5 py-1 border-r font-semibold ${dark ? "border-[#F87171]/40 bg-[#F87171]/10" : "border-[#C2362F]/45 bg-[#C2362F]/[0.06]"}`}>
        {box}
      </span>
      <span className="px-2 py-1">{label}</span>
    </span>
  );
}
