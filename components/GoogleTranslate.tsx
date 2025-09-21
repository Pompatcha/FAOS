'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    google?: {
      translate: {
        TranslateElement: {
          new (
            options: {
              pageLanguage: string
              includedLanguages: string
              layout: number
              autoDisplay: boolean
              multilanguagePage: boolean
            },
            elementId: string,
          ): void
          InlineLayout: { SIMPLE: number }
        }
      }
    }
    googleTranslateElementInit?: () => void
  }
}

const GoogleTranslate = () => {
  useEffect(() => {
    if (!window.google || !window.google.translate) {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src =
        '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      document.body.appendChild(script)

      window.googleTranslateElementInit = () => {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: 'th,en,zh-cn,ja,pt,fr,de,vi,es,it',
              layout:
                window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
              multilanguagePage: true,
            },
            'google_translate_element',
          )
        }
      }
    } else if (window.google && window.google.translate) {
      if (window.googleTranslateElementInit) {
        window.googleTranslateElementInit()
      }
    }
  }, [])

  return (
    <div className='flex items-center gap-2'>
      <div id='google_translate_element' className='google-translate-widget' />

      <style jsx global>{`
        .google-translate-widget .goog-te-gadget {
          font-family: inherit !important;
          font-size: 12px !important;
        }
        .google-translate-widget .goog-te-gadget-simple {
          background-color: #fff !important;
          border: 1px solid #ccc !important;
          border-radius: 4px !important;
          padding: 2px 4px !important;
          font-size: 12px !important;
          display: flex !important;
          align-items: center !important;
        }
        .google-translate-widget .goog-te-gadget-simple .goog-te-menu-value {
          color: #666 !important;
          display: flex !important;
          align-items: center !important;
          white-space: nowrap !important;
        }
        .goog-te-gadget-simple .goog-te-menu-value span:first-child {
          display: none;
        }
        .goog-te-gadget-simple .goog-te-menu-value:before {
          content: 'Translate';
          color: #666;
          margin-right: 4px !important;
        }
        .goog-te-gadget-simple
          .goog-te-menu-value
          span[style='color: rgb(68, 68, 68);'] {
          display: inline !important;
        }
        .goog-te-banner-frame.skiptranslate {
          display: none !important;
        }
        body {
          top: 0px !important;
        }
      `}</style>
    </div>
  )
}

export default GoogleTranslate
