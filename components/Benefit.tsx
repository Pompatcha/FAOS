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
      title: 'Using Natural Honey for Beautiful Skin, Hair, and Anti-Aging',
      href: 'https://greekreporter.com/2023/07/09/greek-honey-for-beautiful-skin-hair-and-anti-aging/',
      image:
        'https://oeisobmqacdbiotylrwm.supabase.co/storage/v1/object/public/images/homepage/Honey_Greece_Greek_honey_credit_GR_AP.webp',
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
        'Food for thought: Thailand Tom yum kung gets the nod from UNESCO pairing with Greek wine',
      href: 'https://www.nationthailand.com/life/food/40043849',
      image:
        'https://oeisobmqacdbiotylrwm.supabase.co/storage/v1/object/public/images/homepage/eve6.jpg',
    },
    {
      id: 3,
      title: 'Wine healthy and benefit',
      href: 'https://www.siam10winery.com/xxxx',
      image:
        'https://oeisobmqacdbiotylrwm.supabase.co/storage/v1/object/public/images/homepage/wine-and-health-hope-hype-winefolly.jpg',
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
          key={`benefit-section-${sectionIndex}`}
          className='flex w-full flex-col gap-5'
        >
          <div className='bg-secondary flex w-full flex-col rounded-lg p-2.5 text-center shadow'>
            <h2 className='text-2xl font-bold text-red-800'>{section.title}</h2>
          </div>

          <div className='grid grid-cols-1 gap-5 sm:grid-cols-3'>
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
