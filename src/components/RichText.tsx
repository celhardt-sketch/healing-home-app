import { Fragment } from 'react'

// Renders inline markdown emphasis (**bold** and *italic*) from verbatim
// article copy. No nesting is used in the source, so a single-pass tokenizer
// is sufficient.
export default function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter((p) => p !== '')
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-semibold text-charcoal">{part.slice(2, -2)}</strong>
        }
        if (part.startsWith('*') && part.endsWith('*')) {
          return <em key={i}>{part.slice(1, -1)}</em>
        }
        return <Fragment key={i}>{part}</Fragment>
      })}
    </>
  )
}
