
import React from 'react';

interface Props {
  title: string;
  icon?: string;
  children: React.ReactNode;
  id?: string;
}

const SectionWrapper: React.FC<Props> = ({ title, icon, children, id }) => {
  return (
    <section id={id} className="py-20 first:pt-10">
      <div className="flex items-center gap-4 mb-10">
        {icon && (
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <i className={`fa-solid ${icon} text-xl`}></i>
          </div>
        )}
        <h2 className="text-3xl font-bold tracking-tight text-slate-800">
          {title}
        </h2>
      </div>
      <div className="pl-0 md:pl-16">
        {children}
      </div>
    </section>
  );
};

export default SectionWrapper;
