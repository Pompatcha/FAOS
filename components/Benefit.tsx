import type { FC } from 'react'

interface BenefitItem {
  id: number
  title: string
  image: string
  href: string
}

interface BenefitSectionProps {
  title: string
  items: BenefitItem[]
  hasHoverEffect?: boolean
}

const BENEFIT_DATA = {
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

const BenefitCard: FC<{ item: BenefitItem; hasHoverEffect?: boolean }> = ({
  item,
}) => {
  return (
    <div
      className={`overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300`}
    >
      <img
        src={item.image}
        alt={item.title}
        className='h-[250px] w-full object-cover'
      />
      <div className='mt-2.5 px-5 pb-5'>
        <h3 className='text-lg leading-tight font-semibold text-gray-800'>
          {item.title}
        </h3>
        <button
          onClick={() => {
            window.open(item.href)
          }}
          className='mt-2.5 inline-flex cursor-pointer items-center font-medium text-blue-600 transition-colors duration-200 hover:text-blue-800'
        >
          Read more
          <svg
            className='ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 5l7 7-7 7'
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

const BenefitSection: FC<BenefitSectionProps> = ({
  title,
  items,
  hasHoverEffect = false,
}) => (
  <section className='flex w-full flex-col gap-5'>
    <div className='bg-secondary flex w-full flex-col rounded-lg p-2.5 text-center shadow'>
      <span className='text-2xl font-bold text-red-800'>{title}</span>
    </div>

    <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
      {items.map((item) => (
        <BenefitCard
          key={item.id}
          item={item}
          hasHoverEffect={hasHoverEffect}
        />
      ))}
    </div>
  </section>
)

const Benefit: FC = () => {
  const sections = [
    {
      title: 'The Benefit of Olive Oil',
      items: BENEFIT_DATA.oliveOil,
      hasHoverEffect: true,
    },
    {
      title: 'The Benefit of Honey & Healthy Menu',
      items: BENEFIT_DATA.honey,
      hasHoverEffect: true,
    },
    {
      title: 'The Benefit of Wine & Thai Food pairing',
      items: BENEFIT_DATA.wine,
      hasHoverEffect: true,
    },
  ]

  return (
    <div className='flex w-full flex-col gap-2.5'>
      {sections.map((section, index) => (
        <BenefitSection
          key={index}
          title={section.title}
          items={section.items}
          hasHoverEffect={section.hasHoverEffect}
        />
      ))}
    </div>
  )
}

export { Benefit }
