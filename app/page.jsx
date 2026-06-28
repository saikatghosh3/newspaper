import connectDB from '@/lib/mongodb';
import Settings from '@/lib/models/Settings';
import Category from '@/lib/models/Category';
import News from '@/lib/models/News';
import User from '@/lib/models/User';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import TrendingNews from '@/components/TrendingNews';
import NewsCard from '@/components/NewsCard';
import VideoNewsSection from '@/components/VideoNews';
import AdDisplay from '@/components/AdDisplay';
import Footer from '@/components/Footer';

export const revalidate = 60;

function SectionHeader({ category }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-5">
      <div className="flex items-center gap-3">
        <span className="w-1.5 h-8 rounded-full" style={{ backgroundColor: category.color || '#dc2626' }} />
        <h2 className="text-2xl font-black text-slate-950">{category.name}</h2>
      </div>
      <Link href={`/category/${category.slug}`} className="text-sm font-bold text-red-600 hover:text-red-700">
        See all
      </Link>
    </div>
  );
}

function CategorySection({ section, sectionIndex, layout }) {
  const { category, items } = section;
  const lead = items[0];
  const side = items.slice(1, 4);
  const rest = items.slice(4, 7);

  if (layout === 2) {
    return (
      <section id={`category-${category.slug}`} className="scroll-mt-28">
        <SectionHeader category={category} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.slice(0, 7).map(item => (
            <NewsCard key={item._id} news={item} compact />
          ))}
        </div>
      </section>
    );
  }

  if (layout === 3) {
    return (
      <section id={`category-${category.slug}`} className="scroll-mt-28">
        <SectionHeader category={category} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {items.slice(0, 7).map(item => (
              <NewsCard key={item._id} news={item} horizontal />
            ))}
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-md p-4">
            <h3 className="font-black text-slate-900 mb-4">Latest {category.name}</h3>
            <div className="space-y-3">
              {items.slice(0, 7).map(item => (
                <Link key={item._id} href={`/news/${item.slug}`}>
                  <p className="text-sm font-bold text-slate-700 hover:text-red-600 line-clamp-2">{item.title}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id={`category-${category.slug}`} className="scroll-mt-28">
      <SectionHeader category={category} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {lead && (
          <div className="lg:col-span-6">
            <Link href={`/news/${lead.slug}`}>
              <div className="group h-full bg-white border border-slate-200 rounded-md overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48 sm:h-72 bg-slate-100 overflow-hidden">
                  {lead.featuredImage && (
                    <img
                      src={lead.featuredImage}
                      alt={lead.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-red-600 text-white text-xs font-black rounded">
                    {sectionIndex === 0 ? 'Top Story' : category.name}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-2xl font-black text-slate-950 line-clamp-2 group-hover:text-red-600">{lead.title}</h3>
                  <p className="text-slate-600 text-sm line-clamp-3 mt-3">{lead.excerpt}</p>
                </div>
              </div>
            </Link>
          </div>
        )}
        <div className="lg:col-span-3 space-y-4">
          {side.map(item => (
            <NewsCard key={item._id} news={item} compact />
          ))}
        </div>
        <div className="lg:col-span-3 bg-slate-50 border border-slate-200 rounded-md p-4">
          <h3 className="font-black text-slate-900 mb-4">More {category.name}</h3>
          <div className="space-y-4">
            {(rest.length > 0 ? rest : side).map(item => (
              <Link key={item._id} href={`/news/${item.slug}`} className="block border-b border-slate-200 pb-3 last:border-0 last:pb-0">
                <p className="text-sm font-bold text-slate-800 hover:text-red-600 line-clamp-2">{item.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default async function HomePage() {
  await connectDB();

  const [settings, categories, trendingNews, featuredNews] = await Promise.all([
    Settings.findOne().lean().catch(() => null),
    Category.find({ isActive: true }).sort({ name: 1 }).lean(),
    News.find({ isTrending: true, status: 'published' })
      .populate('category', 'name slug color')
      .populate('author', 'name')
      .sort({ publishedAt: -1 })
      .limit(20)
      .lean(),
    News.find({ status: 'published' })
      .populate('category', 'name slug color')
      .populate('author', 'name')
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(1)
      .lean(),
  ]);

  const categoryIds = categories.map(c => c._id);
  const allCategoryNews = categoryIds.length > 0
    ? await News.find({ category: { $in: categoryIds }, status: 'published' })
        .populate('category', 'name slug color')
        .populate('author', 'name')
        .sort({ publishedAt: -1, createdAt: -1 })
        .lean()
    : [];

  const newsByCategory = {};
  categories.forEach(cat => {
    newsByCategory[cat._id] = [];
  });
  allCategoryNews.forEach(item => {
    const catId = String(item.category?._id || item.category);
    if (newsByCategory[catId] && newsByCategory[catId].length < 7) {
      newsByCategory[catId].push(item);
    }
  });

  const featured = featuredNews[0] || allCategoryNews[0] || null;
  const layout = settings?.selectedLayout || 1;

  const categorySections = categories
    .map(category => ({
      category,
      items: newsByCategory[category._id] || [],
    }))
    .filter(section => section.items.length > 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar categories={categories} />
      <TrendingNews items={trendingNews} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {featured && (
          <Link href={`/news/${featured.slug}`} className="block mb-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 bg-white border border-slate-200 rounded-md overflow-hidden hover:shadow-xl transition-shadow group">
              <div className="lg:col-span-7 relative h-56 sm:h-80 lg:h-[420px] bg-slate-200 overflow-hidden">
                {featured.featuredImage && (
                  <img
                    src={featured.featuredImage}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>
              <div className="lg:col-span-5 p-6 lg:p-8 flex flex-col justify-center">
                <span className="text-xs font-black uppercase text-red-600 tracking-wider">{featured.category?.name || 'Featured'}</span>
                <h1 className="text-3xl lg:text-5xl font-black text-slate-950 leading-tight mt-3 group-hover:text-red-600 transition-colors">
                  {featured.title}
                </h1>
                <p className="text-slate-600 mt-4 line-clamp-3">{featured.excerpt}</p>
              </div>
            </div>
          </Link>
        )}

        <AdDisplay position="inline" className="mb-12 flex justify-center" />

        <VideoNewsSection />

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-9 space-y-12">
            {categorySections.map((section, index) => (
              <CategorySection key={section.category._id} section={section} sectionIndex={index} layout={layout} />
            ))}

            {categorySections.length === 0 && (
              <div className="text-center py-10 text-slate-500">No news available.</div>
            )}
          </div>
          <aside className="lg:col-span-3 mt-12 lg:mt-0">
            <div className="sticky top-24 space-y-6">
              <AdDisplay position="sidebar" />
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
