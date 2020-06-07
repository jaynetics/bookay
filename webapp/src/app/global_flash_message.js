/** @jsx h */
import { h } from 'preact'
import { FlashMessage } from '../lib'

export const GlobalFlashMessage = () =>
  <FlashMessage>
    {({ content, scrollRef, setContent }) =>
      <div className='flash-container' ref={scrollRef}>
        {content && <p className='flash-message'>
          {content}
          <span className='flash-closer' onClick={() => setContent(null)}>&times;</span>
        </p>}
      </div>
    }
  </FlashMessage>
