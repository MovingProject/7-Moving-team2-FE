interface PageTitleAreaProps {
  title: string;
}

export default function PageTitleArea({ title }: PageTitleAreaProps) {
  return (
    <div className="lg:pt-3">
      <div className="mx-auto flex border-b border-gray-200 px-4 py-2 md:px-5 lg:max-w-[1400px] lg:gap-0 lg:px-5 xl:max-w-[1400px] xl:gap-8 xl:px-0">
        <h2 className="text-lg font-semibold lg:text-2xl">{title}</h2>
      </div>
    </div>
  );
}
