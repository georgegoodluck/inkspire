import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

async function getAuthor(username: string) {
  const res = await fetch(`${process.env.API_URL}/api/users/${username}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const data = await getAuthor(username);

  if (!data) notFound();

  const { user } = data;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Author header */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-6">
          <div className="flex items-center gap-5">
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.name}
                width={72}
                height={72}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-18 h-18 rounded-full bg-gray-900 flex items-center justify-center text-white text-2xl font-semibold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {user.name}
              </h1>
              <p className="text-sm text-gray-500">@{user.username}</p>
              {user.bio && (
                <p className="text-sm text-gray-600 mt-2">{user.bio}</p>
              )}
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-100 flex gap-6">
            <div>
              <p className="text-2xl font-semibold text-gray-900">
                {user._count.posts}
              </p>
              <p className="text-xs text-gray-500">Published posts</p>
            </div>
          </div>
        </div>

        {/* Posts list */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Latest posts
          </h2>
          {user.posts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-sm text-gray-400">
              No published posts yet.
            </div>
          ) : (
            user.posts.map((post: any) => (
              <Link
                key={post.id}
                href={`/posts/${post.slug}`}
                className="block bg-white rounded-2xl border border-gray-100 p-6 hover:border-gray-200 transition-colors"
              >
                {post.coverImage && (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    width={600}
                    height={200}
                    className="rounded-xl object-cover w-full h-40 mb-4"
                  />
                )}
                <h3 className="font-semibold text-gray-900 mb-1">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {post.excerpt}
                  </p>
                )}
                <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
                  {post.publishedAt && (
                    <span>
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </span>
                  )}
                  {post.readingTime && <span>{post.readingTime} min read</span>}
                  <span>{post.viewCount} views</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
