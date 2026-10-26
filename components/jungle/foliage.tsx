/**
 * Fine line-art leaf for the delicate background decoration, drawn as SVG
 * so there are no image files to download and it stays crisp at any size.
 */

const f = (n: number) => Math.round(n * 10) / 10;

type LineLeafProps = {
  transform?: string;
  length?: number;
};

/**
 * A slender leaf drawn as a fine gold outline with its midrib and veins,
 * pointing along +x from (0,0).
 */
export function LineLeaf({ transform, length = 230 }: LineLeafProps) {
  const l = length;
  let veins = "";
  for (let i = 1; i <= 5; i++) {
    const x = (l * i) / 6.5;
    const reach = l * 0.11 * Math.sin((Math.PI * i) / 6);
    veins += `M${f(x)} 0Q${f(x + reach * 0.9)} ${f(-reach * 0.6)} ${f(x + reach * 1.6)} ${f(-reach)}`;
    veins += `M${f(x)} 0Q${f(x + reach * 0.9)} ${f(reach * 0.6)} ${f(x + reach * 1.6)} ${f(reach)}`;
  }
  return (
    <g transform={transform} fill="none" style={{ stroke: "var(--color-gold)" }} strokeLinecap="round">
      <path d={`M0 0C${f(l * 0.25)} ${f(-l * 0.19)} ${f(l * 0.7)} ${f(-l * 0.17)} ${l} 0C${f(l * 0.7)} ${f(l * 0.17)} ${f(l * 0.25)} ${f(l * 0.19)} 0 0Z`} strokeWidth="1.3" />
      <path d={`M${f(-l * 0.12)} ${f(l * 0.03)}Q${f(l * 0.3)} ${f(-l * 0.01)} ${f(l * 0.97)} 0`} strokeWidth="1" />
      <path d={veins} strokeWidth="0.7" strokeOpacity="0.7" />
    </g>
  );
}
