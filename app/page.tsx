"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Check } from "lucide-react";
import { SocialIcon } from "react-social-icons";

import { getRecommendedProducts } from "@/actions/product";
import { Benefit } from "@/components/Benefit";
import { ImageSlider } from "@/components/ImageSlider";
import { IndexLayout } from "@/components/Layout/Index";
import { NatureGoldBanner } from "@/components/NatureGoldBanner";
import { ProductCard } from "@/components/ProductCard";
import { SearchBar } from "@/components/SearchBar";

const hospitalBenefits = [
  {
    id: 1,
    title: "Hospital-grade Safety",
    description: "Complies with hygiene and food handling standards.",
  },
  {
    id: 2,
    title: "Luxury Branding",
    description:
      "Enhances the hospital's premium image and patient experience.",
  },
  {
    id: 3,
    title: "Sustainably Sourced",
    description:
      "Environmentally conscious practices that reflect healthcare's commitment to the planet.",
  },
];

const certifications = [
  {
    id: 1,
    src: "https://seajoy.com/images/company-news/AB_eurofeuille.png",
    alt: "EU Organic Certification",
  },
  {
    id: 2,
    src: "https://1.bp.blogspot.com/-lofZ1ZddkjA/VrRvD8Y24KI/AAAAAAAACpM/QsG8-zh5pY8/s1600/iso_icon.png",
    alt: "ISO Certification",
  },
  {
    id: 3,
    src: "https://vectorseek.com/wp-content/uploads/2023/09/Bio-nach-EG-Oko-Verordnung-Logo-Vector.svg-.png",
    alt: "Bio Certification",
  },
];

const socialPlatforms = [
  {
    id: 1,
    network: "facebook",
    name: "Facebook (FAOS.Honey and Olive oil)",
    href: "https://web.facebook.com/FAOShertitagefood/?_rdc=1&_rdr#",
  },
  {
    id: 2,
    network: "instagram",
    name: "Instagram",
    href: "https://www.instagram.com/patcharin_chanaphukdee/?igsh=cW5remt1NnA1dTdv&utm_source=qr#",
  },
  {
    id: 3,
    network: "whatsapp",
    name: "WhatsApp",
    href: "https://www.siam10winery.com/aboutus.html#",
  },
  {
    id: 4,
    network: "tiktok",
    name: "TikTok",
    href: "https://www.tiktok.com/@faos533?_t=ZS-8yBgK20OQVe&_r=1",
  },
  {
    id: 5,
    network: "line.me",
    name: "LINE Official",
    href: "https://line.me/R/ti/p/@043kioyk?oat_content=url&ts=07202345",
  },
];

const researchLinks = [
  {
    id: 1,
    title: "Olive oil is beneficial for maternal-fetal health",
    href: "https://oeisobmqacdbiotylrwm.supabase.co/storage/v1/object/public/images/homepage/precanancy.jpg",
  },
  {
    id: 2,
    title: "Healthline: Benefits of Honey",
    href: "https://nycancer.com/news/olive-oil-key-component-mediterranean-diet",
  },
  {
    id: 3,
    title: "Olive Oil~ A Key Component of the Mediterranean Diet",
    href: "https://www.sciencedirect.com/science/article/pii/S0308814618310649",
  },
  {
    id: 4,
    title: "Using Greek Honey for Beautiful Skin, Hair, and Anti-Aging",
    href: "https://oeisobmqacdbiotylrwm.supabase.co/storage/v1/object/public/images/homepage/Cleopatra%20and%20honey%20skin%20care.jpg",
  },
  {
    id: 5,
    title: "Everything to Know About the Health Benefits of Honey",
    href: "https://www.healthline.com/nutrition/benefits-of-honey#TOC_TITLE_HDR_3",
  },
];

const founder = {
  name: "Patcharin Chanaphukdee",
  image:
    "https://oeisobmqacdbiotylrwm.supabase.co/storage/v1/object/public/images/homepage/pomfood.jpg",
  description:
    "Created for Health, Elegance and Well-Being. Elevate patient care and hospitality with the FAOS Collection, a luxurious blend of Thai-Greek heritage, organic purity and health innovation. Designed for discerning healthcare environments that prioritize natural healing and quality without compromise.",
};

const SectionHeader = ({ title }: { title: string }) => (
  <div className="bg-secondary flex w-full flex-col rounded-t-lg p-2.5 text-center shadow">
    <h2 className="text-2xl font-bold text-red-800">{title}</h2>
  </div>
);

const openLink = (href?: string) => {
  if (href) {
    window.open(href, "_blank", "noopener,noreferrer");
  }
};

