import { CustomImage, DynamicHtmlTag, HeadingTag } from "@/components";

export default function NotFoundPage() {
  return (
    <DynamicHtmlTag type="div" className="h-full flex justify-center items-center bg-white rounded-2xl">
      <DynamicHtmlTag type="div" className="text-center">
        <CustomImage
          src="/images/error-404.svg"
          width={400}
          height={400}
          alt="blue-logo"
          className="w-3/5 max-w-64 xl:max-w-96 2xl:max-w-md mx-auto"
        />
        <HeadingTag type="h2" className="mt-2 text-base md:text-xl 2xl:text-3xl text-black font-semibold">
          This page could not be found.
        </HeadingTag>
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
}
