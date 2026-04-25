import Image from 'next/image';

type ArticleFeaturedImageProps = {
  imageUrl: string;
  imageAlt: string;
  caption: string;
};

export function ArticleFeaturedImage({
  imageUrl,
  imageAlt,
  caption,
}: ArticleFeaturedImageProps) {
  return (
    <figure className="mb-12">
      <div className="aspect-video w-full bg-zinc-900 rounded-[2rem] overflow-hidden border border-zinc-200/80 shadow-sm relative">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover opacity-90"
          priority
          sizes="(min-width: 1024px) 960px, 100vw"
        />
      </div>
      <figcaption className="text-xs font-light text-center text-zinc-500 mt-4">
        {caption}
      </figcaption>
    </figure>
  );
}
