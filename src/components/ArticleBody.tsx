import RichText from './RichText'

// Renders an article body stored as lightweight markdown:
//   "## Heading"  -> section heading
//   "- item"      -> bullet list (consecutive lines)
//   anything else -> paragraph
// Blocks are separated by blank lines. Inline **bold**/*italic* is handled by
// RichText.
export default function ArticleBody({ content }: { content: string }) {
  const blocks = content.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean)

  return (
    <div className="mt-8 space-y-5">
      {blocks.map((block, i) => {
        if (block.startsWith('## ')) {
          return (
            <h3 key={i} className="text-xl font-bold font-heading text-charcoal pt-2">
              {block.slice(3).trim()}
            </h3>
          )
        }
        const lines = block.split('\n').map((l) => l.trim()).filter(Boolean)
        if (lines.length > 0 && lines.every((l) => l.startsWith('- '))) {
          return (
            <ul key={i} className="space-y-2 pl-1">
              {lines.map((item, j) => (
                <li key={j} className="text-[17px] text-charcoal-80 leading-relaxed flex items-start gap-2.5">
                  <span className="text-growth-green mt-2.5 w-1.5 h-1.5 rounded-full bg-growth-green shrink-0" />
                  <span><RichText text={item.slice(2).trim()} /></span>
                </li>
              ))}
            </ul>
          )
        }
        return (
          <p key={i} className="text-[17px] text-charcoal-80 leading-[1.75]">
            <RichText text={block} />
          </p>
        )
      })}
    </div>
  )
}
