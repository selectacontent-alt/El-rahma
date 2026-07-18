const fs = require('fs');

const path = 'd:\\select website\\frontend\\src\\components\\SoftwareExperience.tsx';
let content = fs.readFileSync(path, 'utf8');

const missingBlock = `                               className="text-2xl font-black"
                               style={{ color: activeService.accent }}
                             >
                               {isAr ? pkg.priceAr : pkg.priceEn}
                             </motion.div>
                          </div>

                          <div className="space-y-3">
                            {(isAr ? pkg.featuresAr : pkg.featuresEn).map((feature) => (
                              <div key={feature} className="flex items-start gap-2 text-xs font-bold text-slate-300 transition-colors group-hover:text-slate-100">
                                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 transition-colors" style={{ color: activeService.accent }} />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={goToContact}
                          className={cx(
                            "mt-8 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl text-xs font-black transition-all duration-300 active:scale-95",
                            isRecommended 
                              ? "bg-[#9d027c] text-white shadow-md hover:bg-[#8a026e]" 
                              : "bg-slate-950 text-slate-300 hover:bg-[#9d027c] hover:text-white border border-white/5"
                          )}
                        >
                          <span>{text.requestPackage}</span>
                          {arrowIcon}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <section className="border-y border-violet-950/30 bg-transparent py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 grid gap-5 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-12">
              <h2 className="text-3xl font-black leading-tight text-slate-200 sm:text-4xl">
                {text.modulesTitle}
              </h2>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ideaModules.map((item, index) => {
              const Icon = item.icon;
              const accent = ['#9d027c', '#0ea5e9', '#f97316', '#7c3aed', '#12b981', '#ef4444'][index];

              return (
`;

// Find the start of the corruption
const part1 = content.split('                               className="text-2xl font-black"')[0];
// Find the end of the corruption
const part2 = content.split('                <motion.article').slice(1).join('                <motion.article');

fs.writeFileSync(path, part1 + missingBlock + '                <motion.article' + part2, 'utf8');
console.log("File fixed!");
