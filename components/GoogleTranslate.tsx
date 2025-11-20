/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useEffect, useRef, useCallback } from 'react'

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
  const translateElementRef = useRef<HTMLDivElement>(null)
  const scriptLoadedRef = useRef(false)
  const widgetInitializedRef = useRef(false)

  const initializeWidget = useCallback(() => {
    if (
      window.google &&
      window.google.translate &&
      translateElementRef.current &&
      !widgetInitializedRef.current
    ) {
      translateElementRef.current.innerHTML = ''

      try {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'th,en,zh-cn,ja,pt,fr,de,vi,es,it',
            layout:
              window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: true,
            multilanguagePage: true,
          },
          'google_translate_element',
        )
        widgetInitializedRef.current = true
      } catch (error) {
        console.error('Google Translate initialization error:', error)
        setTimeout(() => {
          widgetInitializedRef.current = false
          initializeWidget()
        }, 500)
      }
    }
  }, [])

  useEffect(() => {
    widgetInitializedRef.current = false

    const loadGoogleTranslate = () => {
      if (!scriptLoadedRef.current) {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src =
          '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'

        window.googleTranslateElementInit = () => {
          initializeWidget()
        }

        script.onload = () => {
          scriptLoadedRef.current = true
        }

        script.onerror = () => {
          console.error('Failed to load Google Translate script')
          scriptLoadedRef.current = false
        }

        document.head.appendChild(script)
      } else {
        if (window.google && window.google.translate) {
          initializeWidget()
        } else {
          const checkInterval = setInterval(() => {
            if (window.google && window.google.translate) {
              clearInterval(checkInterval)
              initializeWidget()
            }
          }, 100)

          setTimeout(() => clearInterval(checkInterval), 5000)
        }
      }
    }

    loadGoogleTranslate()

    return () => {
      widgetInitializedRef.current = false
      if (translateElementRef.current) {
        translateElementRef.current.innerHTML = ''
      }
    }
  }, [initializeWidget])

  return (
    <div className='flex items-center gap-2'>
      <div
        ref={translateElementRef}
        id='google_translate_element'
        className='google-translate-widget'
      />

      <style jsx global>{`
  /* Google Translate widget styling */
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
    min-width: 120px !important; /* Set minimum width */
  }

  .google-translate-widget .goog-te-gadget-simple .goog-te-menu-value {
    color: #666 !important;
    display: flex !important;
    align-items: center !important;
    white-space: nowrap !important;
    width: 100% !important; /* Make menu fill container */
  }

  .goog-te-gadget-simple .goog-te-menu-value span:first-child {
    display: none;
  }

  .goog-te-gadget-simple .goog-te-menu-value:before {
    content: 'Translate';
    color: #666;
    margin-right: 4px !important;
  }

  /* Fix inline color span */
  .goog-te-gadget-simple .goog-te-menu-value span[style*='color: rgb(68, 68, 68)'] {
    display: inline !important;
  }

  /* Hide Google Translate banner */
  .goog-te-banner-frame.skiptranslate {
    display: none !important;
  }

  body {
    top: 0px !important;
  }

  /* Optional: Adjust dropdown menu width */
  .goog-te-menu-frame {
    width: 200px !important; /* Adjust this as needed */
  }
`}</style>

    </div>
  )
}

export default GoogleTranslate
