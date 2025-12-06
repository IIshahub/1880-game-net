import { useEffect } from 'react';
import { queueMove } from '../components/Player';

export function useGameControls() {
  useEffect(() => {
    // اضافه کردن رویداد کلیک برای دکمه‌ها
    const forwardBtn = document.getElementById('forward');
    const backwardBtn = document.getElementById('backward');
    const leftBtn = document.getElementById('left');
    const rightBtn = document.getElementById('right');

    const handleForward = () => queueMove('forward');
    const handleBackward = () => queueMove('backward');
    const handleLeft = () => queueMove('left');
    const handleRight = () => queueMove('right');

    forwardBtn?.addEventListener('click', handleForward);
    backwardBtn?.addEventListener('click', handleBackward);
    leftBtn?.addEventListener('click', handleLeft);
    rightBtn?.addEventListener('click', handleRight);

    // اضافه کردن رویداد کیبورد
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        queueMove('forward');
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        queueMove('backward');
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        queueMove('left');
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        queueMove('right');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      forwardBtn?.removeEventListener('click', handleForward);
      backwardBtn?.removeEventListener('click', handleBackward);
      leftBtn?.removeEventListener('click', handleLeft);
      rightBtn?.removeEventListener('click', handleRight);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
}

