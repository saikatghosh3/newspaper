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
import Img from '@/components/Img';

export const revalidate = 60;

const CATEGORY_COLORS = ['#dc2626','#2563eb','#059669','#d97706','#7c3aed','#0891b2','#be185d','#65a30d'];

function SectionHeader({ category, index }) {
  const color = category.color || CATEGORY_COLORS[index % CATEGORY_COLORS.length];
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between rounded-xl px-5 py-3" style={{ backgroundColor: color }}>
        <div className="flex items-center gap-3">
          <span className="w-1 h-6 rounded-full bg-white/40" />
          <h2 className="text-lg font-black text-white tracking-wide">{category.name}</h2>
        </div>
        <Link href={`/category/${category.slug}`} className="text-xs font-bold text-white/80 hover:text-white flex items-center gap-1 transition-colors">
          See all
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </Link>
      </div>
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
        <SectionHeader category={category} index={sectionIndex} />
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
        <SectionHeader category={category} index={sectionIndex} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {items.slice(0, 5).map(item => (
              <NewsCard key={item._id} news={item} horizontal />
            ))}
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h3 className="font-black text-slate-900 mb-4 pb-3 border-b border-slate-200">Latest {category.name}</h3>
            <div className="space-y-0">
              {items.slice(0, 7).map((item, i) => (
                <Link key={item._id} href={`/news/${item.slug}`} className="group flex items-center gap-3 py-3 border-b border-slate-100 last:border-0 last:pb-0 first:pt-0">
                  {item.featuredImage ? (
                    <Img src={item.featuredImage} alt={item.title} loading="lazy" className="shrink-0 w-14 h-14 rounded-lg object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <span className="shrink-0 w-14 h-14 rounded-lg bg-slate-100 group-hover:bg-red-100 flex items-center justify-center text-sm font-black text-slate-400 group-hover:text-red-600 transition-colors">
                      {i + 1}
                    </span>
                  )}
                  <p className="text-sm font-bold text-slate-700 group-hover:text-red-600 line-clamp-2 leading-snug transition-colors">{item.title}</p>
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
      <SectionHeader category={category} index={sectionIndex} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {lead && (
          <div className="lg:col-span-6">
            <Link href={`/news/${lead.slug}`}>
              <div className="group h-full bg-white border border-slate-200 rounded-md overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48 sm:h-72 bg-slate-100 overflow-hidden">
                  <Img
                    src={lead.featuredImage}
                    alt={lead.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
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

  const [settings, categories, trendingNews] = await Promise.all([
    Settings.findOne().select('selectedLayout').lean().catch(() => null),
    Category.find({ isActive: true }).select('name slug color').sort({ name: 1 }).lean(),
    News.find({ isTrending: true, status: 'published' })
      .select('title slug featuredImage category publishedAt')
      .populate('category', 'name slug color')
      .sort({ publishedAt: -1 })
      .limit(10)
      .lean(),
  ]);

  const categoryIds = categories.map(c => c._id);
  const allCategoryNews = categoryIds.length > 0
    ? await News.find({ category: { $in: categoryIds }, status: 'published' })
        .select('title slug excerpt featuredImage category publishedAt')
        .populate('category', 'name slug color')
        .sort({ publishedAt: -1, createdAt: -1 })
        .limit(50)
        .lean()
    : [];

  const plainSettings = settings ? JSON.parse(JSON.stringify(settings)) : null;
  const plainCategories = JSON.parse(JSON.stringify(categories));
  const plainTrending = JSON.parse(JSON.stringify(trendingNews));
  const plainAllNews = JSON.parse(JSON.stringify(allCategoryNews));
  const plainFeatured = plainAllNews[0] || null;

  const newsByCategory = {};
  plainCategories.forEach(cat => {
    newsByCategory[cat._id] = [];
  });
  plainAllNews.forEach(item => {
    const catId = String(item.category?._id || item.category);
    if (newsByCategory[catId] && newsByCategory[catId].length < 7) {
      newsByCategory[catId].push(item);
    }
  });

  const featured = plainFeatured ? JSON.parse(JSON.stringify(plainFeatured)) : null;
  const layout = plainSettings?.selectedLayout || 1;

  const categorySections = plainCategories
    .map(category => ({
      category,
      items: newsByCategory[category._id] || [],
    }))
    .filter(section => section.items.length > 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar categories={plainCategories} />
      <TrendingNews items={plainTrending} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {featured && (
          <Link href={`/news/${featured.slug}`} className="block mb-10">
            <div className="relative bg-slate-900 rounded-2xl overflow-hidden group">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Image */}
                <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-[440px] overflow-hidden">
                  <Img
                    src={featured.featuredImage}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-slate-900" />
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-lg shadow-lg">{featured.category?.name || 'Featured'}</span>
                    <span className="px-3 py-1 bg-black/50 text-white text-xs font-bold rounded-lg backdrop-blur-sm">Top Story</span>
                  </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-5 p-6 lg:p-10 flex flex-col justify-center relative z-10">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight group-hover:text-red-400 transition-colors duration-300">
                    {featured.title}
                  </h1>
                  {featured.excerpt && (
                    <p className="text-slate-400 mt-4 line-clamp-3 leading-relaxed text-sm lg:text-base">{featured.excerpt}</p>
                  )}
                  <div className="flex items-center gap-3 mt-6 pt-5 border-t border-slate-700/50">
                    {featured.author?.name && (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white text-xs font-bold">
                          {featured.author.name.charAt(0)}
                        </div>
                        <span className="text-sm font-semibold text-slate-300">{featured.author.name}</span>
                      </div>
                    )}
                    {featured.publishedAt && (
                      <span className="text-xs text-slate-500">
                        {new Date(featured.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    )}
                    <span className="ml-auto text-xs font-bold text-red-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Read More
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </span>
                  </div>
                </div>
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
