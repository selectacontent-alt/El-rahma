import re

file_path = "src/components/SCNewsPage.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

search_string = """<div className="mt-8 rounded-[8px] border border-[#e8e8ee] bg-[#f7f7f9] p-4 sm:p-5">
                  <h3 className="mb-3 flex items-center gap-2 text-base font-black text-[#161616]">
                    <Link2 className="h-4 w-4" style={{ color: articleIdentity.accent }} />"""

index = content.find(search_string)
if index == -1:
    print("Could not find the search string")
    exit(1)

content = content[:index]

correct_rest = """<div className="mt-8 rounded-[8px] border border-[#e8e8ee] bg-[#f7f7f9] p-4 sm:p-5">
                  <h3 className="mb-3 flex items-center gap-2 text-base font-black text-[#161616]">
                    <Link2 className="h-4 w-4" style={{ color: articleIdentity.accent }} />
                    {t.internalLinks}
                  </h3>
                  <div className="grid gap-2">
                    {related.slice(0, 3).map((item) => (
                      <button key={item.slug} onClick={() => navigateToArticle(item.slug)} className="text-start text-sm font-bold leading-7 text-[#666] hover:text-[#9d027c]">
                        {getTitle(item, currentLang)}
                      </button>
                    ))}
                  </div>
                </div>

                {!!article.tags?.length && (
                  <div className="mt-8 flex flex-wrap gap-2">
                    {article.tags.map((tagItem) => (
                      <span key={tagItem.slug} className="inline-flex items-center gap-1 rounded-[8px] border bg-white px-3 py-1.5 text-xs font-bold text-[#666666] transition hover:text-white" style={{ borderColor: `${articleIdentity.accent}33` }}>
                        <Tag className="h-3.5 w-3.5" />
                        {isAr ? tagItem.name_ar : tagItem.name_en || tagItem.name_ar}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-8 flex flex-col justify-between gap-4 border-t border-[#e8e8ee] pt-6 sm:flex-row sm:items-center">
                  <span className="text-sm font-black text-[#161616]">{t.shareArticle}</span>
                  <ShareButtons article={article} lang={currentLang} copied={copiedLink} onCopy={copyArticleLink} />
                </div>

                <div className="mt-8 rounded-[8px] border border-[#e8e8ee] bg-[#fbfbfc] p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[8px] text-white" style={{ backgroundColor: articleIdentity.accent }}>
                      {article.author?.avatar_url ? (
                        <img src={publicDriveUrl(article.author.avatar_url, article.author.avatar_url, "w400")} alt={getAuthorName(article, currentLang)} className="h-full w-full rounded-[8px] object-cover" />
                      ) : (
                        <UserRound className="h-8 w-8" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-black" style={{ color: articleIdentity.accent }}>{t.authorTitle}</div>
                      <h3 className="mt-1 text-xl font-black text-[#161616]">{getAuthorName(article, currentLang)}</h3>
                      <p className="mt-2 text-sm font-semibold leading-7 text-[#666666]">
                        {isAr
                          ? article.author?.bio_ar || "نكتب محتوى متخصص حول أخبار السوق، التسويق الرقمي، وتحسين ظهور الشركات على الإنترنت."
                          : article.author?.bio_en || article.author?.bio_ar || "We publish specialized content about market news, digital marketing, and business visibility."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {previousArticle && (
                    <button onClick={() => navigateToArticle(previousArticle.slug)} className="rounded-[8px] border border-[#e8e8ee] bg-white p-4 text-start transition hover:border-[#9d027c]/30">
                      <span className="flex items-center gap-2 text-xs font-black text-[#9d027c]">
                        {isAr ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                        {t.previousArticle}
                      </span>
                      <span className="mt-2 block text-base font-black leading-7 text-[#161616]">{getTitle(previousArticle, currentLang)}</span>
                    </button>
                  )}
                  {nextArticle && (
                    <button onClick={() => navigateToArticle(nextArticle.slug)} className="rounded-[8px] border border-[#e8e8ee] bg-white p-4 text-start transition hover:border-[#9d027c]/30">
                      <span className="flex items-center gap-2 text-xs font-black text-[#9d027c]">
                        {t.nextArticle}
                        {isAr ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </span>
                      <span className="mt-2 block text-base font-black leading-7 text-[#161616]">{getTitle(nextArticle, currentLang)}</span>
                    </button>
                  )}
                </div>
              </section>

              <section className="mt-12">
                <SectionTitle icon={BookOpen} title={t.related} />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((item) => (
                    <NewsCard key={item.slug} article={item} lang={currentLang} onNavigate={navigateToArticle} compact />
                  ))}
                </div>
              </section>
            </article>

            <ArticleSidebar
              lang={currentLang}
              identity={articleIdentity}
              latest={latestForArticle}
              trending={trendingForArticle}
              categories={home.categories.length ? home.categories : fallbackHome.categories}
              query={query}
              setQuery={setQuery}
              email={email}
              setEmail={setEmail}
              newsletterState={newsletterState}
              submitNewsletter={submitNewsletter}
              onNavigate={navigateToArticle}
              setActiveTab={setActiveTab}
            />
          </div>
        </main>
      </div>
    );
  }

  if (categorySlug) {
    const section = sectionConfigs.find((item) => item.slug === categorySlug) || sectionConfigs.find((item) => item.slug === "articles") || sectionConfigs[0];
    const identity = getSectionIdentity(categorySlug);

    return (
      <NewsCategoryPage
        section={section}
        identity={identity}
        articles={categoryArticles}
        home={home}
        lang={currentLang}
        query={query}
        setQuery={setQuery}
        email={email}
        setEmail={setEmail}
        newsletterState={newsletterState}
        submitNewsletter={submitNewsletter}
        onNavigateArticle={navigateToArticle}
        onNavigateHome={navigateHome}
        onNavigateCategory={navigateToCategory}
        setActiveTab={setActiveTab}
      />
    );
  }

  const featured = home.featured || fallbackHome.featured;
  const heroSide = home.hero_side.length ? home.hero_side : fallbackHome.hero_side;
  const trending = home.trending.length ? home.trending : fallbackHome.trending;

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="min-h-screen overflow-x-hidden bg-[#f7f7f9] pt-20 text-[#1f1f1f] sm:pt-24">
      <NewsMasthead lang={currentLang} query={query} setQuery={setQuery} onNavigateHome={navigateHome} onNavigateCategory={navigateToCategory} activeSlug={null} setActiveTab={setActiveTab} />

      <section className="bg-[#9d027c] text-white mt-4 sm:mt-6">
        <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-hidden px-3 py-3 sm:gap-4 sm:px-6 lg:px-8">
          <span className="shrink-0 rounded bg-[#ffbc01] px-3 py-1 text-xs font-black text-[#1f1f1f]">{t.breaking}</span>
          <div className="flex min-w-0 gap-6 overflow-x-auto text-sm font-bold">
            {(home.breaking.length ? home.breaking : fallbackHome.breaking).map((item) => (
              <button key={item.slug} onClick={() => navigateToArticle(item.slug)} className="shrink-0 hover:text-[#ffbc01]">
                {getTitle(item, currentLang)}
              </button>
            ))}
          </div>
          {usingFallback && <span className="ms-auto hidden shrink-0 text-[11px] font-bold text-white/70 lg:inline">{t.sourceFallback}</span>}
        </div>
      </section>

      <main className="pt-8 sm:pt-10 lg:pt-12">

        <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-8 sm:px-6 md:grid-cols-2 xl:grid-cols-[1.5fr_0.85fr_0.8fr] lg:px-8">
          {featured && (
            <button onClick={() => navigateToArticle(featured.slug)} className="group relative min-h-[360px] overflow-hidden rounded-[8px] bg-[#1f1f1f] text-start shadow-[0_8px_24px_rgba(0,0,0,0.08)] sm:min-h-[440px] md:col-span-2 xl:col-span-1 xl:min-h-[420px]">
              <ArticleImage article={featured} large lang={currentLang} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-7">
                <span className="rounded bg-[#ffbc01] px-3 py-1 text-xs font-black text-[#1f1f1f]">{getCategoryName(featured.category, currentLang)}</span>
                <h2 className="mt-4 break-words text-2xl font-black leading-[1.35] text-white sm:text-4xl sm:leading-[1.42] lg:text-5xl">{getTitle(featured, currentLang)}</h2>
                <p className="mt-3 line-clamp-2 max-w-2xl text-sm font-semibold leading-7 text-white/82 sm:line-clamp-none">{getExcerpt(featured, currentLang)}</p>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-bold text-white/72">
                  <span>{getAuthorName(featured, currentLang)}</span>
                  <span>{formatDate(featured.published_at, currentLang)}</span>
                </div>
              </div>
            </button>
          )}

          <div className="grid gap-4">
            {heroSide.map((item) => <SmallArticle key={item.slug} article={item} lang={currentLang} onNavigate={navigateToArticle} />)}
          </div>

          <TrendingList articles={trending} lang={currentLang} onNavigate={navigateToArticle} />
        </section>

        <section className="bg-white py-10 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionTitle icon={Newspaper} title={t.latest} />
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredLatest.slice(0, 9).map((item) => <NewsCard key={item.slug} article={item} lang={currentLang} onNavigate={navigateToArticle} />)}
            </div>
          </div>
        </section>

        <NewsroomDirectory lang={currentLang} onNavigateCategory={navigateToCategory} />

        <section className="py-10 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionTitle icon={Tag} title={t.categories} />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {(home.categories.length ? home.categories : fallbackHome.categories).map((category) => (
                <button key={category.slug} onClick={() => navigateToCategory(category.slug)} className="rounded-[8px] border border-[#e8e8ee] bg-white p-5 text-start shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition hover:-translate-y-1 hover:border-[#9d027c]/30">
                  <h3 className="text-xl font-black text-[#9d027c]">{getCategoryName(category, currentLang)}</h3>
                  <p className="mt-3 text-sm font-medium leading-7 text-[#666666]">
                    {isAr ? category.description_ar || "تابع أحدث الأخبار والتحليلات في هذا القسم." : category.description_en || "Follow the latest updates and analysis in this category."}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-[8px] bg-[#9d027c] p-6 text-white sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
              <div>
                <Mail className="h-8 w-8 text-[#ffbc01]" />
                <h2 className="mt-3 max-w-2xl text-2xl font-black leading-[1.45] sm:text-3xl lg:text-4xl">{t.newsletterTitle}</h2>
              </div>
              <form onSubmit={submitNewsletter} className="flex flex-col gap-3 sm:flex-row">
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={t.newsletterPlaceholder}
                  className="min-h-12 flex-1 rounded-[8px] border border-white/20 bg-white px-4 text-sm font-bold text-[#1f1f1f] outline-none"
                />
                <button className="min-h-12 rounded-[8px] bg-[#ffbc01] px-6 text-sm font-black text-[#1f1f1f]">{t.subscribe}</button>
              </form>
            </div>
            {newsletterState !== "idle" && (
              <p className="mt-4 text-sm font-bold text-white/85">
                {newsletterState === "success" ? t.subscribeDone : t.subscribeError}
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
"""

content += correct_rest

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Fix applied.")
