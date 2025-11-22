import { ChevronRight } from 'lucide-react'

const benefitData = {
  oliveOil: [
    {
      id: 1,
      title: 'High olive oil consumption associated with longevity',
      href: 'https://www.health.harvard.edu/staying-healthy/harvard-study-high-olive-oil-consumption-associated-with-longevity',
      image:
        'https://oeisobmqacdbiotylrwm.supabase.co/storage/v1/object/public/images/homepage/Longevity-By-Aspira-Aesthetic-Center-Corp-in-FALL-RIVER-MA-1-qf3mmqufpzghgabxyk3vkfparc8mgbv9docbwy38ts.webp',
    },
    {
      id: 2,
      title: 'Benefits of olive oil for the skin and face',
      href: 'https://www.siam10winery.com/Olive_benfefit.html',
      image:
        'https://oeisobmqacdbiotylrwm.supabase.co/storage/v1/object/public/images/homepage/3-1-about-your-babys-skin-en-ae.jpg',
    },
    {
      id: 3,
      title: 'Olive oil is beneficial for maternal-fetal health',
      href: 'https://www.news-medical.net/news/20230103/Olive-oil-is-beneficial-for-maternal-fetal-health.aspx',
      image:
        'https://oeisobmqacdbiotylrwm.supabase.co/storage/v1/object/public/images/homepage/ImageForNews_734804_16727928629362084.webp',
    },
    {
      id: 4,
      title: 'Mediterranean diet food with olive oil',
      href: 'https://nycancer.com/news/olive-oil-key-component-mediterranean-diet',
      image:
        'https://oeisobmqacdbiotylrwm.supabase.co/storage/v1/object/public/images/homepage/Dad-s-Greek-Salad_EXPS_TOHAM25_189184_P2_MD_03_01_7b-e1724861544942.jpg',
    },
    {
      id: 5,
      title: 'Beautyful of Olive Tree in Greek ',
      href: 'https://oeisobmqacdbiotylrwm.supabase.co/storage/v1/object/public/images/homepage/Olive%20oil%20tree.jpg',
      image:
        'https://oeisobmqacdbiotylrwm.supabase.co/storage/v1/object/public/images/homepage/Olive%20oil%20tree.jpg',
    },
    {
      id: 6,
      title: 'Ancient greek food delicious and nutritious dishes.',
      href: 'https://oeisobmqacdbiotylrwm.supabase.co/storage/v1/object/public/images/homepage/Greek%20food.png',
      image:
        'https://oeisobmqacdbiotylrwm.supabase.co/storage/v1/object/public/images/homepage/Greek%20food.png',
    },
  ],
  honey: [
    {
      id: 1,
      title:
        'A creamy, tropical delight sweetened naturally with premium "PEARL" FIR honey.',
      href: 'https://www.siam10winery.com/honeyicecream.html',
      image:
        'https://oeisobmqacdbiotylrwm.supabase.co/storage/v1/object/public/images/homepage/honey-ice-cream-6.jpg',
    },
    {
      id: 2,
      title: 'Honey Lemon Tea menu',
      href: 'https://www.allrecipes.com/recipe/56445/honey-lemon-tea/',
      image:
        'https://oeisobmqacdbiotylrwm.supabase.co/storage/v1/object/public/images/homepage/Honey-and-Lemon-Tea-For-Sore-Throats_grande.webp',
    },
    {
      id: 3,
      title:
        'Honey is used in medicine for wound healing and as a remedy for coughs and sore throats due to its antibacterial, anti-inflammatory, and antioxidant properties. ',
      href: 'https://www.medicalnewstoday.com/articles/264667#medicinal-uses',
      image:
        'https://oeisobmqacdbiotylrwm.supabase.co/storage/v1/object/public/images/homepage/HoneyLemon.png',
    },
  ],
  wine: [
    {
      id: 1,
      title:
        'Greek Wine pairing with Pad Thai (The Health Benefits of Brown Rice Pad Thai Noodles)',
      href: 'https://kingsoba.co.uk/blogs/blog/the-health-benefits-of-brown-rice-pad-thai-noodles',
      image:
        'https://oeisobmqacdbiotylrwm.supabase.co/storage/v1/object/public/images/homepage/eve5.jpg',
    },
    {
      id: 2,
      title:
        'The simply support the body’s natural detox, immune, and anti-inflammatory processes.',

      href: '/article/the-simply-support-the-bodys-natural-detox-immune-and-anti-inflammatory-processes',
      image:
        'https://oeisobmqacdbiotylrwm.supabase.co/storage/v1/object/public/images/homepage/detox.jpg',
    },
    {
      id: 3,
      title: 'The olive variety Athinoelia',
      href: 'https://en.wikipedia.org/wiki/List_of_olive_cultivars',
      image:
        'https://oeisobmqacdbiotylrwm.supabase.co/storage/v1/object/public/images/products/greek%20olive%20tree.png',
    },
    {
      id: 4,
      title: 'Wine healthy and Thai Food',
      href: 'https://www.lifestyleasia.com/bk/dining/drinks/pair-wine-with-thai-food-like-a-pro/',
      image:
        'https://oeisobmqacdbiotylrwm.supabase.co/storage/v1/object/public/images/homepage/4721.avif',
    },
  ],
}

const sections = [
  { title: 'The Benefit of Olive Oil', items: benefitData.oliveOil },
  { title: 'The Benefit of Honey & Healthy Menu', items: benefitData.honey },
  { title: 'The Benefit of Wine & Thai Food pairing', items: benefitData.wine },
]

const openLink = (href: string) => {
  window.open(href, '_blank', 'noopener,noreferrer')
}

const Benefit = () => {
  return (
    <div className='flex w-full flex-col gap-2.5'>
      {sections.map((section, sectionIndex) => (
        <section
          // eslint-disable-next-line react/no-array-index-key
          key={`benefit-section-${sectionIndex}`}
          className='flex w-full flex-col gap-5'
        >
          <div className='bg-secondary flex w-full flex-col rounded-lg p-2.5 text-center shadow'>
            <h2 className='text-2xl font-bold text-red-800'>{section.title}</h2>
          </div>

          <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
            {section.items.map((item) => (
              <div
                key={item.id}
                onClick={() => openLink(item.href)}
                className='cursor-pointer overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-200'
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className='h-72 w-full object-cover'
                  loading='lazy'
                />
                <div className='mt-2.5 px-5 pb-5'>
                  <h3 className='text-lg leading-tight font-semibold text-gray-800'>
                    {item.title}
                  </h3>
                  <button
                    className='group text-primary mt-2.5 inline-flex cursor-pointer items-center font-medium transition-colors duration-200'
                    aria-label={`Read more about ${item.title}`}
                  >
                    Read more
                    <ChevronRight className='transition-transform duration-200 group-hover:translate-x-1' />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export { Benefit }
