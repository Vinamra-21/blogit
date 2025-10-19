import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PostCardProps {
  id: number
  title: string
  slug: string
  excerpt?: string
  content: string
  createdAt: Date | string
  categories?: Array<{ id: number; name: string; slug: string }>
}

export function PostCard({ title, slug, excerpt, content, createdAt, categories }: PostCardProps) {
  return (
    <Link href={`/posts/${slug}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <CardTitle className="line-clamp-2">{title}</CardTitle>
          <CardDescription>{new Date(createdAt).toLocaleDateString()}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">{excerpt || content.substring(0, 150)}</p>
          {categories && categories.length > 0 && (
            <div className="flex gap-2 mt-4 flex-wrap">
              {categories.slice(0, 2).map((cat) => (
                <span key={cat.id} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                  {cat.name}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
