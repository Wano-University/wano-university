import { motion } from 'framer-motion';
import lgimg from '@/assets/wanouni.png';
import smimg from '@/assets/wanoportrait.png';

export default function Landing() {
  return (
    <motion.div
      className="fixed inset-0 w-screen h-screen"
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <div className="fixed inset-0 -z-10 w-screen h-screen">
        <img
          src={lgimg}
          alt="Wano University"
          className="hidden lg:block w-full h-full object-cover object-center"
        />

        <img
          src={smimg}
          alt="Wano University"
          className="block lg:hidden w-full h-full object-cover object-center"
        />
      </div>
    </motion.div>
  );
}
