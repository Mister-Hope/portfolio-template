import type { FC, ReactNode } from "react";

interface Props {
  title: string;
  icon?: string;
  children: ReactNode;
  id?: string;
}

export const SectionWrapper: FC<Props> = ({ title, icon, children, id }) => {
  return (
    <section
      id={id}
      className="py-16 md:py-24 first:pt-8 scroll-mt-24 md:scroll-mt-32 border-t border-slate-100 dark:border-white/5 first:border-t-0"
    >
      <div className="flex flex-col gap-10 md:gap-14">
        {/* Section Header */}
        <div className="flex items-center gap-4 md:gap-6">
          {icon && (
            <i
              className={`fa-solid ${icon} text-3xl md:text-4xl lg:text-5xl text-blue-600 dark:text-blue-400 flex-shrink-0`}
            />
          )}
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-slate-900 dark:text-slate-100 leading-none">
              {title}
            </h2>
            <div className="h-1.5 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full" />
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full">{children}</div>
      </div>
    </section>
  );
};
