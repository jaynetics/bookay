import { FlashMessage } from '../lib'

export const GlobalFlashMessage = () =>
  <FlashMessage>
    {({ content, scrollRef, setContent }) =>
      <div
        // TODO: background
        className='absolute text-center w-11/12 left-0 right-0 top-14 mt-1 mb-1 mr-auto ml-auto'
        ref={scrollRef}
      >
        {content && <p className='relative m-auto max-w-xs border'>
          {content}
          <span
            className='absolute -top-1 right-1 p-1'
            onClick={() => setContent(null)}
          >
            &times;
          </span>
        </p>}
      </div>
    }
  </FlashMessage>
