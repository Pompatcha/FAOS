import { FC } from 'react'

const Benefit: FC = () => {
  const benefits = [
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
      title: 'mediterranean diet food with olive oil',
      image:
        'https://www.tasteofhome.com/wp-content/uploads/2018/01/Dad-s-Greek-Salad_EXPS_TOHAM25_189184_P2_MD_03_01_7b-e1724861544942.jpg',
    },
  ]

  const benefitsHoney = [
    {
      id: 1,
      title:
        'A creamy, tropical delight sweetened naturally with premium “PEARL” FIR honey.',
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
      title: 'Using Natrual Honey for Beautiful Skin, Hair, and Anti-Aging',
      image:
        'https://greekreporter.com/wp-content/uploads/2020/10/Honey_Greece_Greek_honey_credit_GR_AP.jpg',
    },
  ]

  const benefitsWine = [
    {
      id: 1,
      title:
        'Greek Wine paring with Pad Thai (The Health Benefits of Brown Rice Pad Thai Noodles)',
      image:
        'https://www.lucariscrystal.com/wp-content/uploads/2019/10/eve5.jpg',
    },
    {
      id: 2,
      title:
        'Food for thought: Thailand Tom yum kung gets the nod from UNESCO paring with Greek wine',
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
  ]

  return (
    <div className='flex w-full flex-col gap-2.5'>
      <div className='mx-auto w-full max-w-6xl p-6'>
        <h2 className='mb-8 text-center text-2xl font-bold'>
          The Benefit of Olive Oil
        </h2>

        <div className='grid grid-cols-2 gap-5'>
          {benefits.map((benefit) => (
            <div
              key={benefit.id}
              className='overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl'
            >
              <img
                src={benefit?.image}
                className='h-[250px] w-full object-cover'
              />

              <div className='mt-2.5 px-5 pb-5'>
                <h3 className='text-lg leading-tight font-semibold text-gray-800'>
                  {benefit.title}
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
          ))}
        </div>
      </div>

      <div className='mx-auto w-full max-w-6xl p-6'>
        <h2 className='mb-8 text-center text-2xl font-bold'>
          The Benefit of Honey & Healthy Menu
        </h2>

        <div className='grid grid-cols-2 gap-5'>
          {benefitsHoney.map((benefit) => (
            <div
              key={benefit.id}
              className='overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl'
            >
              <img
                src={benefit?.image}
                className='h-[250px] w-full object-cover'
              />

              <div className='mt-2.5 px-5 pb-5'>
                <h3 className='text-lg leading-tight font-semibold text-gray-800'>
                  {benefit.title}
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
          ))}
        </div>
      </div>

      <div className='mx-auto w-full max-w-6xl p-6'>
        <h2 className='mb-8 text-center text-2xl font-bold'>
          The Benefit of Wine & Thai Food pairing
        </h2>

        <div className='grid grid-cols-2 gap-5'>
          {benefitsWine.map((benefit) => (
            <div
              key={benefit.id}
              className='overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl'
            >
              <img
                src={benefit?.image}
                className='h-[250px] w-full object-cover'
              />

              <div className='mt-2.5 px-5 pb-5'>
                <h3 className='text-lg leading-tight font-semibold text-gray-800'>
                  {benefit.title}
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
          ))}
        </div>
      </div>
    </div>
  )
}

export { Benefit }
