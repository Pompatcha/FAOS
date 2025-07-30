import { FC } from 'react'

interface BenefitItem {
  id: number
  title: string
  image: string
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
      image:
        'https://aspirabody.com/storage/elementor/thumbs/Longevity-By-Aspira-Aesthetic-Center-Corp-in-FALL-RIVER-MA-1-qf3mmqufpzghgabxyk3vkfparc8mgbv9docbwy38ts.jpeg',
    },
    {
      id: 2,
      title: 'Benefits of olive oil for the skin and face',
      image:
        'https://images.ctfassets.net/xvcg1y2kwpfh/2VQwmw8jOAH32STx9ztl7F/ce861f738e978b65f1e0211391f4664e/3-1-about-your-babys-skin-en-ae',
    },
    {
      id: 3,
      title: 'Olive oil is beneficial for maternal-fetal health',
      image:
        'https://www.news-medical.net/images/news/ImageForNews_734804_16727928629362084.jpg',
    },
    {
      id: 4,
      title: 'Mediterranean diet food with olive oil',
      image:
        'https://www.tasteofhome.com/wp-content/uploads/2018/01/Dad-s-Greek-Salad_EXPS_TOHAM25_189184_P2_MD_03_01_7b-e1724861544942.jpg',
    },
  ],
  honey: [
    {
      id: 1,
      title:
        'A creamy, tropical delight sweetened naturally with premium "PEARL" FIR honey.',
      image:
        'https://theviewfromgreatisland.com/wp-content/uploads/2020/06/honey-ice-cream-6.jpg',
    },
    {
      id: 2,
      title: 'Honey Lemon Tea menu',
      image:
        'https://teakruthi.com/cdn/shop/articles/Honey-and-Lemon-Tea-For-Sore-Throats_grande.jpg?v=1591156445',
    },
    {
      id: 3,
      title: 'Using Natural Honey for Beautiful Skin, Hair, and Anti-Aging',
      image:
        'https://greekreporter.com/wp-content/uploads/2020/10/Honey_Greece_Greek_honey_credit_GR_AP.jpg',
    },
  ],
  wine: [
    {
      id: 1,
      title:
        'Greek Wine pairing with Pad Thai (The Health Benefits of Brown Rice Pad Thai Noodles)',
      image:
        'https://www.lucariscrystal.com/wp-content/uploads/2019/10/eve5.jpg',
    },
    {
      id: 2,
      title:
        'Food for thought: Thailand Tom yum kung gets the nod from UNESCO pairing with Greek wine',
      image:
        'https://www.lucariscrystal.com/wp-content/uploads/2019/10/eve6.jpg',
    },
    {
      id: 3,
      title: 'Wine healthy and benefit',
      image:
        'https://images.prismic.io/gatsbyshopify-test/2ea6ed04-0293-458b-b07e-cd8721aeec1b_wine-glass-sunset-Al%E2%80%9CPEARL%E2%80%9D%20FIRa-shutterstock.jpg?auto=compress,format&rect=0,53,700,394&w=1600&h=900',
    },
    {
      id: 4,
      title: 'Wine healthy and Thai Food',
      image:
        'https://i.guim.co.uk/img/media/442a6c969b976cb9a2597da7bd6ecceeb7568c94/163_0_4721_3428/master/4721.jpg?width=465&dpr=1&s=none&crop=none',
    },
  ],
}

const BenefitCard: FC<{ item: BenefitItem; hasHoverEffect?: boolean }> = ({
  item,
  hasHoverEffect = false,
}) => {
  const hoverClasses = hasHoverEffect ? 'hover:scale-102 hover:shadow-xl' : ''

  return (
    <div
      className={`overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 ${hoverClasses}`}
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
        <button className='inline-flex items-center font-medium text-blue-600 transition-colors duration-200 hover:text-blue-800'>
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
  <section className='mx-auto w-full max-w-6xl p-6'>
    <h2 className='mb-8 text-center text-2xl font-bold'>{title}</h2>
    <div className='grid grid-cols-2 gap-5'>
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