const Homepage = () => {
  const { data: products } = useQuery({
    queryKey: ["recommended/products"],
    queryFn: () => getRecommendedProducts(),
  });

  const hasProducts =
    products && Array.isArray(products) && products.length > 0;

  return (
    <IndexLayout>
      <SearchBar />
      <NatureGoldBanner />
      <ImageSlider
        images={[
          "https://oeisobmqacdbiotylrwm.supabase.co/storage/v1/object/public/images/homepage/Celebrating-Beekeeping-Around-the-World-Apimondia.jpg",
          "https://oeisobmqacdbiotylrwm.supabase.co/storage/v1/object/public/images/homepage/Screenshot-2568-06-25-at-06-21-30.png",
          "https://oeisobmqacdbiotylrwm.supabase.co/storage/v1/object/public/images/homepage/104926993.avif",
          "https://oeisobmqacdbiotylrwm.supabase.co/storage/v1/object/public/images/homepage/360_F_1405149352_K4qhIYVahGLumUCry09QJaDyquDaXVrh.jpg",
        ]}
      />

      {/* Recommended products Section */}
      <div className="bg-secondary flex w-full flex-col rounded-lg p-2.5 text-center shadow">
        <h2 className="text-2xl font-bold text-red-800">
          Recommended products
        </h2>
      </div>

      {hasProducts ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            return <ProductCard key={product?.id} product={product} />;
          })}
        </div>
      ) : null}

      {/* Company Description Section */}
      <section className="flex flex-col">
        <SectionHeader title="FAOS Premium Organic Collection – Premium Olive Oil and Real Honey" />
        <div className="flex w-full flex-col items-center gap-5 rounded-b-lg bg-white p-5 sm:flex-row">
          <div className="flex shrink-0 flex-col gap-2.5 text-center">
            <img
              src={founder.image}
              alt={`Portrait of ${founder.name}, FAOS founder`}
              className="size-52 object-cover"
            />
            <span>({founder.name})</span>
          </div>
          <div className="w-full text-xl">{founder.description}</div>
        </div>
      </section>

      {/* Hospital Benefits Section */}
      <section className="flex flex-col">
        <SectionHeader title="Why FAOS is Needed for Private Hospitals?" />
        <div className="flex w-full flex-col gap-2.5 rounded-b-lg bg-white p-5">
          {hospitalBenefits.map((benefit) => (
            <div key={benefit.id} className="flex gap-2.5">
              <div className="flex size-8 flex-shrink-0 items-center justify-center rounded-full border border-[#f3d27a]">
                <Check className="text-primary" />
              </div>
              <span className="w-full text-xl">
                <span className="text-primary font-bold">{benefit.title}</span>{" "}
                {benefit.description}
              </span>
            </div>
          ))}
        </div>
      </section>

      <Benefit />

      {/* Certifications Section */}
      <section className="flex flex-col">
        <SectionHeader title="Certification compliance with organic, safety, and hygiene standards" />
        <div className="flex w-full flex-col gap-5 rounded-b-lg bg-white p-5">
          <div className="flex justify-center gap-5">
            {certifications.map((cert) => (
              <img
                key={cert.id}
                className="size-18 object-contain sm:size-28"
                src={cert.src}
                alt={cert.alt}
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Social Media & Research Section */}
      <div className="flex flex-col justify-between gap-5 lg:flex-row">
        {/* Follow Us */}
        <section className="flex w-full flex-col">
          <SectionHeader title="Follow Us" />
          <div className="grid w-full grid-cols-1 gap-5 rounded-b-lg bg-white p-5 sm:grid-cols-2">
            {socialPlatforms.map((platform) => (
              <div
                key={platform.id}
                className="flex cursor-pointer items-center gap-2.5 transition-opacity hover:opacity-80"
                onClick={() => openLink(platform.href)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openLink(platform.href);
                  }
                }}
              >
                <SocialIcon
                  network={platform.network}
                  style={{ width: 38, height: 38 }}
                />
                <span>{platform.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Research & References */}
        <section className="flex w-full flex-col">
          <SectionHeader title="Research & References" />
          <div className="flex w-full flex-col gap-5 rounded-b-lg bg-white p-5">
            {researchLinks.map((link) => (
              <div
                key={link.id}
                className="flex cursor-pointer gap-2.5 transition-opacity hover:opacity-80"
                onClick={() => openLink(link.href)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openLink(link.href);
                  }
                }}
              >
                <div className="flex size-8 flex-shrink-0 items-center justify-center rounded-full border border-[#f3d27a]">
                  <ArrowUpRight className="text-primary" />
                </div>
                <span className="w-full text-xl">{link.title}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </IndexLayout>
  );
};

export default Homepage;
