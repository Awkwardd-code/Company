export default function AuthorPage() {
    const blogPosts = [
      {
        image: "https://via.placeholder.com/400x250", // Placeholder image
        title: "STYLISH KITCHEN AND DINING ROOM WITH FUNCTIONAL IDEAS",
        description: "Lorem Ipsum is simply dummy text of the print and typesetting industry...",
        author: "Adrio Devid",
        date: "Sep 10, 2025",
        category: "Technology",
      },
      {
        image: "https://via.placeholder.com/400x250",
        title: "STYLISH KITCHEN AND DINING ROOM WITH FUNCTIONAL IDEAS",
        description: "Lorem Ipsum is simply dummy text of the print and typesetting industry...",
        author: "Adrio Devid",
        date: "Sep 10, 2025",
        category: "Culture",
      },
      {
        image: "https://via.placeholder.com/400x250",
        title: "STYLISH KITCHEN AND DINING ROOM WITH FUNCTIONAL IDEAS",
        description: "Lorem Ipsum is simply dummy text of the print and typesetting industry...",
        author: "Adrio Devid",
        date: "Sep 10, 2025",
        category: "Travel",
      },
    ];
  
    return (
      <div className="min-h-screen bg-transparent px-4 py-12">
        {/* Profile Section */}
        <div className="text-center mb-12">
          {/* Avatar */}
          <div className="w-24 h-24 mx-auto mb-4">
            <img
              src="https://via.placeholder.com/96"
              alt="Adrio Devid"
              className="w-full h-full rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-md"
            />
          </div>
  
          {/* Name and Description */}
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Adrio Devid
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Mario, a co-founder of Acme and the content management system Sanity,
            is an accomplished Staff Engineer with a specialization in Frontend at
            Vercel. Before his current position, he served as a Senior Engineer at
            Apple.
          </p>
        </div>
  
        {/* Blog Posts Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map((post, index) => (
              <div
                key={index}
                className="bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-lg shadow-[0_6px_30px_rgba(150,150,150,0.4)] dark:shadow-[0_6px_30px_rgba(100,100,100,0.5)] overflow-hidden"
              >
                {/* Image */}
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
  
                {/* Content */}
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {post.description}
                  </p>
  
                  {/* Author and Date */}
                  <div className="flex items-center mb-4">
                    <img
                      src="https://via.placeholder.com/32"
                      alt={post.author}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <span className="text-gray-600 dark:text-gray-400">
                      {post.author} • {post.date}
                    </span>
                  </div>
  
                  {/* Category Tag */}
                  <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }