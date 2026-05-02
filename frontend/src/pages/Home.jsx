import lgimg from '@/assets/wanouni.png';
import smimg from '@/assets/wanoportrait.png';

export default function Home() {
  return (
    <div className="w-full h-screen overflow-hidden">
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
  );
}
