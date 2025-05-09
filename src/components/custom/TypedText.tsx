// components/TypedText.tsx
import { useEffect, useRef } from 'react';
import Typed from 'typed.js';

interface TypedTextProps {
  strings: string[];
  typeSpeed?: number;
  backSpeed?: number;
  loop?: boolean;
}

const TypedText: React.FC<TypedTextProps> = ({
  strings,
  typeSpeed = 50,
  backSpeed = 50,
  loop = true,
}) => {
  const typedRef = useRef<HTMLSpanElement>(null);
  const typedInstance = useRef<Typed | null>(null);

  useEffect(() => {
    if (typedRef.current) {
      typedInstance.current = new Typed(typedRef.current, {
        strings,
        typeSpeed,
        backSpeed,
        loop,
      });
    }

    return () => {
      // Cleanup the Typed.js instance
      typedInstance.current?.destroy();
    };
  }, [strings, typeSpeed, backSpeed, loop]);

  return <span ref={typedRef}></span>;
};

export default TypedText;
