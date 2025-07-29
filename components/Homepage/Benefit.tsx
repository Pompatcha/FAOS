import { FC } from 'react'

const Benefit: FC = () => {
  const benefits = [
    {
      id: 1,
      title: 'High olive oil consumption associated with longevity',
      image:
        'https://aspirabody.com/storage/elementor/thumbs/Longevity-By-Aspira-Aesthetic-Center-Corp-in-FALL-RIVER-MA-1-qf3mmqufpzghgabxyk3vkfparc8mgbv9docbwy38ts.jpeg',
      alt: 'Elderly couple embracing outdoors',
    },
    {
      id: 2,
      title: 'Benefits of olive oil for the skin and face',
      image:
        'https://images.ctfassets.net/xvcg1y2kwpfh/2VQwmw8jOAH32STx9ztl7F/ce861f738e978b65f1e0211391f4664e/3-1-about-your-babys-skin-en-ae',
      alt: 'Close-up of healthy skin',
    },
    {
      id: 3,
      title: 'Olive oil is beneficial for maternal-fetal health',
      image:
        'https://www.news-medical.net/images/news/ImageForNews_734804_16727928629362084.jpg',
      alt: 'Pregnant woman with olive oil bottle',
    },
    {
      id: 4,
      title: 'mediterranean diet food with olive oil',
      image:
        'https://www.tasteofhome.com/wp-content/uploads/2018/01/Dad-s-Greek-Salad_EXPS_TOHAM25_189184_P2_MD_03_01_7b-e1724861544942.jpg',
      alt: 'Pregnant woman with olive oil bottle',
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
              <div className='p-6'>
                <div className='mb-4 flex items-start gap-4'>
                  <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-lg font-bold text-green-700'>
                    {benefit.id}
                  </div>
                  <div className='h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100'>
                    <div className='flex h-full w-full items-center justify-center'>
                      <img
                        src={benefit?.image}
                        className='size-32 object-contain'
                      />
                    </div>
                  </div>
                </div>

                <h3 className='mb-4 text-lg leading-tight font-semibold text-gray-800'>
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
